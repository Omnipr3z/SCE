#!/bin/bash

# Assistant interactif pour créer un commit Git multi-lignes pour Bash (WSL).

# --- 1 & 2. Demander le titre ---
echo ""
read -p "Titre du commit: " TITLE
if [ -z "$TITLE" ]; then
    echo "[ERREUR] Le titre ne peut pas être vide."
    exit 1
fi

# --- 3 & 4. Demander les lignes de description en boucle ---
echo ""
echo "Entrez les lignes de description une par une."
echo "Laissez vide et appuyez sur Entrée pour terminer."
echo ""

# Utilise un tableau pour stocker les messages, c'est plus sûr
MESSAGES=("-m" "$TITLE")
DESC_LINES=""
line_num=1

while true; do
    read -p "[Ligne $line_num]: " LINE
    if [ -z "$LINE" ]; then
        break
    fi
    MESSAGES+=("-m" "$LINE")
    DESC_LINES+="$LINE\n"
    ((line_num++))
done

# --- 5. Composer et afficher la commande finale pour confirmation ---
clear
echo "--- COMMIT À VALIDER ---"
echo ""
echo "Titre: $TITLE"
echo ""
echo "Description:"
if [ -n "$DESC_LINES" ]; then
    echo -e "$DESC_LINES" # -e pour interpréter le \n
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
    git commit "${MESSAGES[@]}"
else
    echo ""
    echo "[INFO] Commande annulée."
fi