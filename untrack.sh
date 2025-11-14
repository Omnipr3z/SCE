#!/bin/bash

# Assistant interactif pour arrêter de suivre un fichier/dossier,
# l'ajouter au .gitignore, et commiter le changement.

# --- NOUVEAU : Vérifier si des fichiers sont déjà stagés ---
STAGED_FILES=$(git diff --name-only --cached)

if [ -n "$STAGED_FILES" ]; then
    echo "======================================================================"
    echo "‼️  ATTENTION : Vous avez des fichiers déjà en attente de commit (stagés)."
    echo "======================================================================"
    echo "Fichiers concernés :"
    echo "$STAGED_FILES"
    echo ""
    echo "Pour garantir un commit propre, il est recommandé de les retirer de la zone de staging."
    read -p "Voulez-vous 'unstager' ces fichiers maintenant (git reset) ? (y/N): " UNSTAGE_CONFIRM
    if [[ "$UNSTAGE_CONFIRM" =~ ^[Yy]$ ]]; then
        git reset
        echo "[INFO] Fichiers retirés de la zone de staging. Vos modifications locales sont conservées."
    else
        echo "[INFO] Opération annulée. Veuillez gérer les fichiers stagés manuellement."
        exit 1
    fi
fi

echo ""
read -p "Entrez le chemin du fichier/dossier à ignorer et dé-suivre: " TARGET_PATH

# --- 1. Validation de l'entrée ---
if [ -z "$TARGET_PATH" ]; then
    echo "[ERREUR] Le chemin ne peut pas être vide."
    exit 1
fi

# Vérifie si le chemin existe, et demande confirmation s'il n'existe pas
if [ ! -e "$TARGET_PATH" ]; then
    echo "[ATTENTION] Le chemin '$TARGET_PATH' n'existe pas."
    read -p "Voulez-vous quand même l'ajouter au .gitignore et essayer de le dé-suivre ? (y/N): " NON_EXIST_CONFIRM
    if [[ ! "$NON_EXIST_CONFIRM" =~ ^[Yy]$ ]]; then
        echo "[INFO] Opération annulée."
        exit 0
    fi
fi

# --- 2. Afficher le plan et demander confirmation ---
clear
echo "--- OPÉRATION À VALIDER ---"
echo "Le script va effectuer les actions suivantes :"
echo ""
echo "1. Ajouter la ligne suivante au fichier .gitignore :"
echo "   $TARGET_PATH"
echo ""
echo "2. Retirer '$TARGET_PATH' du suivi de Git (en le gardant en local) avec la commande :"
echo "   git rm -r --cached \"$TARGET_PATH\""
echo ""
echo "3. Créer un commit avec le message :"
echo "   Chore: Untrack and ignore '$TARGET_PATH'"
echo ""
echo "---------------------------"
echo ""
read -p "Confirmez-vous cette opération ? (y/N): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "[INFO] Opération annulée."
    exit 0
fi

# --- 3. Exécution des commandes ---
echo ""
echo "[INFO] Ajout de '$TARGET_PATH' au .gitignore..."
echo "" >> .gitignore # Ajoute une ligne vide pour la lisibilité
echo "$TARGET_PATH" >> .gitignore

echo "[INFO] Retrait de '$TARGET_PATH' de l'index Git..."
git rm -r --cached "$TARGET_PATH"

echo "[INFO] Création du commit..."
git add .gitignore
git commit -m "Chore: Untrack and ignore '$TARGET_PATH'"

# --- 4. Proposer le push ---
echo ""
read -p "Voulez-vous pousser ce changement sur le dépôt distant (git push) ? (y/N): " PUSH_CONFIRM
if [[ "$PUSH_CONFIRM" =~ ^[Yy]$ ]]; then
    git push
else
    echo "[INFO] Push annulé. N'oubliez pas de le faire manuellement plus tard."
fi

echo ""
echo "[INFO] Opération terminée avec succès !"