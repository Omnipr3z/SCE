# SimCraft Engine - Système d'Actions de Personnages

![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

Le système d'Actions est une surcouche des systèmes [visuel](./CharacterVisual.md) et d'[animations dynamiques](./CharacterAnim.md). Il permet de déclencher de manière **impérative** des séquences d'animation spécifiques sur un personnage, indépendamment de son état (marche, course, etc.).

---

## ➤ Philosophie

Alors que le système d'animations dynamiques est **réactif** (il réagit à l'état du personnage), le système d'Actions est **proactif**. Il est conçu pour les animations qui doivent être explicitement commandées, comme "activer un levier", "miner de la roche" ou "saluer".

1.  **Contrôle Explicite** : Les actions sont déclenchées par une commande de script (ex: `$gamePlayer.playAction('mine_ore')`), donnant un contrôle total au développeur d'événements.
2.  **Configuration Data-Driven** : Chaque action (sa séquence de frames, sa vitesse, son comportement) est définie dans un fichier de configuration, pas en dur dans le code. Cela les rend faciles à créer, modifier et maintenir.
3.  **Gestion d'État Prioritaire** : Lorsqu'une action est en cours, elle a la priorité sur toutes les animations d'état (marche, idle, etc.). Le système gère cet état de "priorité" et revient à la normale une fois l'action terminée.
4.  **Impact sur le Gameplay** : Les actions peuvent être configurées pour bloquer les mouvements du personnage, l'intégrant ainsi directement aux mécaniques de jeu.

---

## ➤ Les Fichiers du Module

Ce système est une collaboration entre plusieurs modules :

1.  **`configs/SC_CharacterActionConfig.js`** : Le fichier de configuration où vous définissez toutes les actions disponibles, avec leur nom, leur spritesheet, leur séquence de frames, leur vitesse, etc.
2.  **`patches/ActorAnimManager_ActionPatch.js`** : Le cœur logique. Ce patch étend `ActorAnimManager` pour lui apprendre à gérer un nouvel état "action", à lire les configurations et à dérouler la séquence d'animation frame par frame.
3.  **`patches/Game_Character_ActionPatch.js`** : L'interface publique (API). Ce patch ajoute les méthodes `playAction()`, `stopAction()` et `isActionPlaying()` à `Game_CharacterBase`, les rendant accessibles via des commandes de script. Il gère également le blocage des mouvements en surchargeant `canMove()`.

---

## ➤ Guide d'Utilisation

### Étape 1 : Configurer les Actions

1.  Ouvrez le gestionnaire de plugins de RPG Maker MZ et sélectionnez le plugin `SC_CharacterActionConfig`.
2.  Dans le paramètre "Liste des Actions", ajoutez une nouvelle entrée pour chaque action que vous souhaitez créer.
3.  Pour chaque action, remplissez les champs :
    *   **Nom de l'Action** : Un identifiant unique (ex: `salute`).
    *   **Index de la Feuille de Sprite** : La ligne du spritesheet à utiliser (0-7).
    *   **Séquence de Frames** : Un tableau définissant les patterns à jouer (ex: `[0, 1, 2, 1, 0]`).
    *   **Vitesse d'Animation** : Le nombre de frames de jeu par frame d'animation (plus c'est haut, plus c'est lent).
    *   **Boucler l'Animation** : Cochez si l'animation doit se répéter indéfiniment.
    *   **Bloquer le Mouvement** : Cochez si le personnage doit être immobilisé pendant l'action.
    *   **Retourner à l'Idle** : Cochez si le personnage doit revenir à l'animation d'inactivité à la fin.

**Exemple pour une action "salute" :**
*   Nom de l'Action : `salute`
*   Index de la Feuille de Sprite : `6`
*   Séquence de Frames : `[0, 1, 2, 2, 1, 0]`
*   Vitesse d'Animation : `10`
*   Boucler l'Animation : `false`
*   Bloquer le Mouvement : `true`
*   Retourner à l'Idle : `true`

### Étape 2 : Déclencher une Action en Jeu

Utilisez la commande d'événement "Script" pour appeler l'une des méthodes suivantes sur le personnage de votre choix (`$gamePlayer`, `$gameMap.event(id)`, etc.).

#### Démarrer une action :

```javascript
$gamePlayer.playAction('salute');
```

#### Arrêter une action (utile pour les actions en boucle) :

```javascript
$gamePlayer.stopAction();
```

### Étape 3 : Vérifier si une action est en cours

Vous pouvez utiliser cette méthode dans une "Branche Conditionnelle" (via l'onglet 4, "Script") pour créer des logiques d'événement plus complexes.

```javascript
$gamePlayer.isActionPlaying()
```

**Exemple :** Empêcher le joueur d'ouvrir un coffre s'il est déjà en train de miner.

```
◆ Branche Conditionnelle : Script : !$gamePlayer.isActionPlaying()
  ◆ Ouvrir le coffre...
  ◆
：Fin
```