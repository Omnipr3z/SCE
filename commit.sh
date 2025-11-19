#!/bin/bash

# Assistant interactif pour créer un commit Git multi-lignes pour Bash (WSL).

# --- NOUVEAU : Vérifier si la branche locale est à jour avec le dépôt distant ---
echo "[INFO] Vérification de la synchronisation avec le dépôt distant..."
git fetch

# Vérifie si la branche locale est en retard (behind)
if git status -uno | grep -q "Your branch is behind"; then
    echo ""
    echo "======================================================================"
    echo "‼️  ATTENTION : Votre branche locale est en retard sur le dépôt distant."
    echo "======================================================================"
    echo "Vous ne pourrez pas 'push' vos changements sans mettre à jour."
    echo ""
    echo "IMPORTANT : Faire 'git pull' peut écraser vos modifications locales"
    echo "non-commitées. Sauvegardez-les en dehors du répertoire si nécessaire."
    echo ""
    read -p "Voulez-vous faire 'git pull' maintenant ? (y/N): " PULL_CONFIRM
    if [[ "$PULL_CONFIRM" =~ ^[Yy]$ ]]; then
        git pull
    else
        echo "[INFO] Opération annulée. Veuillez synchroniser votre branche manuellement avant de commiter."
        exit 1
    fi
fi

# --- NOUVEAU : Afficher les fichiers modifiés avant de commencer ---
echo "--- État actuel du dépôt ---"
STATUS=$(git status --short)

if [ -z "$STATUS" ]; then
    echo "Aucun changement à commiter. Espace de travail propre."
    echo "-------------------------------------"
    exit 0
else
    echo "$STATUS"
    echo "-------------------------------------"
    echo ""
    read -p "Voulez-vous ajouter tous les fichiers modifiés/nouveaux à l'index (git add .) ? (y/N): " ADD_ALL_CONFIRM
    if [[ "$ADD_ALL_CONFIRM" =~ ^[Yy]$ ]]; then
        git add .
        echo "[INFO] Fichiers ajoutés à l'index."
    else
        echo "[INFO] Ajout automatique ignoré. Assurez-vous d'avoir ajouté manuellement les fichiers souhaités."
    fi
    echo ""
    # Re-vérifier le statut pour s'assurer qu'il y a quelque chose à commiter après l'add (ou si l'utilisateur a ignoré l'add)
    # On cherche spécifiquement les fichiers stagés (M, A, D, R, C en première colonne)
    STAGED_STATUS=$(git status --porcelain | grep "^[AMDRC]")
    if [ -z "$STAGED_STATUS" ]; then
        echo "[ATTENTION] Aucun fichier n'est stagé pour le commit. Annulation."
        exit 1
    fi
fi

