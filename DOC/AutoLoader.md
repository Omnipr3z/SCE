# SimCraft Engine - Le Cœur du Moteur (Core)

![Version](https://img.shields.io/badge/Version-0.3.0-blue)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

Bienvenue dans la documentation du **Cœur du SimCraft Engine** !

Ce module est le socle de l'architecture du SimCraft Engine pour RPG Maker MZ. Il transforme la manière dont les plugins sont gérés en introduisant une structure modulaire, déclarative et robuste. Fini de devoir modifier les fichiers de base du moteur pour chaque nouvelle fonctionnalité !

L'objectif est simple : vous permettre de vous concentrer sur la création de fonctionnalités uniques, pendant que le moteur s'occupe de leur intégration.

---

## ➤ Philosophie

La conception du Cœur repose sur trois piliers :

1.  **Modularité** : Chaque fonctionnalité est un module indépendant qui déclare ses besoins.
2.  **Déclaration** : Un module ne dit pas au moteur *comment* faire les choses, mais *ce dont il a besoin*. Il déclare ses dépendances, les données à charger, les objets à créer, etc.
3.  **Centralisation** : La logique complexe de chargement, d'instanciation et de sauvegarde est gérée à un seul endroit, le `SystemLoader`, rendant le système prévisible et facile à déboguer.

---

## ➤ Fonctionnalités Clés

L'adoption de ce Cœur applicatif vous apporte des avantages immédiats :

*   **Architecture de Plugins Modulaire** : Chaque fichier devient un module autonome, facile à gérer et à partager.
*   **Gestion Automatique des Dépendances** : Le moteur vérifie que les plugins sont chargés dans le bon ordre et vous alerte en cas de problème.
*   **Chargement Déclaratif de Données** : Chargez vos fichiers `.json` personnalisés simplement en les déclarant dans les métadonnées de votre plugin. Plus besoin de toucher au `DataManager`.
*   **Création Déclarative d'Instances** : Créez des objets de jeu globaux (ex: `$gameCalendar`) ou surchargez des classes statiques du moteur (`DataManager`) de manière propre et automatique.
*   **Système de Sauvegarde Modulaire** : Rendez n'importe quel objet de jeu persistant en ajoutant une simple ligne `autoSave: true` et en implémentant deux méthodes.
*   **Debug Centralisé** : Le `Debug_Tools` fournit des logs clairs et groupés pour chaque étape du cycle de vie du moteur (chargement, instanciation, sauvegarde...).

---

## ➤ Les Fichiers du Cœur

Le système repose sur quatre fichiers essentiels à placer dans votre dossier `js/plugins/` (en respectant leurs sous-dossiers) :

1.  **`configs/SC_CoreConfig.js`** : La configuration de base du moteur. Il doit être placé **en tout premier** dans le gestionnaire de plugins.
2.  **`core/Debug_Tools.js`** : L'outil de logging.
3.  **`core/SC_SystemLoader.js`** : Le chef d'orchestre.
4.  **`managers/DataManager.js`** : La version étendue du `DataManager`.

---

## ➤ Guide : Créer un Nouveau Module

Voici comment créer un plugin qui s'intègre parfaitement à l'architecture du SimCraft Engine.

### Étape 1 : Créez votre fichier de plugin

Créez un nouveau fichier `.js` dans votre dossier `js/plugins/`. Par exemple : `SC_MyNewModule.js`.

### Étape 2 : Écrivez votre logique de jeu

Écrivez votre classe ou votre logique comme vous le feriez normally.

```javascript
class Game_MyObject {
    constructor() {
        this._myData = 0;
    }

    increment() {
        this._myData++;
    }

    // Méthodes pour la sauvegarde
    makeSavefileData() {
        return {
            myData: this._myData
        };
    }

    loadSavefileData(data) {
        this._myData = data.myData || 0;
    }
}
```

### Étape 3 : Déclarez votre module

C'est ici que la magie opère. À la toute fin de votre fichier, ajoutez le bloc d'enregistrement. C'est la "fiche d'identité" de votre module.

```javascript
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    // ... vos métadonnées ici ...
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
```

### Étape 4 : Remplissez les métadonnées

Voici une explication de chaque propriété de l'objet `pluginRegister` :

*   **`name`** (String, **Requis**)
    L'identifiant unique de votre plugin. Essentiel pour la gestion des dépendances.
    ```javascript
    name: "SC_MyNewModule",
    ```

*   **`dependencies`** (Array<String>, Optionnel)
    La liste des `name` des autres modules dont le vôtre dépend. Le `SystemLoader` bloquera le chargement si une dépendance est manquante.
    ```javascript
    dependencies: ["SC_SystemLoader", "SC_Time_Date"],
    ```

*   **`loadDataFiles`** (Array<Object>, Optionnel)
    La liste des fichiers de données JSON à charger depuis le dossier `data/SC/`.
    *   `filename`: Le nom du fichier (sans `.json`).
    *   `instName`: Le nom de la variable globale où les données seront stockées.
    ```javascript
    loadDataFiles: [{filename: "MyModuleData", instName: "$dataMyModule"}],
    ```

*   **`createObj`** (Object, Optionnel)
    Décrit l'objet global à créer à partir de votre plugin.
    *   `autoCreate: true` pour que le loader l'instancie.
    *   `classProto`: La référence à la classe à instancier.
    *   `instName`: Le nom de la variable globale pour l'instance (commencez par `$` pour suivre les conventions).
    ```javascript
    createObj: {
        autoCreate: true,
        classProto: Game_MyObject,
        instName: "$gameMyObject"
    },
    ```

*   **`autoSave`** (Boolean, Optionnel)
    Si `true`, le `DataManager` appellera automatiquement les méthodes `makeSavefileData()` et `loadSavefileData()` de l'instance créée via `createObj`. Cela assurerala suvegarde renvoyé par mae SveFileData et au chargement d'un nouvelle partie il appellera la methode `loadSavefileData(data)`, data etant les données precedement sauvegardées.
    ```javascript
    autoSave: true,
    ```

*   **`surchargeClass`** (String, Optionnel)
    La fonctionnalité la plus avancée. Indique le nom d'une classe statique du moteur (ex: `"DataManager"`, `"SceneManager"`) que votre classe va "étendre". Le `SystemLoader` se chargera de fusionner votre classe avec la classe de base.

    **⚠️ Important : Gérer le contexte `this` lors de la surcharge**

    Lorsque vous surchargez une classe statique (ex: `Input`, `TouchInput`), il est crucial de comprendre comment le `SystemLoader` gère le contexte `this`.

    1.  **Le `this` dans vos méthodes fait référence à une instance de votre classe de surcharge.**
        Grâce au `SystemLoader`, à l'intérieur de toutes les méthodes de votre classe (ex: `InputManager`), `this` fait **toujours** référence à l'instance de cette classe. Cela vous permet d'utiliser ses propriétés (`this._nameToCodeMap`) et ses méthodes (`this.myHelperFunction()`) de manière fiable, pour gérer la logique interne de votre manager.

    2.  **Pour interagir avec la classe statique, appelez-la par son nom.**
        Si vos méthodes de surcharge ont besoin de lire ou d'écrire des propriétés sur la classe statique de RMMZ elle-même (par exemple, pour interagir avec des patchs ou des méthodes originales), vous devez l'appeler explicitement par son nom.

    **Exemple Pratique avec `TouchInputManager` :**

    Le `TouchInputManager` ajoute des propriétés (`_rightButtonPressed`, etc.) à l'objet `TouchInput` global. Ses méthodes doivent donc lire et écrire sur `TouchInput`, et non sur `this`.

    ```javascript
    class TouchInputManager {
        // ...
        isRightPressed() {
            // INCORRECT : `this` est l'instance de TouchInputManager, pas TouchInput.
            // return this._rightButtonPressed; 

            // CORRECT : On lit la propriété directement sur la classe statique.
            return TouchInput._rightButtonPressed;
        }
        // ...
    }
    ```

    3.  **Pour appeler une méthode originale, utilisez `.call(NomDeLaClasse, ...)`**
        Les méthodes originales du moteur s'attendent à ce que leur `this` soit la classe statique elle-même. Quand vous appelez une méthode que vous avez sauvegardée, vous devez **impérativement** lui fournir ce contexte.

    ```javascript
    const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;

    class DataManager_SC {
        isDatabaseLoaded() {
            // On appelle la méthode originale en lui passant `DataManager` comme contexte.
            const baseLoaded = _DataManager_isDatabaseLoaded.call(DataManager, ...arguments);
            // ... puis on ajoute notre logique.
            return baseLoaded && this.areScFilesLoaded();
        }
    }
    ```

    ```javascript
    // Dans le cas de notre DataManager.js
    surchargeClass: "DataManager",
    ```

### Exemple Complet

Voici à quoi ressemblerait le bloc d'enregistrement complet pour notre `SC_MyNewModule.js` :

```javascript
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_MyNewModule",
    version: "1.0.0",
    author: "Votre Nom",
    license: LICENCE, // Utilise la constante globale si définie
    dependencies: ["SC_SystemLoader"],
    loadDataFiles: [{filename: "MyModuleData", instName: "$dataMyModule"}],
    createObj: {
        autoCreate: true,
        classProto: Game_MyObject,
        instName: "$gameMyObject"
    },
    autoSave: true
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
```

Et c'est tout ! Activez votre plugin dans le gestionnaire de RPG Maker MZ (après les 3 fichiers du cœur), et le moteur s'occupera du reste.