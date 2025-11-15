#!/bin/bash

# Assistant interactif pour terminer une branche de fonctionnalité (feature branch).
# Ce script va :
# 1. Mettre à jour la branche de feature avec la branche de base (develop/main).
# 2. Fusionner la branche de feature dans la branche de base.
# 3. Supprimer la branche de feature localement et à distance.

# --- Fonctions utilitaires ---
function print_header() {
    echo ""
    echo "======================================================================"
    echo " $1"
    echo "======================================================================"
    echo ""
}

# --- 1. Vérifications initiales ---
print_header "VÉRIFICATION DE L'ENVIRONNEMENT"

# Vérifier les changements non commités
if ! git diff-index --quiet HEAD --; then
    echo "‼️  ATTENTION : Vous avez des modifications non commitées."
    git status --short
    echo ""
    echo "Veuillez commiter ou 'stash' vos changements avant de continuer."
    exit 1
fi

# Identifier la branche de feature actuelle
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ ! "$CURRENT_BRANCH" =~ ^feature/ ]]; then
    echo "[ERREUR] Vous n'êtes pas sur une branche de fonctionnalité (doit commencer par 'feature/')."
    echo "Branche actuelle : '$CURRENT_BRANCH'"
    exit 1
fi

echo "[INFO] Branche de fonctionnalité à terminer : '$CURRENT_BRANCH'"

# Déterminer la branche de base (develop ou main)
BASE_BRANCH=""
if git show-ref --verify --quiet refs/heads/develop; then
    BASE_BRANCH="develop"
elif git show-ref --verify --quiet refs/heads/main; then
    BASE_BRANCH="main"
else
    echo "[ERREUR] Impossible de trouver une branche de base 'develop' ou 'main'."
    exit 1
fi

echo "[INFO] La branche sera fusionnée dans : '$BASE_BRANCH'"

read -p "Confirmez-vous pour continuer ? (Y/n): " CONFIRM_START
if [[ "$CONFIRM_START" =~ ^[Nn]$ ]]; then
    echo "[INFO] Opération annulée."
    exit 0
fi

# --- 2. Synchronisation ---
print_header "SYNCHRONISATION DES BRANCHES"

echo "[INFO] Mise à jour de la branche de base '$BASE_BRANCH'..."
git checkout "$BASE_BRANCH" > /dev/null 2>&1
if ! git pull; then
    echo "[ERREUR] 'git pull' sur '$BASE_BRANCH' a échoué. Veuillez résoudre le problème manuellement."
    exit 1
fi

echo "[INFO] Retour sur '$CURRENT_BRANCH' pour la synchroniser..."
git checkout "$CURRENT_BRANCH" > /dev/null 2>&1

echo "[INFO] Fusion de '$BASE_BRANCH' dans '$CURRENT_BRANCH'..."
if ! git merge "$BASE_BRANCH"; then
    echo "‼️  CONFLIT DE FUSION DÉTECTÉ !"
    echo "Veuillez résoudre les conflits dans les fichiers listés ci-dessus."
    echo "Une fois les conflits résolus, faites un commit, puis relancez ce script."
    exit 1
fi

echo "[INFO] Poussée de la branche de fonctionnalité mise à jour (au cas où il y aurait une Pull Request)..."
git push

# --- 3. Fusion finale ---
print_header "FUSION DE LA FONCTIONNALITÉ"

echo "[INFO] Passage à la branche '$BASE_BRANCH' pour la fusion..."
git checkout "$BASE_BRANCH" > /dev/null 2>&1

MERGE_COMMIT_MSG="Merge branch '$CURRENT_BRANCH' into '$BASE_BRANCH'"
echo "[INFO] Message du commit de fusion : \"$MERGE_COMMIT_MSG\""

echo "[INFO] Fusion de '$CURRENT_BRANCH' dans '$BASE_BRANCH' avec --no-ff..."
if ! git merge --no-ff -m "$MERGE_COMMIT_MSG" "$CURRENT_BRANCH"; then
    echo "[ERREUR] La fusion finale a échoué. Un conflit inattendu est peut-être survenu."
    echo "Veuillez résoudre le problème manuellement."
    exit 1
fi

echo "[INFO] Poussée de la branche '$BASE_BRANCH' mise à jour vers l'origine..."
if ! git push; then
    echo "[ERREUR] 'git push' sur '$BASE_BRANCH' a échoué. Veuillez vérifier votre connexion ou les permissions."
    exit 1
fi

echo "✅ La fonctionnalité a été fusionnée et poussée avec succès dans '$BASE_BRANCH' !"

# --- 4. Nettoyage ---
print_header "NETTOYAGE DE LA BRANCHE"

read -p "Voulez-vous supprimer la branche '$CURRENT_BRANCH' localement et à distance ? (Y/n): " CONFIRM_DELETE
if [[ "$CONFIRM_DELETE" =~ ^[Nn]$ ]]; then
    echo "[INFO] Nettoyage annulé. Vous pouvez supprimer la branche manuellement plus tard avec :"
    echo "  git branch -d $CURRENT_BRANCH"
    echo "  git push origin --delete $CURRENT_BRANCH"
    exit 0
fi

echo "[INFO] Suppression de la branche locale '$CURRENT_BRANCH'..."
git branch -d "$CURRENT_BRANCH"

echo "[INFO] Suppression de la branche distante '$CURRENT_BRANCH'..."
git push origin --delete "$CURRENT_BRANCH"

echo ""
echo "🎉 Opération terminée ! La branche a été nettoyée."