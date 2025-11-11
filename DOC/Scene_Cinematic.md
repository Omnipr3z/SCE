# SimCraft Engine - Système de Cinématiques

![Version](https://img.shields.io/badge/Version-1.0.3-blue)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

Le système de Cinématiques est un module puissant conçu pour créer des scènes narratives complexes, animées et multi-couches, entièrement pilotées par des fichiers de données JSON. Il permet de réaliser des introductions, des cutscenes ou des dialogues de style "visual novel" sans écrire de code d'événement complexe.

---

## ➤ Philosophie

La création de scènes complexes avec le système d'événements de RPG Maker peut vite devenir un enchevêtrement de commandes. Ce module adopte une approche "data-driven" pour résoudre ce problème.

1.  **Déclaratif, pas Impératif** : Vous ne programmez pas la scène, vous la décrivez. Chaque cinématique est un fichier JSON qui décrit, séquence par séquence, ce qui doit apparaître à l'écran, quels sons doivent être joués et quels textes doivent être affichés.
2.  **Puissance Visuelle** : Le système gère de multiples couches de sprites (`layers`), permettant des effets de parallaxe, des animations de personnages, des fondus et des mouvements complexes.
3.  **Contrôle Temporel** : Chaque séquence peut s'enchaîner automatiquement ou attendre une action du joueur (`needPressOk`), vous donnant un contrôle total sur le rythme de la narration.
4.  **Extensibilité** : Le système est conçu pour être facilement extensible. De nouvelles commandes ou de nouveaux comportements peuvent être ajoutés en modifiant la scène, sans toucher aux données.

---

## ➤ Les Fichiers du Module

1.  **`configs/SC_CinematicConfig.js`** : Le fichier de configuration où vous déclarez les fichiers de données de cinématiques (`.json`) que le moteur doit charger au démarrage.
2.  **`scenes/Scene_Cinematics.js`** : Le cœur logique. Cette classe de scène lit les données JSON, crée les sprites, gère les animations et l'enchaînement des séquences.
3.  **`windows/Window_Story.js`** : La fenêtre spécialisée utilisée par la scène pour afficher les textes narratifs.
4.  **Les fichiers de données JSON** : Situés dans `data/SC/Cinematics/`, ce sont vos "scripts" de cinématiques.

---

## ➤ Guide d'Utilisation

### Étape 1 : Créer le Fichier de Données de la Cinématique

1.  Créez un nouveau fichier JSON dans le dossier `data/SC/Cinematics/` (par exemple, `Prologue.json`).
2.  Structurez ce fichier en suivant le format ci-dessous.

**Structure d'un fichier de cinématique :**

```json
{
    "name": "Prologue",
    "backgrounds": ["bg1", "bg2"],
    "endBackgrounds": [],
    "skipMode": { "enabled": true, "mode": "always" },
    "endNext": { "type": "Map", "mapId": 1, "mapPos": { "x": 10, "y": 10, "d": 2 } },
    "sequencies": [
        // Séquence 1: Apparition d'un personnage
        {
            "audio": { "bgm": { "name": "Theme", "volume": 80 } },
            "layers": {
                "1": { "bitmap": "character1", "opacityGoal": 255, "fadeSpeed": 5 }
            }
        },
        // Séquence 2: Affichage de texte
        {
            "needPressOk": true,
            "storyWindow": { "txt": "Le voyage commence..." }
        },
        // Séquence 3: Mouvement du personnage
        {
            "layers": {
                "1": { "xGoal": 800, "moveSpeed": 2 }
            }
        },
        // Séquence 4: Disparition et fin
        {
            "layers": {
                "1": { "opacityGoal": 0, "fadeSpeed": 5 }
            }
        }
    ]
}
```

**Propriétés principales :**
*   `name`: Nom unique de la cinématique.
*   `backgrounds`: Liste des images de fond à charger depuis `img/cinematics/Bg/`.
*   `skipMode`: Définit si la cinématique peut être passée (`enabled`) et quand (`always`, `never`, `saveExisting`).
*   `endNext`: Définit ce qui se passe à la fin. `type` peut être `"Title"`, `"Map"` ou `"Cinematic"`.
*   `sequencies`: Le tableau contenant toutes les étapes de votre scène.

**Propriétés d'une séquence :**
*   `needPressOk`: `true` pour pauser la scène et attendre une action du joueur.
*   `audio`: Pour jouer un son (`se`), une musique (`bgm`) ou faire un fondu (`fadeOutBgm`).
*   `layers`: Un objet pour manipuler les sprites. La clé est l'ID du layer (0-12). Vous pouvez y définir `bitmap`, `opacityGoal`, `xGoal`, `yGoal`, `zoomGoal`, etc.
*   `storyWindow`: Pour afficher du texte dans la fenêtre principale.

### Étape 2 : Déclarer la Cinématique au Moteur

1.  Ouvrez le gestionnaire de plugins et sélectionnez `SC_CinematicConfig`.
2.  Dans le paramètre "Fichiers de Cinématiques", ajoutez le nom de votre fichier JSON (sans l'extension). Par exemple, `Prologue`.

Le moteur chargera automatiquement ce fichier au démarrage et le rendra disponible via une variable globale (ex: `$dataPrologue`).

### Étape 3 : Lancer la Cinématique en Jeu

Utilisez la commande d'événement "Script" pour lancer la scène.

```javascript
// Définit quelle cinématique charger
SC._temp.requestedCinematic = "Prologue"; 

// Lance la scène
SceneManager.goto(Scene_Cinematic);
```

Le système est très flexible. Vous pouvez animer la position, l'opacité, l'échelle et la rotation de chaque couche, jouer des animations image par image, et synchroniser le tout avec de l'audio et du texte.