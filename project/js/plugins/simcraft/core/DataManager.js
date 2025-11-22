/**
 * ╔════════════════════════════════════════╗
 * ║                                        ║
 * ║        ███████╗ ██████╗ ███████╗        ║
 * ║        ██╔════╝██╔════╝ ██╔════╝        ║
 * ║        ███████╗██║     █████╗          ║
 * ║        ╚════██║██║     ██╔══╝          ║
 * ║        ███████║╚██████╗███████╗        ║
 * ║        ╚══════╝ ╚═════╝╚══════╝        ║
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v0.4.1] Gestionnaire de données étendu de SimCraft Engine
 * @author By '0mnipr3z' ©2024-2025 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @help DataManager.js
 * 
 *    ██████╗    █████╗   ████████╗   █████╗  
 *   ██╔═══██╗  ██╔══██╗  ╚══██╔══╝  ██╔══██╗ 
 *   ██║   ██║  ███████║     ██║     ███████║ 
 *   ██║   ██║  ██╔══██║     ██║     ██╔══██║ 
 *   ╚██████╔╝  ██║  ██║     ██║     ██║  ██║ 
 *    ╚═════╝   ╚═╝  ╚═╝     ╚═╝     ╚═╝  ╚═╝ 
 * 
 * Ce fichier étend le DataManager de base de RMMZ pour l'intégrer
 * au SimCraft Engine. Il utilise une surcharge propre pour ne redéfinir
 * que les méthodes nécessaires.
 * 
 * ▸ Fonctionnalités Clés :
 *   - Intégration avec $simcraftLoader pour charger les données des plugins SC.
 *   - Chargement des données de carte personnalisées (SC/Map***.json) dans $dataScMap.
 *   - Logique de sauvegarde et chargement étendue pour inclure les données des plugins.
 *   - Extraction de métadonnées depuis les commentaires d'événements.
 *   - Création modulaire des objets de jeu ($game*) via $simcraftLoader.
 *
 * ▸ Nécessite :
 *   - SC_SystemLoader.js pour l'objet $simcraftLoader.
 *   - Debug_Tools.js pour le logging via $debugTool.
 *
 * ▸ Historique :
 *   v0.4.1 - 2024-07-30 : Correction de l'appel à SystemLoader pour utiliser createScGameObjects.
 *   v0.4.0 - 2024-07-29 : Refactorisation en classe + surcharge via SystemLoader.
 *   v0.3.1 - 2024-07-29 : Mise à jour de la documentation et de l'en-tête.
 *   v0.3.0 - Refactorisation en classe propre + héritage dynamique au lieu de remplacement complet.
 *   v0.2.1 - Ajout du chargement des données de carte SC (statique et dynamique).
 *   v0.2.0 - Refonte en classe complète au lieu d'aliasing.
 *   v0.1.0 - Version initiale avec gestion des données et sauvegardes SC.
 */

// --- Surcharge de DataManager ---

// Sauvegarde des méthodes originales que nous allons surcharger
const _DataManager_loadDatabase = DataManager.loadDatabase;
const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
const _DataManager_createGameObjects = DataManager.createGameObjects;
const _DataManager_makeSaveContents = DataManager.makeSaveContents;
const _DataManager_extractSaveContents = DataManager.extractSaveContents;
const _DataManager_loadMapData = DataManager.loadMapData;
const _DataManager_isMapLoaded = DataManager.isMapLoaded;
class DataManager_SC {

    // Nouvelle méthode pour charger les données spécifiques à SimCraft
    loadScData() {
        for (const pluginKey in $simcraftLoader._pluginsList) {
            const plugin = $simcraftLoader._pluginsList[pluginKey];
            if (plugin.loadDataFiles && plugin.loadDataFiles.length > 0) {
                plugin.loadDataFiles.forEach((datafile) => {
                    if (!window[datafile.instName]) {
                        let src = `${datafile.filename}`;
                        this.loadScDataFile(datafile.instName, src);
                        $debugTool.drawDatafileLoaded(datafile.filename, src)
                    }
                }, this);
            }
        };
    }

