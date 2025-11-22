#!/bin/bash

# Assistant interactif pour préparer une branche de fonctionnalité (feature branch) pour une Pull Request.
# Ce script va :
# 1. Mettre à jour la branche de feature avec les derniers changements de la branche de base (develop/main).
# 2. Pousser la branche de feature à jour sur le dépôt distant.
# 3. Afficher les instructions pour créer la Pull Request.

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

# Identifier la branche de travail actuelle
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ ! "$CURRENT_BRANCH" =~ ^(feature|hotfix|refacto|doc)/ ]]; then
    echo "[ERREUR] Vous n'êtes pas sur une branche de travail valide (doit commencer par 'feature/', 'hotfix/', 'refacto/' ou 'doc/')."
    echo "Branche actuelle : '$CURRENT_BRANCH'"
    exit 1
fi

echo "[INFO] Branche de travail à terminer : '$CURRENT_BRANCH'"

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

# --- 3. Création de la Pull Request ---
print_header "PRÊT POUR LA PULL REQUEST"

echo "✅ La branche '$CURRENT_BRANCH' a été synchronisée et poussée avec succès."
echo ""
echo "Prochaine étape : Créez une Pull Request (PR) sur votre plateforme Git (GitHub)."
echo ""
echo "  De la branche : $CURRENT_BRANCH"
echo "  Vers la branche : $BASE_BRANCH"
echo ""
echo "Une fois la PR validée et mergée, la branche de fonctionnalité sera automatiquement supprimée (si configuré sur la plateforme)."
echo ""
echo "🎉 Opération terminée ! La branche est prête pour la revue."

# --- 4. Retour à la branche de base ---
echo ""
echo "[INFO] Retour à la branche '$BASE_BRANCH' pour continuer le travail."
git checkout "$BASE_BRANCH" > /dev/null 2>&1