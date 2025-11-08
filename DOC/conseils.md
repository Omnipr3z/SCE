# Conseils de Développement SimCraft Engine

Ce document regroupe les conseils et stratégies de développement pour le SimCraft Engine, afin d'assurer une cohérence et une efficacité dans le travail collaboratif.

## Processus de Travail Général

1.  **Compréhension et Stratégie:** Avant toute modification ou ajout de code, une phase de discussion est essentielle pour définir la logique, les objectifs et la stratégie de développement. Aucune ligne de code ne doit être écrite avant validation de cette stratégie.
2.  **Développement Itératif:** Implémenter les fonctionnalités de manière itérative, en se concentrant sur des blocs logiques.
3.  **Tests Unitaires:** Développer des tests unitaires pour chaque nouvelle fonctionnalité ou correction de bug afin de garantir la qualité et la non-régression.
4.  **Vérification des Standards:** Après chaque modification de code, exécuter les commandes de build, linting et type-checking spécifiques au projet pour assurer la conformité aux standards de qualité.
5.  **Documentation:** Maintenir la documentation à jour, notamment les en-têtes de fichiers de plugin et ce document de conseils.

## Conventions de Codage et Architecture

-   **Modularité:** Le SimCraft Engine utilise une architecture modulaire. Chaque module doit être autonome et bien défini.
-   **Loader (`SC_SystemLoader`):** Le `$simcraftLoader` est le point central de gestion des plugins. Chaque module de plugin doit s'enregistrer via `$simcraftLoader.checkPlugin()` avec un objet de métadonnées.
-   **Configuration Séparée:** Les configurations spécifiques à un module doivent être définies dans un fichier dédié dans le dossier `plugins/SC_Configs`. Ces fichiers chargeront les paramètres de plugin dans des constantes réutilisables par le module.
-   **Nommage des Classes:** Ne pas préfixer les noms de classe avec `SC_`. Le nom de la classe doit correspondre au nom du fichier (ex: `InputManager.js` contient la classe `InputManager`).
-   **Data-Driven:** Utiliser les notetags d'événements (`<dynamic>`) et les commentaires (`<key: value>`) pour les entités de carte paramétrées.
-   **Gestion des Caractères (`CharacterManager`):** Lier `actorId` aux `Game_Event` correspondants.
-   **Système "Paper-Doll":** Utiliser `Bitmap_Composite` pour la composition dynamique des apparences des sprites.
-   **Commentaires:** Ajouter des commentaires de code avec parcimonie, en se concentrant sur le *pourquoi* plutôt que sur le *quoi*. Les commentaires d'en-tête de plugin doivent être mis à jour à chaque modification significative.
-   **API Publique:** Lors de la conception d'un module, anticiper les évolutions futures en exposant des méthodes "API" claires et stables pour faciliter l'intégration avec d'autres modules.

## Gestion des Plugins

-   **En-têtes de Plugin:** Chaque fichier de plugin doit avoir un en-tête standardisé incluant le nom, la version, l'auteur, la description et un historique des modifications. La version et l'historique doivent être mis à jour à chaque modification significative.
-   **Métadonnées de Plugin:** L'objet de métadonnées passé à `$simcraftLoader.checkPlugin()` doit définir les dépendances, les fichiers de données à charger, les objets globaux à créer et le comportement de sauvegarde.

## Stratégie pour l'InputManager

### Objectifs
-   Rendre le `Input.keyMapper` dynamique et configurable par le développeur et le joueur.
-   Permettre l'attribution de fonctions choisies aux touches de contrôle.
-   Gérer les touches par défaut via un fichier de configuration.
-   Anticiper l'intégration d'une scène de configuration des touches pour le joueur.
-   Gérer les conflits d'assignation de touches.

### Architecture
1.  **Classe `InputManager`:** Une nouvelle classe `InputManager` sera créée pour gérer la logique des entrées. Elle surchargera la classe `Input` de RMMZ via le `SystemLoader`.
2.  **Fichier de Configuration (`SC_Configs/InputConfig.js`):** Un fichier de configuration dédié sera créé pour définir les mappings de touches par défaut. Ce fichier exposera des constantes (ex: `KEY_CANCEL`, `KEY_OK`, `KEY_LEFT`) qui seront utilisées par l'`InputManager`.
3.  **`Input.keyboardMapper`:** Sera utilisé pour récupérer le nom des touches.

### Fonctionnalités Clés

-   **Configuration par le Développeur:**
    -   Les valeurs des touches par défaut seront définies dans les paramètres de plugin via des commentaires.
    -   Le développeur pourra entrer des paires `inputCode -> keyname` pour configurer les touches.
    -   L'`InputManager` lira ces configurations et mettra à jour son `keyMapper` interne.
-   **Gestion des Conflits:**
    -   Lors du chargement des paramètres de plugin, si une touche est déjà assignée et qu'une nouvelle assignation est tentée, une erreur critique sera affichée (via le DebugTool pour l'instant).
    -   À terme, le module de gestion des touches en jeu devra gérer des logiques de remplacement plus complexes, incluant des touches éditables et réservées.
-   **Méthodes "API" pour l'avenir:**
    -   Prévoir des méthodes pour permettre la modification des mappings de touches en cours de jeu (pour la future scène de configuration).
    -   Des méthodes pour vérifier si une touche est "éditable" ou "réservée".

### Étapes d'Implémentation

1.  Création du fichier `InputManager.js` dans `plugins/SC/`.
2.  Création du fichier `InputConfig.js` dans `plugins/SC_Configs/`.
3.  Implémentation de la logique de chargement des configurations de touches par défaut depuis les paramètres de plugin.
4.  Implémentation de la logique de détection et de gestion des conflits d'assignation de touches.
5.  Intégration avec le `SystemLoader` pour surcharger la classe `Input`.
6.  Mise à jour de l'en-tête du plugin `InputManager.js` avec la version et l'historique.