    // Nouvelle méthode pour charger un fichier de données SC
    loadScDataFile(name, src) {
        const xhr = new XMLHttpRequest();
        // Correction: Ne pas ajouter .json si le nom de fichier le contient déjà.
        const url = "data/SC/" + (src.endsWith('.json') ? src : src + ".json");
        window[name] = null;
        xhr.open("GET", url);
        xhr.overrideMimeType("application/json");
        // On utilise .bind(this) pour s'assurer que 'this' dans onXhrLoad est bien notre DataManager
        xhr.onload = () => this.onXhrLoad(xhr, name, src, url);
        xhr.onerror = () => this.onXhrError(name, src, url);
        xhr.send();
    }

    // Nouvelle méthode pour gérer les erreurs de chargement XHR
    onXhrError(name, src, url) {
        const error = { name: name, src: src, url: url };
        $debugTool.error(`Failed to load: ${url}`, error);
    }

    // Nouvelle méthode pour gérer le succès de chargement XHR
    onXhrLoad(xhr, name, src, url) {
        if (xhr.status < 400) {
            window[name] = JSON.parse(xhr.responseText);
            $debugTool.log(`Loaded: ${url}`, window[name]);
        }
    }

    // Nouvelle méthode pour extraire les métadonnées des commentaires d'événements
    extractEventMetaFromFirstComment(event) {
        if (!event) return {};
        const firstPage = event.pages[0];
        if (!firstPage) return {};

        let commentBlock = '';
        let inCommentBlock = false;

        for (const command of firstPage.list) {
            if (command.code === 108) { // Début d'un commentaire
                commentBlock += command.parameters[0] + '\n';
                inCommentBlock = true;
            } else if (command.code === 408 && inCommentBlock) { // Suite du commentaire
                commentBlock += command.parameters[0] + '\n';
            } else if (inCommentBlock) {
                // Fin du bloc de commentaires au premier autre code
                break;
            }
        }

        const meta = {};
        const regex = /<([^:]+):\s*([^>]+)>/g;
        let match;
        while ((match = regex.exec(commentBlock)) !== null) {
            const key = match[1].trim();
            let value = match[2].trim();
            if (!isNaN(value) && value !== '') {
                value = Number(value);
            }
            meta[key] = value;
        }
        return meta;
    }

    // Surcharge de loadDatabase
    loadDatabase() {
        $debugTool.log("DataManager: Loading database base RMMZ contents...");
        _DataManager_loadDatabase.call(DataManager, ...arguments); // Appel de la méthode originale
        $debugTool.log("DataManager: Loading SimCraft Engine additional data contents...");
        this.loadScData(); // Ajout de notre logique
    }

    // Surcharge de isDatabaseLoaded
    isDatabaseLoaded() {
        const baseLoaded = _DataManager_isDatabaseLoaded.call(DataManager, ...arguments);
        if (!baseLoaded) {
            $debugTool.log("DataManager: RMMZ database not fully loaded yet.", true);
            return false;
        }

        if (!this._scDatabaseLoaded) {
            $debugTool.log("DataManager: RMMZ database loaded. Checking SC data files...", true);
            this._checkScDatabase();
        } else {
            $debugTool.log("DataManager: SC data files loaded.", true);
        }

        return this._scDatabaseLoaded;
    }

    // Nouvelle méthode pour vérifier le chargement de nos fichiers de données
    _checkScDatabase() {
        let scFilesLoaded = true;
        for (const pluginKey in $simcraftLoader._pluginsList) {
            const plugin = $simcraftLoader._pluginsList[pluginKey];
            if (plugin.loadDataFiles && plugin.loadDataFiles.length > 0) {
                plugin.loadDataFiles.forEach((datafile) => {
                    if (!window[datafile.instName]) {
                        scFilesLoaded = false;
                    }
                });
            }
        };
        this._scDatabaseLoaded = scFilesLoaded;
    }