# --- 1 & 2. Demander le titre et récupérer la date ---
echo ""
while true; do
    read -p "Titre du commit (max 50 caractères): " TITLE
    if [ ${#TITLE} -le 50 ]; then
        break
    else
        echo "Erreur : Le titre ne doit pas dépasser 50 caractères. Il en contient ${#TITLE}."
    fi
done
if [ -z "$TITLE" ]; then
    echo "[ERREUR] Le titre ne peut pas être vide."
    exit 1
fi

# --- NOUVEAU : Ajouter la date au titre ---
DATE=$(date +%Y-%m-%d)
FINAL_TITLE="$TITLE [$DATE]"

# --- 3 & 4. Demander les lignes de description en boucle ---
echo ""
echo "Entrez les lignes de description une par une (max 50 caractères par ligne)."
echo "Indiquer pour chacune le QUOI et le POURQUOI pas le COMMENT."
echo "Laissez vide et appuyez sur Entrée pour terminer."
echo ""

BODY_CONTENT=""
line_num=1

while true; do
    read -p "[Ligne $line_num]: " LINE
    if [ -z "$LINE" ]; then
        break
    fi

    if [ ${#LINE} -gt 50 ]; then
        echo "Erreur : La ligne ne doit pas dépasser 50 caractères. Veuillez la réécrire."
        continue # Reste dans la boucle pour la même ligne
    fi

    # Concatène les lignes de description dans une seule variable avec des sauts de ligne
    if [ -z "$BODY_CONTENT" ]; then
        BODY_CONTENT="$LINE"
    else
        BODY_CONTENT+=$'\n'"$LINE"
    fi
    ((line_num++))
done

# Construit le message de commit complet avec une ligne vide entre le titre et le corps.
if [ -n "$BODY_CONTENT" ]; then
    COMMIT_MESSAGE="$FINAL_TITLE"$'\n\n'"$BODY_CONTENT"
else
    COMMIT_MESSAGE="$FINAL_TITLE"
fi

# Utilise un seul -m avec le message complet.
MESSAGES=("-m" "$COMMIT_MESSAGE")

# --- 5. Composer et afficher la commande finale pour confirmation ---
clear
echo "--- COMMIT À VALIDER ---"
echo ""
echo "Titre: $FINAL_TITLE"
echo ""
echo "Description:"
if [ -n "$BODY_CONTENT" ]; then
    echo -e "$BODY_CONTENT"
else
    echo "(aucune)"
fi
echo "------------------------"
echo ""
echo "Commande qui sera exécutée :"
# Affiche la commande complète avec les guillemets corrects
echo "git commit" "${MESSAGES[@]}"
echo ""

# --- 6. Demander la confirmation ---
read -p "Confirmez-vous le commit ? (y/N): " CONFIRM

if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo ""
    echo "[INFO] Exécution du commit..."
    # On vérifie si le commit a réussi avant de proposer le push
    if git commit "${MESSAGES[@]}"; then
        echo ""
        echo "--- Push des changements ---"
        
        # Récupère le nom de la branche actuelle
        CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

        # Vérifie si la branche locale suit déjà une branche distante
        if git rev-parse --abbrev-ref --symbolic-full-name @{u} &> /dev/null; then
            # CAS 1: La branche est déjà liée
            read -p "Voulez-vous pousser les changements sur 'origin/$CURRENT_BRANCH' (git push) ? (y/N): " PUSH_CONFIRM
            if [[ "$PUSH_CONFIRM" =~ ^[Yy]$ ]]; then
                git push
            else
                echo "[INFO] Push annulé."
            fi
        else
            # CAS 2: La branche n'est pas liée
            echo "[ATTENTION] Votre branche locale '$CURRENT_BRANCH' ne suit aucune branche distante."
            
            PS3="Que voulez-vous faire ? "
            options=(
                "Créer une nouvelle branche sur l'origine ('$CURRENT_BRANCH') et la lier"
                "Pousser sur une branche distante existante"
                "Ne rien faire"
            )
            select opt in "${options[@]}"; do
                case $opt in
                    "Créer une nouvelle branche sur l'origine ('$CURRENT_BRANCH') et la lier")
                        echo "[INFO] Exécution de: git push --set-upstream origin $CURRENT_BRANCH"
                        git push --set-upstream origin "$CURRENT_BRANCH"
                        break
                        ;;
                    "Pousser sur une branche distante existante")
                        REMOTE_BRANCHES=($(git branch -r | sed 's/ *origin\///'))
                        echo "Choisissez la branche distante sur laquelle pousser :"
                        select rb in "${REMOTE_BRANCHES[@]}"; do
                            echo "[INFO] Exécution de: git push origin $CURRENT_BRANCH:$rb"
                            git push origin "$CURRENT_BRANCH:$rb"
                            break
                        done
                        break
                        ;;
                    "Ne rien faire")
                        echo "[INFO] Push annulé."
                        break
                        ;;
                    *) echo "Option invalide $REPLY";;
                esac
            done
        fi
    fi
else
    echo ""
    echo "[INFO] Commande annulée."
fi