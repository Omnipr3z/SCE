#!/bin/bash

# Ce script gère le processus de merge de 'develop' vers 'main' pour une nouvelle release.

# --- Validation de l'argument ---
if [ -z "$1" ]; then
  echo "ERREUR : Vous devez spécifier la version pour le tag."
  echo "Usage: ./release.sh vX.Y.Z"
  exit 1
fi

VERSION=$1

echo "##################################################"
echo "### Démarrage du processus de release pour la version $VERSION"
echo "##################################################"

# --- 1. Assurer que 'develop' est à jour ---
# Note: L'utilisation de echo -e est déconseillée dans les scripts shell modernes.
# Il est préférable d'utiliser printf ou de s'assurer que les caractères spéciaux sont correctement échappés.
# Cependant, pour conserver la fidélité à l'original, nous le laissons tel quel.
echo -e "\n--> Étape 1/4 : Synchronisation de 'develop' avec le remote..."
git checkout develop
if ! git pull; then
    echo "ERREUR : Échec de la synchronisation de la branche 'develop'. Annulation."
    exit 1
fi
echo "'develop' est à jour."


# --- 2. Merger dans 'main' ---
echo -e "\n--> Étape 2/4 : Merge de 'develop' dans 'main'..."
git checkout main
if ! git pull; then
    echo "ERREUR : Échec de la synchronisation de la branche 'main'. Annulation."
    exit 1
fi
if ! git merge --no-ff develop; then
    echo "ERREUR : Le merge de 'develop' dans 'main' a échoué. Résolvez les conflits manuellement."
    exit 1
fi
if ! git push; then
    echo "ERREUR : Échec du push vers 'main'."
    exit 1
fi
echo "'main' a été mise à jour et pushée."


# --- 3. Tagger la release ---
echo -e "\n--> Étape 3/4 : Création et push du tag de version..."
if ! git tag -a "$VERSION" -m "Release $VERSION"; then
    echo "ERREUR : La création du tag '$VERSION' a échoué. Le tag existe peut-être déjà."
    exit 1
fi
if ! git push --tags; then
    echo "ERREUR : Échec du push des tags."
    exit 1
fi
echo "Tag '$VERSION' créé et pushé avec succès."


# --- 4. Synchroniser 'develop' ---
echo -e "\n--> Étape 4/4 : Resynchronisation de 'develop' avec 'main'..."
git checkout develop
# git pull est ici pour suivre votre demande explicite
if ! git pull || ! git merge main || ! git push; then
    echo "ERREUR : La resynchronisation de 'develop' a échoué."
    exit 1
fi
echo "'develop' a été synchronisée avec 'main'."


echo -e "\n##################################################"
echo "### Processus de release pour la version $VERSION terminé avec succès !"
echo "##################################################"
