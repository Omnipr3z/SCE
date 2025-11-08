# SimCraft Engine - Gestionnaire d'Entrées (Input Manager)

![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

Le module **Gestionnaire d'Entrées** est une refonte complète du système de gestion des touches de RPG Maker MZ. Il remplace le système statique par une architecture dynamique, configurable et prête pour l'avenir.

L'objectif est double : offrir aux développeurs un contrôle total sur les touches par défaut et préparer le terrain pour que les joueurs puissent personnaliser leurs propres commandes en jeu.

---

## ➤ Philosophie

Le système d'entrées de base de RMMZ est rigide. Les touches sont codées en dur, ce qui rend difficile toute personnalisation avancée. Notre approche repose sur :

1.  **Flexibilité** : Les actions (comme "confirmer", "annuler", "courir") ne sont plus liées à une touche spécifique, mais à un nom d'action.
2.  **Configuration Centralisée** : Les développeurs peuvent définir et modifier toutes les touches par défaut depuis un unique fichier de configuration, sans jamais toucher au code du moteur.
3.  **Extensibilité** : Le système est conçu pour être étendu, notamment avec une future scène de configuration des touches pour le joueur.

---

## ➤ Fonctionnalités Clés

*   **KeyMapper Dynamique** : Remplace le `Input.keyMapper` de RMMZ par une version entièrement dynamique.
*   **Configuration via Plugin** : Les touches par défaut sont définies simplement via les paramètres du plugin `SC_InputConfig.js`.
*   **Gestion des Conflits** : Le système détecte automatiquement si plusieurs actions sont assignées à la même touche au démarrage et prévient le développeur via le `DebugTool`.
*   **API pour l'Avenir** : Expose des méthodes pour permettre à d'autres modules (comme une scène d'options) de modifier les assignations de touches en cours de jeu.
*   **Prise en charge de Touches Étendues** : Gère nativement un plus grand nombre de touches du clavier que le moteur de base.

---

## ➤ Les Fichiers du Module

Le système se compose de trois fichiers principaux :

1.  **`configs/SC_InputConfig.js`** : Le fichier de configuration. C'est ici que le développeur définit les touches.
2.  **`managers/InputManager.js`** : Le cœur logique du système. Il gère l'assignation, la détection et la surcharge du moteur de base.
3.  **`patches/DebugTool_InputPatch.js`** : Un petit patch qui ajoute des messages de log spécifiques à l'Input Manager dans l'outil de débogage, pour des retours plus clairs.

> **Important :** Pour que le système fonctionne sans erreur, le fichier `DebugTool_InputPatch.js` **doit impérativement être placé après `DebugTool.js`** dans votre gestionnaire de plugins. Sans ce patch, l'`InputManager` ne pourra pas communiquer correctement avec l'outil de débogage et provoquera un crash.

---

## ➤ Guide d'Utilisation pour le Développeur

Pour configurer les touches de votre jeu, il vous suffit d'éditer les paramètres du plugin **`SC_InputConfig`** dans l'éditeur de RPG Maker MZ.

### Touches de Base

Des paramètres simples sont prévus pour les actions communes (`ok`, `cancel`, `shift`, `menu`). Vous pouvez y entrer directement le nom de la touche souhaitée (ex: `enter`, `escape`, `space`).

 <!-- Placeholder pour une future image -->

### Touches Personnalisées

Pour ajouter de nouvelles actions ou des touches alternatives, utilisez la section "Mappages de touches personnalisées".

*   **`inputCode`** : Le nom de l'action que vous créez (ex: `inventory`, `quest_log`).
*   **`keyName`** : Le nom de la touche à assigner (ex: `i`, `j`).

Le système fusionnera automatiquement les touches de base et vos touches personnalisées pour créer le mappage final.

---

## ➤ Pour l'Avenir

Ce module a été conçu avec des "méthodes API" en prévision d'une **scène de configuration des touches en jeu**. Des fonctions comme `assignKey`, `isActionEditable`, et `isActionReserved` sont déjà prêtes à être utilisées pour permettre au joueur de reconfigurer ses commandes, de sauvegarder et de charger ses préférences.