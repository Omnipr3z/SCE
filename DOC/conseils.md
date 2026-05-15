# Conseils de Développement SimCraft Engine

**Dernière modification :** 2026-05-15

Ce document regroupe les conseils et stratégies de développement pour le SimCraft Engine, afin d'assurer une cohérence et une efficacité dans le travail collaboratif.

## Processus de Travail Général

1. **Compréhension et Stratégie:** Avant toute modification ou ajout de code, une phase de discussion est essentielle pour définir la logique, les objectifs et la stratégie de développement. Aucune ligne de code ne doit être écrite avant validation de cette stratégie.
2. **Développement Itératif:** Implémenter les fonctionnalités de manière itérative, en se concentrant sur des blocs logiques.
3. **Tests Unitaires:** Pour l'instant je travail de manière un peu YOLO mais j'envisage de développer des tests unitaires pour chaque nouvelle fonctionnalité ou correction de bug afin de garantir la qualité et la non-régression. C'est quelque choseque je peux decider de mettre en place dans le futur.
4. **Documentation:** Maintenir la documentation à jour, notamment les en-têtes de fichiers de plugin et ce document de conseils.

## Conventions de Codage et Architecture

- **Hiérarchie des Dossiers :** Pour maintenir une organisation claire, les fichiers plugins doivent être placés dans des sous-dossiers spécifiques au sein de `js/plugins/simcraft/` :
  - `core/` : Contient les modules fondamentaux du moteur (SystemLoader, DebugTool, etc.).
  - `ext/` : Contient les scripts qui rassemble les surcharges et extensions de classe native de RMMZ necessaires (sauf quelques exeptions)
  - gui_modules/ : contient des plugins qui modifient l'interface de jeu
  - modules/: contient l'ensemble des sous modules de l'engine
  les sous-modules sontiennenent eux meme des sous repertoires
  - `componants/` (orthographe utilisée dans le dépôt) : classes utilitaires ou « briques » réutilisables (`Game_Date`, etc.). Le terme « composants » reste le sens fonctionnel.
  - `patches/` : Contient les petits fichiers qui surchargent des méthodes spécifiques des classes de RMMZ pour corriger ou adapter leur comportement. !!!Obsolete : afin de limité les patch redondant le patching se fait directement dans ext/ néanmoins le refacto n'est pas terminé
  - `configs/` : Contient tous les fichiers de configuration qui exposent les paramètres de plugin du module.
  - mock/ ou dummy/ contient des donné entrées en dur mais destiné à etre transformé en json une fois le module stable.
- **Séparation de la Configuration et de la Logique :** Il est fortement recommandé de ne pas lier les paramètres de plugin (`PluginManager.parameters`) directement dans un fichier de logique (comme un `manager` ou un `composant`).
  - **La bonne pratique :** Créez un fichier de configuration dédié dans le dossier du module. Ce fichier lira les paramètres du plugin et les exposera dans un objet global (ex: `SC.InputConfig`).
  - Le module de logique (ex: `InputManager.js`) lira ensuite cet objet de configuration (`SC.InputConfig`) au lieu d'accéder directement aux paramètres du plugin.
  - **Pourquoi ?** Cette séparation rend le code plus propre, plus facile à tester, et permet de centraliser toute la configuration à un seul endroit.
- **Modularité:** Le SimCraft Engine utilise une architecture modulaire. Chaque module doit être autonome et bien défini. Etant plus ou moins agnostique quand c'est possible.
- **Loader (`SC_SystemLoader`):** Le `$simcraftLoader` est le point central de gestion des plugins. Chaque module de plugin doit s'enregistrer via `$simcraftLoader.checkPlugin()` avec un objet de métadonnées.
- **Nommage des Classes:** Ne pas préfixer les noms de classe avec `SC`_. Le nom de la classe doit correspondre au nom du fichier (ex: `InputManager.js` contient la classe `InputManager`) sauf pour les fichier qui contiennent des surcharges de classes native de RMMZ auquel cas la convention de nommage du fichierest [NOM DE LA CLASSE D'ORIGINE]Ext.js. ()
- **Data-Driven:** Utiliser les notetags d'événements (`<dynamic>`) et les commentaires (`<key: value>`) pour les entités de carte paramétrées et les specificités pour un usage simple pour les neophyte. A terme nous envisagerons la posibilté de choisir d'utiliser des JSON pour tout les parametrage mais plus tard.
- **Gestion des acteurs (`ActorMainManager` / `$actorsMM`):** hub par `actorId` ; lier l’acteur aux `Game_Event` correspondants quand le module le requiert.
- **Système "Paper-Doll":** Utiliser `Bitmap_Composite` pour la composition dynamique des apparences des sprites. A envisager pour les autres images qui necesite plusieurs couche (face...)
- **Commentaires:** Ajouter des commentaires de code avec parcimonie, en se concentrant sur le *pourquoi* plutôt que sur le *quoi*. Les commentaires d'en-tête de plugin doivent être mis à jour à chaque modification significative.
- **API Publique:** Lors de la conception d'un module, anticiper les évolutions futures en exposant des méthodes "API" claires et stables pour faciliter l'intégration avec d'autres modules.

## Gestion des Plugins

- **En-têtes de Plugin:** Chaque fichier de plugin doit avoir un en-tête standardisé incluant le nom, la version, l'auteur, la description et un historique des modifications. La version et l'historique doivent être mis à jour à chaque modification significative.
- **Métadonnées de Plugin:** L'objet de métadonnées passé à `$simcraftLoader.checkPlugin()` doit définir les dépendances, les fichiers de données à charger, les objets globaux à créer et le comportement de sauvegarde.

### Modèle d'En-tête de Plugin

Voici un modèle à utiliser comme base pour tout nouveau fichier de plugin.

```javascript
/**
 * ╔════════════════════════════════════════╗
 * ║                                        ║
 * ║        ███████╗ ██████╗███████╗        ║
 * ║        ██╔════╝██╔════╝██╔════╝        ║
 * ║        ███████╗██║     █████╗          ║
 * ║        ╚════██║██║     ██╔══╝          ║
 * ║        ███████║╚██████╗███████╗        ║
 * ║        ╚══════╝ ╚═════╝╚══════╝        ║
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [vX.X.X] Nom de votre module.
 * @author By 'VotreNom' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base NomDuPluginDeBase // Optionnel : Le plugin dont celui-ci dépend directement.
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
 */
```

### Pied de page Enregistrement du plugin

Voici un exemple fictif de pied de page de plugin.
Les valeurs `dependencies` et `loadDataFiles`, même qui n'ont pas de necessité, doivent malgré tout y figurer. avec un array vide si sans valeur.
Les valeur peuvent utiliser les constante globale :
// --- Constantes pour le Logging -
`const AUTHOR`
`const LICENCE`

lorsqu'il n'ya pas de class auto-créées, les valeur `createObj.classProto` et `instName` sont dispensable sauf autre necessité.
L'icon n'est pas facultatif.
Il est possible d'ajouté une valeur `description` mais uniquement si elle a une reelle utilité (l'entete contien deja suffisement d'infos).



```javascript
// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorsHealthManagers",
    version: "1.0.0",
    icon: "❤️",
    author: "Omnipr3z",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["SC_SystemLoader", "SC_ActorHealthManager"],
    loadDataFiles: [{filename:"TimeSystem", instName:"$dataTimeSystem"}],
    createObj: {
        autoCreate: true,
        classProto: ActorsHealthManagers,
        instName: "$actorHealthManagers"
    },
    save: {
        save: true,
        load: true
    }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
```