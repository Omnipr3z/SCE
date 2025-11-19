#!/bin/bash

# Assistant interactif pour démarrer une nouvelle branche de fonctionnalité (feature branch).

# --- Fonctions utilitaires ---
function print_header() {
    echo ""
    echo "======================================================================"
    echo " $1"
    echo "======================================================================"
    echo ""
}

# --- 1. Déterminer la branche de base (develop ou main) ---
BASE_BRANCH=""
# On cherche d'abord 'develop', puis 'main'
if git show-ref --verify --quiet refs/heads/develop; then
    BASE_BRANCH="develop"
elif git show-ref --verify --quiet refs/heads/main; then
    BASE_BRANCH="main"
else
    # Si ni develop ni main n'existent localement, on demande à l'utilisateur
    echo "[ATTENTION] Impossible de trouver les branches 'develop' ou 'main' localement."
    read -p "Veuillez entrer le nom de la branche de base pour la nouvelle fonctionnalité: " BASE_BRANCH
    if [ -z "$BASE_BRANCH" ]; then
        echo "[ERREUR] Le nom de la branche de base ne peut pas être vide."
        exit 1
    fi
fi

echo "[INFO] La nouvelle fonctionnalité sera basée sur la branche : '$BASE_BRANCH'"
read -p "Est-ce correct ? (Y/n): " CONFIRM_BASE
if [[ "$CONFIRM_BASE" =~ ^[Nn]$ ]]; then
    read -p "Veuillez entrer le nom de la branche de base correcte: " BASE_BRANCH
    if [ -z "$BASE_BRANCH" ]; then
        echo "[ERREUR] Le nom de la branche de base ne peut pas être vide."
        exit 1
    fi
fi

print_header "SYNCHRONISATION DE LA BRANCHE DE BASE"

# --- 2. Vérifier les changements non commités ---
if ! git diff-index --quiet HEAD --; then
    echo "‼️  ATTENTION : Vous avez des modifications non commitées."
    git status --short
    echo ""
    echo "Le passage à la branche '$BASE_BRANCH' pourrait échouer ou écraser des changements."
    echo "Veuillez commiter ou 'stash' vos changements avant de continuer."
    exit 1
fi

# --- 3. Se placer sur la branche de base et la synchroniser ---
echo "[INFO] Passage à la branche '$BASE_BRANCH'..."
if ! git checkout "$BASE_BRANCH"; then
    echo "[ERREUR] Impossible de changer de branche. Veuillez résoudre le problème manuellement."
    exit 1
fi

echo "[INFO] Récupération des dernières informations du dépôt distant (git fetch)..."
git fetch

echo "[INFO] Mise à jour de la branche locale '$BASE_BRANCH' (git pull)..."
if ! git pull; then
    echo "[ERREUR] 'git pull' a échoué. Il y a peut-être des conflits à résoudre."
    exit 1
fi

echo "[INFO] La branche '$BASE_BRANCH' est maintenant à jour."

print_header "CRÉATION DE LA NOUVELLE BRANCHE"

# --- 4. Choisir le type de branche ---
echo "Choisissez le type de branche :"
options=("feature" "hotfix" "refacto" "doc")
PS3="Votre choix (entrez le numéro): "
select opt in "${options[@]}"
do
    case $opt in
        "feature"|"hotfix"|"refacto"|"doc")
            BRANCH_PREFIX="$opt/"
            echo "[INFO] Préfixe de branche sélectionné : '$BRANCH_PREFIX'"
            break
            ;;
        *) echo "Option invalide '$REPLY'. Veuillez choisir 1, 2, 3, ou 4.";;
    esac
done

# --- 5. Demander le nom de la branche ---
read -p "Description de la branche (ex: page-contact, bug-connexion): " BRANCH_DESCRIPTION

if [ -z "$BRANCH_DESCRIPTION" ]; then
    echo "[ERREUR] La description ne peut pas être vide."
    exit 1
fi

# Nettoyage du nom pour en faire un nom de branche valide
BRANCH_NAME_SLUG=$(echo "$BRANCH_DESCRIPTION" | iconv -t ascii//TRANSLIT | sed -r 's/[^a-zA-Z0-9]+/-/g' | sed -r 's/^-+|-+$//g' | tr '[:upper:]' '[:lower:]')

FINAL_BRANCH_NAME="$BRANCH_PREFIX$BRANCH_NAME_SLUG"

echo ""
echo "La branche suivante va être créée :"
echo "  -> $FINAL_BRANCH_NAME"
echo ""

# --- 6. Confirmer et créer la branche ---
read -p "Confirmez-vous la création de cette branche ? (Y/n): " CONFIRM_CREATE
if [[ "$CONFIRM_CREATE" =~ ^[Nn]$ ]]; then
    echo "[INFO] Opération annulée."
    exit 0
fi

echo ""
echo "[INFO] Création de la branche '$FINAL_BRANCH_NAME'..."
git checkout -b "$FINAL_BRANCH_NAME"

echo ""
echo "✅ Succès ! Vous êtes maintenant sur votre nouvelle branche '$FINAL_BRANCH_NAME'."
echo "Bon développement !"