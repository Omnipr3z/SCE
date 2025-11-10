# SimCraft Engine - Système d'Animations Dynamiques

![Version](https://img.shields.io/badge/Version-1.1.0-blue)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

Le système d'animations dynamiques est un module complémentaire au [système visuel des personnages](./CharacterVisual.md). Son rôle est d'automatiser le changement d'apparence des personnages en fonction de leurs actions (marche, course, inactivité, saut), rendant le monde plus vivant et réactif.

---

## ➤ Philosophie

Plutôt que de se contenter d'une seule animation de marche, ce système observe l'état de chaque personnage et change dynamiquement l'index du spritesheet utilisé pour refléter son action actuelle.

1.  **Automatisation Contextuelle** : Le système détecte automatiquement si un personnage marche, court, saute ou est inactif depuis un certain temps.
2.  **Configuration Centralisée** : Tous les paramètres (quel index pour quelle action, seuil d'inactivité, etc.) sont gérés dans un unique fichier de configuration pour une maintenance aisée.
3.  **Architecture Découplée** : La logique de détection d'état est encapsulée dans des "managers" dédiés, qui communiquent avec le système visuel via les `Game_Variables`, sans jamais interagir directement avec les sprites.
4.  **Extensibilité** : Le système est conçu pour être facilement étendu avec des animations d'actions plus complexes (attaques, utilisation d'objets, etc.).

---

## ➤ Les Fichiers du Module

Ce système est une collaboration entre plusieurs modules :

1.  **`configs/SC_CharacterAnimConfig.js`** : Le fichier de configuration où vous définissez les index de spritesheet pour chaque état (marche, course, inactivité, saut) et le seuil de temps pour l'animation d'inactivité.
2.  **`composants/ActorAnimManager.js`** : Le "cerveau" pour un seul personnage. Une instance de cette classe est créée pour chaque acteur sur la carte et gère son état d'animation individuel.
3.  **`managers/ActorsAnimsManagers.js`** : Le "manager des managers". Il supervise et met à jour toutes les instances de `ActorAnimManager` à chaque frame.
4.  **`patches/Scene_Map_AnimPatch.js`** : Le patch qui intègre le manager global dans le cycle de vie de la scène de la carte.

---

## ➤ Guide d'Utilisation

Ce module fonctionne de manière quasi automatique, à condition que le système visuel des personnages soit correctement configuré.

### Étape 1 : S'assurer de la configuration visuelle

Ce module ne fonctionne que pour les acteurs qui :
1.  Ont le notetag `<visual>`.
2.  Ont un ID de variable associé dans `js/plugins/SC_configs/varConfig.js` pour le contrôle de leur index.

```javascript
// Dans varConfig.js
const ACTOR_VISUAL_INDEX_VAR = {
    1: 18, // L'acteur 1 utilisera la variable 18 pour son index
    2: 19  // L'acteur 2 utilisera la variable 19
};
```

### Étape 2 : Configurer les Animations

Ouvrez le gestionnaire de plugins de RPG Maker MZ et sélectionnez le plugin `SC_CharacterAnimConfig`. Vous pouvez y définir :

*   **Index de l'Animation par Défaut** : L'index pour la marche.
*   **Seuil d'Inactivité (frames)** : Le temps en frames avant de passer à l'animation "idle". (60 frames = 1 seconde).
*   **Index de l'Animation "Idle"** : L'index pour l'animation d'inactivité.
*   **Index de l'Animation "Dash"** : L'index pour l'animation de course.
*   **Index de l'Animation "Jump"** : L'index pour l'animation de saut.

Le système s'occupe du reste.

---

## ➤ Pour l'Avenir : Système d'Actions

Ce module est la première étape d'un système d'animation plus vaste. Les prochaines versions intégreront :

*   **Actions Définies** : La possibilité de déclencher des animations complexes et séquencées (ex: miner, forger, attaquer) via des commandes de script.
*   **Contrôle du Comportement** : Ces actions pourront modifier le comportement du personnage (bloquer le mouvement, l'animation de pas, etc.).
*   **Fichiers de Données** : Les séquences d'animation seront définies dans des fichiers de données JSON pour une configuration facile et puissante.