    // Surcharge de createGameObjects
    createGameObjects() {
        $debugTool.log("DataManager: Create RMMZ native objects...");
        _DataManager_createGameObjects.call(DataManager, ...arguments);
        $debugTool.log("DataManager: Create SimCraft Engine additional objects...");
        $simcraftLoader.createScGameObjects();
    }

    // Surcharge de makeSaveContents
    makeSaveContents() {
        $debugTool.log("DataManager: Creating save contents...");
        const contents = _DataManager_makeSaveContents.call(DataManager, ...arguments); // Appel de la méthode originale
        $debugTool.log("... RMMZ native contents created.", true);
        $debugTool.log("... Adding SimCraft Engine contents...", true);
        for (const elementKey in $simcraftLoader._pluginsList) {
            let element = $simcraftLoader._pluginsList[elementKey];
            if (element.autoSave) {
                let instName = element.createObj.instName;
                let instance = window[instName];

                if (instance && instance.makeSavefileData) {
                    contents[instName] = instance.makeSavefileData();
                    $debugTool.drawPluginSavefileSaved(element);
                } else if(instance) {
                    $debugTool.drawPluginSavefileSaveMethodError(element);
                }
            }
        };
        $debugTool.log("DataManager: Save contents creation finished.", true);
        return contents;
    }

    // Surcharge de extractSaveContents
    extractSaveContents(contents) {
        $debugTool.log("DataManager: Extracting save contents...");
        _DataManager_extractSaveContents.call(DataManager, ...arguments); // Appel de la méthode originale
        $debugTool.log("... RMMZ native contents extracted.", true);
        $debugTool.log("... Extracting SimCraft Engine contents...", true);
        for (const elementKey in $simcraftLoader._pluginsList) {
            let element = $simcraftLoader._pluginsList[elementKey];
            if (element.autoSave) {
                let instName = element.createObj.instName;
                let instance = window[instName];

                if (instance && instance.loadSavefileData) {
                    if (contents[instName]) {
                        instance.loadSavefileData(contents[instName]);
                        $debugTool.drawPluginSavefileLoaded(element);
                    } else {
                        $debugTool.drawPluginSavefileLoadError(element);
                    }
                } else if(instance) {
                    $debugTool.drawPluginSavefileLoadMethodError(element);
                }
            }
        };
        $debugTool.log("DataManager: Save contents extraction finished.", true);
    }

    // Surcharge de loadMapData
    loadMapData(mapId) {
        $debugTool.log(`DataManager: Loading map data for Map ID: ${mapId}`);
        _DataManager_loadMapData.call(DataManager, ...arguments);
        if (mapId > 0) {
            this.loadMapScData(mapId);
        }
    }
    
    // Nouvelle méthode
    loadMapScData(mapId) {
        if (mapId > 0) {
            const filename = "Map%1.json".format(mapId.padZero(3));
            this.loadScDataFile("$dataScMap", filename);
        } else {
            window.$dataScMap = null;
        }
    }

    // Surcharge de isMapLoaded
    isMapLoaded() {
        const baseMapLoaded = _DataManager_isMapLoaded.call(DataManager, ...arguments);
        const scMapLoaded = !!window.$dataScMap;
        $debugTool.log(`DataManager.isMapLoaded: RMMZ map loaded: ${baseMapLoaded}, SC map loaded: ${scMapLoaded}`, true);
        return baseMapLoaded && scMapLoaded;
    }
}



// --- Enregistrement du plugin ---
// Doit être à la fin du fichier pour que la classe DataManager_SC soit définie.
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_DataManagerAddOns",
    version: "0.4.0",
    icon: "💾",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    loadDataFiles: [],
    createObj: {
        autoCreate: false, // Les classes de surcharge n'ont pas besoin d'être auto-créées globalement
        classProto: DataManager_SC
    },
    surchargeClass: "DataManager",
    autoSave: false
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);