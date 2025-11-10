# SimCraft Engine - Gestionnaire Graphique (Graphics Manager)

![Version](https://img.shields.io/badge/Version-1.0.1-blue)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

Le module **Gestionnaire Graphique** est une refonte de la gestion de la résolution et du mode d'affichage de RPG Maker MZ. Il a été conçu pour offrir un contrôle total au développeur et garantir une expérience visuelle nette et sans artefact.

---

## ➤ Philosophie

Le système graphique de base de RMMZ est conçu pour être flexible, ce qui introduit souvent un redimensionnement dynamique de la fenêtre et une mise à l'échelle du contenu qui peut résulter en un rendu flou ("blurry").

Notre approche est radicalement différente et repose sur trois piliers :

1.  **Résolution Rigide** : La résolution du jeu est "verrouillée". Elle est définie une seule fois au démarrage et ne peut pas être modifiée dynamiquement par l'utilisateur en redimensionnant la fenêtre. Cela garantit un rendu "pixel-perfect" et élimine tout flou indésirable.
2.  **Contrôle Absolu** : Le développeur définit les résolutions autorisées et le mode de démarrage (fenêtré ou plein écran) via un fichier de configuration (`SC_GraphicsConfig.js`). Le moteur impose ces choix de manière stricte.
3.  **Plein Écran "Pur"** : Le mode plein écran utilise la résolution native de l'écran de l'utilisateur pour un affichage optimal, sans mise à l'échelle ou déformation.

---

## ➤ Fonctionnalités Clés

*   **Configuration via Plugin** : Le mode de démarrage et la résolution par défaut sont définis simplement via les paramètres du plugin `SC_GraphicsConfig.js`.
*   **Redimensionnement Rigide** : La logique de redimensionnement de RMMZ est surchargée pour ignorer les redimensionnements non sollicités et toujours appliquer la résolution configurée.
*   **Fenêtre Non Redimensionnable** : La logique interne de RMMZ qui tente de réajuster la fenêtre au démarrage est neutralisée, garantissant que la taille de la fenêtre reste celle que vous avez définie.
*   **Gestion Propre du Plein Écran** : Le passage en mode plein écran est géré de manière à ce que la résolution logique du jeu (`Graphics.boxWidth`/`boxHeight`) corresponde parfaitement à la résolution de l'écran.

---

## ➤ Les Fichiers du Module

Le système se compose de deux fichiers principaux :

1.  **`configs/SC_GraphicsConfig.js`** : Le fichier de configuration. C'est ici que le développeur définit le mode de démarrage et les résolutions.
2.  **`managers/GraphicsManager.js`** : Le cœur logique du système. Il contient la surcharge de la classe `Graphics` qui impose la résolution rigide.

---

## ➤ Guide d'Utilisation pour le Développeur

Pour configurer la résolution de votre jeu, il vous suffit d'éditer les paramètres du plugin **`SC_GraphicsConfig`** dans l'éditeur de RPG Maker MZ.

*   **`Mode d'affichage par défaut`** : Choisissez si le jeu doit démarrer en mode `Fenêtré` ou `Plein écran`.
*   **`Résolution par défaut (Fenêtré)`** : Définissez la résolution à utiliser si le jeu démarre en mode fenêtré (ex: `1280x720`).
*   **`Résolutions disponibles`** : Listez les résolutions que vous prévoyez de proposer au joueur dans le futur menu d'options.

Le `GraphicsManager` lira cette configuration au démarrage et l'appliquera de manière stricte.

---

## ➤ Mode Fenêtre sans Bordures (Après Déploiement)

Pour une immersion maximale, il est possible de supprimer la barre de titre de la fenêtre du jeu.

**Important :** Cette modification ne peut pas être faite pendant le développement, car l'éditeur de RPG Maker MZ **écrase le fichier `package.json`** à chaque sauvegarde, annulant ainsi vos changements.

La procédure est donc la suivante :
1.  Terminez le développement de votre jeu.
2.  Au moment de déployer le jeu, éditez manuellement le fichier `package.json` situé à la racine de votre projet.
3.  Ajoutez la propriété `"frame": false` à la section `window`.

```json
"window": {
    "title": "SimCraft Engine",
    "width": 816,
    "height": 624,
    "frame": false
}
```

La version déployée de votre jeu se lancera alors dans une fenêtre sans bordures.

---

## ➤ Pour l'Avenir : Configuration par le Joueur

Ce module a été conçu en prévision d'une **scène d'options en jeu**. Votre intuition d'utiliser le `StorageManager` est la bonne approche.

La stratégie future sera la suivante :

1.  **Créer une Scène d'Options** : Cette scène affichera les résolutions disponibles (définies dans `SC_GraphicsConfig.js`) et permettra au joueur de choisir sa résolution et son mode d'affichage (fenêtré/plein écran).
2.  **Sauvegarder la Configuration** : Lorsque le joueur valide ses choix, nous n'appliquerons pas les changements immédiatement. À la place, nous sauvegarderons ses préférences dans un fichier de configuration persistant via le `StorageManager`.
    ```javascript
    // Exemple de ce que la scène d'options fera
    const userGraphicsConfig = {
        mode: "Windowed",
        resolution: { width: 1920, height: 1080 }
    };
    StorageManager.save("userGraphicsConfig", userGraphicsConfig);
    ```
3.  **Appliquer au Prochain Démarrage** : Un message informera le joueur que les changements prendront effet au prochain lancement du jeu.
4.  **Modifier la Logique de Démarrage** : Notre `GraphicsManager` sera mis à jour pour lire ce fichier de configuration utilisateur au démarrage. S'il existe, il utilisera ses paramètres. Sinon, il se rabattra sur les paramètres par défaut de `SC_GraphicsConfig.js`.

Cette approche garantit que la résolution reste "verrouillée" pendant une session de jeu, tout en offrant au joueur la flexibilité de personnaliser son expérience pour la session suivante.

### Solution Ultime : Le Launcher Externe

L'ambition à long terme est de créer un **launcher externe**.

Actuellement, nous ne pouvons pas simplement "verrouiller" la taille de la fenêtre (par exemple avec `"resizable": false` dans `package.json`) car notre `GraphicsManager` a besoin de pouvoir redimensionner la fenêtre au démarrage pour appliquer la résolution choisie.

Un launcher résoudrait ce problème en :
1.  Permettant à l'utilisateur de choisir ses options graphiques **avant** de lancer le jeu.
2.  Sauvegardant ces options dans un fichier de configuration.
3.  Lançant le jeu avec les bons paramètres, potentiellement dans une fenêtre déjà configurée comme non redimensionnable.

Cette approche professionnelle est la solution définitive pour un contrôle total de l'expérience utilisateur.