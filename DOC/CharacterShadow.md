# SimCraft Engine - Système d'Ombres Dynamiques

![Version](https://img.shields.io/badge/Version-1.1.0-blue)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

Le système d'ombres dynamiques est un module complémentaire au [système visuel des personnages](./CharacterVisual.md). Il remplace l'ombre statique intégrée aux sprites par une ombre dynamique et découplée, qui réagit aux mouvements verticaux du personnage, comme le saut.

---

## ➤ Philosophie

L'objectif est de corriger une limitation visuelle du moteur de base de RPG Maker MZ, où l'ombre est solidaire du sprite du personnage, ce qui la fait "sauter" avec lui.

1.  **Découplage** : L'ombre est un sprite indépendant, dessiné sous le personnage mais non lié à son bitmap.
2.  **Réalisme Vertical** : L'ombre reste au sol lorsque le personnage saute, et son apparence (taille, opacité) change en fonction de la hauteur du personnage pour un effet plus crédible.
3.  **Modularité** : Le système est un "addon" qui peut être activé ou désactivé via un simple paramètre de plugin, sans affecter le système visuel de base.
4.  **Configuration Facile** : Tous les aspects de l'ombre (décalage, effets de saut) sont configurables via le gestionnaire de plugins.

---

## ➤ Les Fichiers du Module

Ce système est une collaboration entre plusieurs modules :

1.  **`configs/SC_ShadowConfig.js`** : Le fichier de configuration où vous activez le système et réglez tous ses paramètres visuels.
2.  **`sprites/Sprite_CharacterShadow.js`** : La classe qui définit le sprite de l'ombre lui-même.
3.  **`patches/Sprite_VisualCharacter_ShadowPatch.js`** : Le patch qui injecte la logique de création et de gestion de l'ombre dans le système visuel existant de manière modulaire.

---

## ➤ Guide d'Utilisation

### Étape 1 : Préparer les Ressources Graphiques

C'est l'étape la plus importante. Pour que ce système fonctionne, vos sprites de personnages (fichiers de base et pièces d'équipement) ne doivent **PAS** avoir d'ombre dessinée directement sur l'image. Le système ajoutera sa propre ombre dynamiquement.

### Étape 2 : Activer et Configurer le Système

1.  Assurez-vous que les trois plugins de ce module sont activés dans le gestionnaire de plugins de RPG Maker MZ.
2.  Sélectionnez le plugin `SC_ShadowConfig` pour accéder à ses paramètres :
    *   **Utiliser les Ombres Dynamiques** : Mettez ce paramètre à `true` pour activer le système.
    *   **Décalage Y de l'Ombre** : Permet d'ajuster finement la position verticale de l'ombre sous les pieds du personnage.
    *   **Taux de Réduction (Saut)** : Contrôle à quelle vitesse l'ombre rétrécit lorsque le personnage monte. Une petite valeur (ex: 0.01) est recommandée.
    *   **Taux d'Opacité (Saut)** : Contrôle à quelle vitesse l'ombre devient transparente lorsque le personnage monte.

Le système est maintenant actif pour tous les personnages utilisant le système visuel.

---

## ➤ Fonctionnement Interne

1.  Le patch `Sprite_VisualCharacter_ShadowPatch` surcharge l' "usine" de création de sprites (`Spriteset_Map`).
2.  Pour chaque personnage visuel, il crée deux sprites distincts : un `Sprite_CharacterShadow` et un `Sprite_VisualCharacter`.
3.  Il les ajoute au conteneur principal de la carte (`_tilemap`) en ajoutant l'ombre en premier, ce qui garantit qu'elle est toujours dessinée en dessous.
4.  Il "lie" logiquement les deux sprites en donnant au `Sprite_VisualCharacter` une référence vers son ombre.
5.  À chaque frame, le `Sprite_VisualCharacter` met à jour la position et l'apparence de son ombre, en compensant la hauteur du saut pour la maintenir au sol et en ajustant son échelle et son opacité.