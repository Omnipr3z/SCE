#!/bin/bash

# Assistant pour initialiser la branche 'develop' dans un projet
# basé sur le modèle Git Flow.
# Ce script est conçu pour être exécuté une seule fois par projet.

# --- Fonctions utilitaires ---
function print_header() {
    echo ""
    echo "======================================================================"
    echo " $1"
    echo "======================================================================"
    echo ""
}

print_header "INITIALISATION DE LA BRANCHE 'DEVELOP'"

# --- 1. Vérifications initiales ---

# Vérifier les changements non commités
if ! git diff-index --quiet HEAD --; then
    echo "‼️  ATTENTION : Vous avez des modifications non commitées."
    git status --short
    echo ""
    echo "Veuillez commiter ou 'stash' vos changements avant de commencer."
    exit 1
fi

# Vérifier si la branche 'develop' existe déjà (localement ou à distance)
if git show-ref --verify --quiet refs/heads/develop || git ls-remote --exit-code --heads origin develop > /dev/null 2>&1; then
    echo "[INFO] La branche 'develop' existe déjà pour ce projet."
    echo "Ce script est destiné à une initialisation unique. Opération annulée."
    exit 0
fi

# --- 2. Déterminer la branche de base (main ou master) ---
BASE_BRANCH=""
if git show-ref --verify --quiet refs/heads/main; then
    BASE_BRANCH="main"
elif git show-ref --verify --quiet refs/heads/master; then
    BASE_BRANCH="master"
else
    echo "[ERREUR] Impossible de trouver une branche de base 'main' ou 'master'."
    echo "Veuillez vous assurer que votre projet a une branche principale initialisée."
    exit 1
fi

echo "Ce script va créer et pousser une nouvelle branche 'develop' à partir de '$BASE_BRANCH'."
echo "C'est une opération à faire une seule fois par projet."
echo ""

read -p "Confirmez-vous pour continuer ? (Y/n): " CONFIRM_START
if [[ "$CONFIRM_START" =~ ^[Nn]$ ]]; then
    echo "[INFO] Opération annulée."
    exit 0
fi

# --- 3. Création et push de la branche ---
print_header "CRÉATION DE LA BRANCHE 'DEVELOP'"

echo "[INFO] Passage à la branche '$BASE_BRANCH' et mise à jour..."
if ! git checkout "$BASE_BRANCH" || ! git pull; then
    echo "[ERREUR] Impossible de se placer sur la branche '$BASE_BRANCH' ou de la mettre à jour."
    exit 1
fi

echo "[INFO] Création de la branche 'develop' localement..."
git branch develop

echo "[INFO] Poussée de la nouvelle branche 'develop' sur le dépôt distant..."
if ! git push -u origin develop; then
    echo "[ERREUR] Impossible de pousser la branche 'develop' sur l'origine."
    echo "Vérifiez votre connexion et vos permissions sur le dépôt."
    # Nettoyage en cas d'échec du push
    git branch -d develop
    exit 1
fi

echo ""
echo "✅ Succès ! La branche 'develop' a été créée et est maintenant disponible sur le dépôt distant."
echo "Vos scripts 'startFeature.sh' et 'finishFeature.sh' l'utiliseront automatiquement."

read -p "Voulez-vous basculer sur la branche 'develop' maintenant ? (Y/n): " SWITCH_NOW
if [[ "$SWITCH_NOW" =~ ^[Yy]$ ]]; then
    git checkout develop
    echo "[INFO] Vous êtes maintenant sur la branche 'develop'."
fi

echo ""
echo "🎉 Configuration Git Flow terminée pour ce projet !"