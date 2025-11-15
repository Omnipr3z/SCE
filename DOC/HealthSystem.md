# Système de Santé (ActorHealthManager)

## 1. Introduction

Le `ActorHealthManager` est un système complet de survie et de bien-être pour les acteurs. Il gère un ensemble de statistiques qui évoluent avec le temps et les actions du joueur, influençant directement les capacités et l'état des personnages.

Ce système est conçu pour être modulaire et entièrement configurable.

## 2. Concepts Clés

### Statistiques Gérées

Chaque acteur possède son propre `ActorHealthManager` qui suit les statistiques suivantes (valeurs en pourcentage de 0 à 100) :

*   `_alim` : La **Satiété**. Diminue avec le temps. Un niveau bas peut entraîner un état "Affamé".
*   `_form` : La **Vitalité** (contraire de la fatigue). Diminue avec le temps. Se régénère principalement en dormant. Un niveau bas peut entraîner un état "Épuisé".
*   `_clean` : La **Propreté**. Diminue avec le temps. Se régénère en se lavant. Un niveau bas peut entraîner un état "Sale".
*   `_hydra` : L'**Hydratation**. Diminue avec le temps. Un niveau bas peut entraîner un état "Assoiffé".
*   `_breath` : Le **Souffle**. Une jauge d'endurance à court terme. Diminue en courant, se régénère au repos. Essentiel pour les actions physiques.
*   `_impulse` : L'**Élan**. S'accumule en courant et est consommé par le saut pour en déterminer la distance.

### Architecture

*   **`ActorHealthManager.js`** : La classe principale qui contient toute la logique pour un seul acteur.
*   **`$actorHealthManagers`** : Le conteneur global (un `ActorsHealthManagers`) qui gère toutes les instances des managers de santé. C'est le point d'accès principal pour interagir avec le système.
*   **`SC_HealthConfig.js`** : Le fichier de configuration où tous les paramètres numériques (taux de dégradation, coûts, seuils, etc.) sont définis et modifiables via l'éditeur de plugins.

## 3. Fonctionnalités

### Dégradation Passive

Grâce à la méthode `updateHr()`, appelée toutes les 60 minutes virtuelles (gérées par `$gameDate`), les statistiques de `_alim`, `_form`, `_clean` et `_hydra` diminuent progressivement. Si une statistique atteint 0, un état correspondant (ex: "Affamé") est appliqué à l'acteur.

### Système de Souffle et d'Élan

La méthode `updateBreath()` est appelée à chaque frame sur la carte et gère le souffle et l'élan du joueur :
*   **Course (`isDashing`)** : `_breath` diminue et `_impulse` augmente.
*   **Marche (`isMoving`)** : `_breath` se régénère lentement et `_impulse` est réinitialisé.
*   **Immobile** : `_breath` se régénère rapidement et `_impulse` est réinitialisé.

Si `_breath` tombe sous un certain seuil (`breathOutThreshold`), l'acteur est forcé de s'arrêter et de jouer une animation d'essoufflement (`breathing`) jusqu'à ce que son souffle soit suffisamment remonté.

### Saut Dynamique

Le système intercepte une commande de saut (`jump`) et :
1.  Vérifie si l'acteur a assez de souffle (`canJump`).
2.  Calcule la distance du saut (`calculateJumpDistance`) en se basant sur les seuils d'élan (`jumpImpulseThresholds`) définis dans la configuration.
3.  Exécute le saut et consomme le souffle (`onJump`).

### Activités Continues

Un système générique permet de gérer des actions qui ont un effet sur la durée (manger, dormir, se laver).

*   **`useHealthItem(item)`** : Méthode centrale qui initialise une "activité". Elle lit les métadonnées d'un objet pour déterminer les effets (`alimIncrease`, `formIncrease`...), la durée (`activityDuration`) et l'animation à jouer (`actionName`).
*   **`updateHealthActivity()`** : Appelée chaque minute de jeu, cette méthode applique les changements de statistiques et décrémente le minuteur d'activité.
*   **`updateHealthActivity()`** : Appelée chaque minute virtuelle (gérée par `$gameDate`), cette méthode applique les changements de statistiques et décrémente le minuteur d'activité.

#### Modes Spéciaux (`sleepMode`, `washMode`)

Pour des actions comme dormir ou se laver, la durée n'est pas fixe. En utilisant une valeur spéciale pour `activityDuration` (ex: `'sleepMode'`), l'activité continue jusqu'à ce qu'une condition de fin soit remplie (ex: `_form` atteint 100%).

## 4. Guide d'Utilisation

### Configurer un Objet Consommable

Pour qu'un objet (item) interagisse avec le système de santé, utilisez les **notetags** suivants dans sa boîte de notes :

```
<alimIncrease: 20>
<hydraIncrease: 15>
<activityDuration: 5>
<actionName: eat>
```

*   `...Increase: x` : Augmente (ou diminue si négatif) la statistique correspondante à chaque minute de l'activité.
*   `activityDuration: y` : Durée de l'activité en minutes.
*   `actionName: z` : Nom de l'action à jouer depuis la configuration des animations. L'action doit être configurée avec `loop: true` et `blockMovement: true`.

### Lancer une Action par Script

Vous pouvez déclencher des actions comme dormir ou se laver via des appels de script.

**Exemple pour faire dormir l'acteur 1 :**
```javascript
const healthManager = $actorHealthManagers.manager(1);
if (healthManager) {
    healthManager.sleep({
        formIncrease: 2, // Récupère 2% de forme par minute
        formMaxThreshold: 90 // S'arrête quand la forme atteint 90%
    });
}
```

**Exemple pour faire se laver l'acteur 1 :**
```javascript
const healthManager = $actorHealthManagers.manager(1);
if (healthManager) {
    healthManager.wash({
        cleanIncrease: 5 // Récupère 5% de propreté par minute
    });
}
```

### Paramétrage

Tous les aspects numériques du système (coûts, gains, seuils, etc.) sont modifiables directement dans l'éditeur de plugins, sous les paramètres du plugin **`SC_HealthConfig`**.

---

Ce document doit être mis à jour à chaque ajout ou modification majeure du système de santé.