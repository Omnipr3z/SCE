# SimCraft Engine - Système de Poses de Personnages

![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

Le système de Poses est une surcouche du [système d'animations dynamiques](./CharacterAnim.md). Il permet de définir des "postures" ou des contextes fondamentaux pour un personnage, qui modifient l'ensemble de ses animations de base (marche, course, inactivité, etc.).

---

## ➤ Philosophie

L'objectif est de permettre à un personnage d'avoir des sets d'animations complètement différents en fonction de ce qu'il fait ou de ce qu'il porte.

*   **Pose `default` :** Le personnage marche normalement.
*   **Pose `carry` :** Le personnage porte un objet lourd, ses animations de marche et d'inactivité sont différentes.
*   **Pose `rifle` :** Le personnage tient un fusil, sa posture et ses animations sont adaptées.

1.  **Configuration Modulaire :** Chaque pose est définie dans le gestionnaire de plugins, ce qui permet une configuration claire et extensible sans toucher au code.
2.  **Déclenchement Multiple :** Une pose peut être déclenchée de plusieurs manières : manuellement via une commande de script, automatiquement par un équipement, ou contextuellement par l'environnement (échelle, eau, etc.).
3.  **Hiérarchie de Priorité :** Le système gère une priorité logique pour déterminer quelle pose appliquer si plusieurs conditions sont remplies.

---

## ➤ Les Fichiers du Module

Ce système est une collaboration entre plusieurs modules :

1.  **`configs/SC_CharacterPoseConfig.js`** : Le fichier de configuration où vous définissez toutes les poses spéciales et leurs mappages d'animations.
2.  **`patches/Game_Actor_PosePatch.js`** : Le patch principal qui ajoute à `Game_Actor` la capacité de gérer sa pose et qui surcharge `ActorAnimManager` pour qu'il utilise ce système.
3.  **`patches/Game_Actor_EquipmentPosePatch.js`** : Un patch "addon" qui permet aux équipements de forcer une pose via un notetag.

---

## ➤ Guide d'Utilisation

### Étape 1 : Configurer les Poses

1.  Ouvrez le gestionnaire de plugins de RPG Maker MZ et sélectionnez le plugin `SC_CharacterPoseConfig`.
2.  Dans le paramètre "Liste des Poses", ajoutez une nouvelle entrée pour chaque pose que vous souhaitez créer (sauf `'default'`).
3.  Pour chaque pose :
    *   Donnez-lui un `Nom de la Pose` unique (ex: `carry`).
    *   Dans `Mappages d'Animations`, définissez les index de spritesheet pour chaque état d'animation (`walk`, `idle`, `dash`, `jump`).

**Exemple pour une pose "carry" :**
*   Nom de la Pose : `carry`
*   Mappages d'Animations :
    *   `walk` -> index `4`
    *   `idle` -> index `5`

### Étape 2 : Déclencher les Poses

Vous avez plusieurs façons de déclencher une pose :

#### A. Via un Équipement (Méthode Recommandée)

Ajoutez le notetag suivant à un équipement (arme, armure) dans la base de données :

```
<forcePose: nom_de_la_pose>
```

**Exemple pour une jarre :**
```
<forcePose: carry>
```

Dès que l'acteur équipera cet objet, il passera automatiquement à la pose "carry". C'est la méthode la plus simple et la plus dynamique.

#### B. Manuellement via une Commande de Script

Vous pouvez forcer une pose à tout moment via une commande d'événement "Script".

```javascript
$gameActors.actor(1).setPose('carry'); // L'acteur 1 passe en pose "carry"
```

Pour revenir à la normale, utilisez la pose par défaut :

```javascript
$gameActors.actor(1).setPose('default');
```

---

## ➤ Priorité des Poses

Le système applique les poses selon la priorité suivante :

1.  **Pose forcée par un équipement** (la plus haute priorité).
2.  **Pose forcée manuellement** (via `setPose`).
3.  **Pose par défaut** (`'default'`).
