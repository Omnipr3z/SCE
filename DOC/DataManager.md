# DataManager (SimCraft Engine Add-ons)

## Description

Ce module n'est pas une nouvelle classe, mais une extension (surcharge) du `DataManager` natif de RPG Maker MZ. Son rôle est de l'intégrer au `SC_SystemLoader` pour gérer le chargement, la sauvegarde et l'accès aux données spécifiques de SimCraft Engine.

Il garantit que les données personnalisées de vos plugins sont chargées au démarrage et incluses dans les fichiers de sauvegarde, de manière transparente.

## Rôle et Fonctionnalités Clés

### 1. Chargement des Données des Plugins

-   **Intégration avec le Loader** : Le `DataManager` surchargé communique avec le `$simcraftLoader`.
-   **Chargement automatique** : Il parcourt la liste des plugins enregistrés et, pour chacun, charge les fichiers de données spécifiés dans la section `loadDataFiles` de leur métadadata de enregistrement.
-   **Stockage Global** : Les données chargées sont stockées dans des variables globales dont le nom est défini dans `instName` (par exemple, `$dataScTime`, `$dataScWeather`).

### 2. Gestion des Données de Carte SimCraft

-   En plus des données de carte standard (`MapXXX.json`), ce module charge un fichier de données parallèle depuis `data/SC/MapXXX.json`.
-   Ces données additionnelles sont stockées dans la variable globale `$dataScMap` et sont accessibles lorsque la carte correspondante est chargée.

### 3. Sauvegarde et Chargement Étendus

-   **Sauvegarde Modulaire** : Le `DataManager` étend le processus de sauvegarde. Il vérifie quels plugins sont marqués avec `autoSave: true` dans leurs métadonnées.
-   **Appel à `makeSavefileData`** : Pour chaque plugin concerné, il appelle la méthode `makeSavefileData()` de l'objet global du plugin (ex: `$gameTime.makeSavefileData()`) et stocke le résultat dans le fichier de sauvegarde.
-   **Restauration des Données** : Au chargement d'une partie, il effectue le processus inverse, en appelant `loadSavefileData(data)` sur chaque objet de plugin pour qu'il restaure son état.

### 4. Extraction de Métadonnées

-   **`extractEventMetaFromFirstComment(event)`** : Fournit une méthode utilitaire pour analyser le premier bloc de commentaires d'un événement sur une carte.
-   **Format `<key: value>`** : Elle recherche des balises au format `<clé: valeur>` et les retourne sous forme d'un objet JavaScript. C'est un mécanisme central pour paramétrer des entités dynamiques directement depuis l'éditeur de RPG Maker.

## Processus de Surcharge

Ce module utilise une méthode de surcharge propre qui consiste à sauvegarder les méthodes originales du `DataManager` avant de les remplacer. Les nouvelles méthodes appellent ensuite les méthodes originales via `_DataManager_methodName.call(this, ...arguments)` avant ou après avoir ajouté leur propre logique, garantissant la compatibilité et la robustesse.

## Dépendances

-   `SC_SystemLoader` : Indispensable pour connaître la liste des plugins et leurs métadonnées.
-   `DebugTool` : Utilisé pour logger les étapes de chargement et de sauvegarde.
