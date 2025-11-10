# SimCraft Engine - Système Visuel des Personnages (Paper-Doll)

![Version](https://img.shields.io/badge/Version-1.1.0-blue)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

Le système visuel des personnages est une fonctionnalité centrale du SimCraft Engine qui permet de créer des apparences de personnages dynamiques en superposant plusieurs couches graphiques. C'est ce qu'on appelle communément un système de "paper-doll".

---

## ➤ Philosophie

L'objectif est de permettre à l'apparence visuelle d'un acteur de refléter son état actuel, notamment son équipement. Plutôt que d'utiliser un spritesheet statique, le moteur compose une image à la volée en assemblant une image de base et des images pour chaque pièce d'équipement.

1.  **Composition Dynamique** : Les sprites sont générés en temps réel en fonction de l'équipement de l'acteur.
2.  **Gestion par Notetags** : La configuration des couches visuelles se fait directement dans la base de données de RPG Maker MZ, via des notetags sur les équipements.
3.  **Mise en Cache Intelligente** : Pour éviter de regénérer les images à chaque frame, le système utilise un cache qui n'est invalidé que si l'équipement de l'acteur change.
4.  **Superposition Complète** : Le système gère des couches qui se dessinent au-dessus du personnage (vêtements, armures) et des couches qui se dessinent en dessous (capes, sacs à dos), offrant une flexibilité maximale.

---

## ➤ Les Fichiers du Module

Ce système est une collaboration entre plusieurs modules :

1.  **`composants/Bitmap_Composite.js`** : La brique de base. Fournit la classe `Bitmap_Composite` qui sait comment superposer des images avec un ordre de `z-index`.
2.  **`managers/CharacterVisualManager.js`** : Le chef d'orchestre. Il reçoit les demandes, inspecte les acteurs, utilise `Bitmap_Composite` pour créer les sprites et gère le cache.
3.  **`sprites/Sprite_VisualCharacter.js`** : Le sprite spécialisé qui remplace `Sprite_Character` pour les acteurs concernés. Il sait comment demander son bitmap au `CharacterVisualManager` et gérer l'affichage asynchrone.
4.  **`patches/Game_Actor_VisualPatch.js`** : Un patch simple qui ajoute la méthode `isVisual()` à `Game_Actor` pour identifier les acteurs qui doivent utiliser ce système.
5.  **`patches/Spriteset_Map_VisualPatch.js`** : Le patch "usine" qui, lors de la création des personnages sur la carte, décide d'instancier un `Sprite_VisualCharacter` ou un `Sprite_Character` normal.
6.  **`configs/SC_VisualConfig.js`** : Fichier de configuration pour les dimensions des sprites.

---

## ➤ Guide d'Utilisation

Pour mettre en place le système de paper-doll, suivez ces étapes :

### Étape 1 : Activer le système pour un Acteur

Pour qu'un acteur utilise ce système, ajoutez simplement le notetag suivant dans sa fiche dans la base de données (Acteurs) :

```
<visual>
```

### Étape 2 : Configurer les Couches sur les Équipements

Pour chaque pièce d'équipement (arme, armure) qui doit avoir une représentation visuelle, ajoutez un ou plusieurs notetags dans sa fiche dans la base de données.

#### Couches Avant (`visualLayer`)

Utilisez ce notetag pour les couches qui doivent s'afficher **au-dessus** du sprite de base du personnage (ex: une cuirasse, des gants).

**Format :** `<visualLayer: filename z>`
*   `filename` : Le nom du fichier image situé dans `img/characters/`.
*   `z` : Le `z-index` (ordre de superposition). Les nombres les plus élevés sont dessinés par-dessus les plus bas.

**Exemple pour une cuirasse :**
```
<visualLayer: armor/plate_chest_male 10>
```

#### Couches Arrière (`visualBackLayer`)

Utilisez ce notetag pour les couches qui doivent s'afficher **en dessous** du sprite de base du personnage (ex: une cape, un sac à dos).

**Format :** `<visualBackLayer: filename z>`
*   `filename` : Le nom du fichier image situé dans `img/characters/`.
*   `z` : Le `z-index` pour les couches arrière.

**Exemple pour une cape :**
```
<visualBackLayer: accessories/cape_red 5>
```

### Étape 3 : Contrôler l'Index du Spritesheet (Optionnel)

Vous pouvez changer dynamiquement quel personnage du spritesheet est utilisé (parmi les 8 disponibles) via une variable de jeu.

1.  Dans `js/plugins/SC_configs/varConfig.js`, associez l'ID de votre acteur à un ID de variable de jeu :
    ```javascript
    const ACTOR_VISUAL_INDEX_VAR = {
        1: 18, // L'acteur 1 utilisera la variable 18 pour son index
        2: 19  // L'acteur 2 utilisera la variable 19
    };
    ```
2.  En jeu, modifiez la valeur de cette variable via une commande d'événement. La valeur que vous entrez correspondra à l'index utilisé (0 à 7).

---

## ➤ Fonctionnement Interne de la Superposition

Le `CharacterVisualManager` assemble le sprite final dans cet ordre :
1.  Il dessine toutes les couches `<visualBackLayer>` en respectant leur `z-index`.
2.  Il dessine ensuite le sprite de base du personnage (`characterName`).
3.  Enfin, il dessine toutes les couches `<visualLayer>` par-dessus, en respectant leur `z-index`.

Cela crée un effet de "sandwich" qui permet de gérer correctement tous les types d'équipements.