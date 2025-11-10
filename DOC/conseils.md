# Conseils de Développement SimCraft Engine

Ce document regroupe les conseils et stratégies de développement pour le SimCraft Engine, afin d'assurer une cohérence et une efficacité dans le travail collaboratif.

## Processus de Travail Général

1.  **Compréhension et Stratégie:** Avant toute modification ou ajout de code, une phase de discussion est essentielle pour définir la logique, les objectifs et la stratégie de développement. Aucune ligne de code ne doit être écrite avant validation de cette stratégie.
2.  **Développement Itératif:** Implémenter les fonctionnalités de manière itérative, en se concentrant sur des blocs logiques.
3.  **Tests Unitaires:** Développer des tests unitaires pour chaque nouvelle fonctionnalité ou correction de bug afin de garantir la qualité et la non-régression.
4.  **Vérification des Standards:** Après chaque modification de code, exécuter les commandes de build, linting et type-checking spécifiques au projet pour assurer la conformité aux standards de qualité.
5.  **Documentation:** Maintenir la documentation à jour, notamment les en-têtes de fichiers de plugin et ce document de conseils.

## Conventions de Codage et Architecture

-   **Hiérarchie des Dossiers :** Pour maintenir une organisation claire, les fichiers de plugins doivent être placés dans des sous-dossiers spécifiques au sein de `js/plugins/SC/` :
    -   `core/` : Contient les modules fondamentaux du moteur (SystemLoader, DebugTool, etc.).
    -   `managers/` : Contient les modules qui gèrent des systèmes de jeu majeurs (InputManager, GraphicsManager, etc.).
    -   `composants/` : Contient des classes utilitaires ou des "briques de construction" réutilisables (Bitmap_Composite, Game_Date, etc.).
    -   `patches/` : Contient les petits fichiers qui surchargent des méthodes spécifiques des classes de RMMZ pour corriger ou adapter leur comportement.
    -   `SC_configs/` (dans `js/plugins/`) : Ce dossier, à la même hauteur que `SC/`, contient tous les fichiers de configuration qui exposent les paramètres de plugin.

-   **Séparation de la Configuration et de la Logique :** Il est fortement recommandé de ne pas lire les paramètres de plugin (`PluginManager.parameters`) directement dans un fichier de logique (comme un `manager` ou un `composant`).
    -   **La bonne pratique :** Créez un fichier de configuration dédié dans le dossier `js/plugins/SC_configs/`. Ce fichier lira les paramètres du plugin et les exposera dans un objet global (ex: `SC.InputConfig`).
    -   Le module de logique (ex: `InputManager.js`) lira ensuite cet objet de configuration (`SC.InputConfig`) au lieu d'accéder directement aux paramètres du plugin.
    -   **Pourquoi ?** Cette séparation rend le code plus propre, plus facile à tester, et permet de centraliser toute la configuration à un seul endroit.

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

### Modèle d'En-tête de Plugin

Voici un modèle à utiliser comme base pour tout nouveau fichier de plugin.

```javascript
/**
 * ╔════════════════════════════════════════╗
 * ║                                        ║
 * ║        (Votre ASCII Art ici)           ║
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [vX.X.X] Nom de votre module.
 * @author By 'VotreNom' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_NomDuPluginDeBase // Optionnel : Le plugin dont celui-ci dépend directement.
 * @orderAfter SC_NomDuPluginDeBase // Optionnel : Assure que ce plugin est chargé après sa base.
 *
 * @help
 * NomDuFichier.js
 * 
 * Description claire et concise de ce que fait le module.
 * 
 * ▸ Fonctions principales :
 *   - Liste des fonctionnalités clés.
 *   - ...
 * 
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *   - AutreDependance.js
 *
 * ▸ Historique :
 *   v1.0.0 - AAAA-MM-JJ : Description de la version.
 *
 * @param nomDuParametre // Section pour les paramètres du plugin.
 * @text Nom du Paramètre dans l'éditeur
 * @desc Description du paramètre.
 * @type string // ou boolean, number, file, etc.
 * @default valeurParDefaut
 */
```