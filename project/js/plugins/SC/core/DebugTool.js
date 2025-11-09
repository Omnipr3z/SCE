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
 * @plugindesc !SC [v1.0.1] Outil de debug console de SimCraft Engine
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help DebugTool.js
 * 
 *   ███████     ██████    ███████
 *  ██          ██         ██     
 *   ██████     ██         █████  
 *        ██    ██         ██     
 *  ███████      ██████    ███████
 * 
 * Utilitaire de console pour le debug étendu du moteur SimCraft.
 * Affichage enrichi, suivi d’instances, logs d’événements, erreurs de données,
 * suivi de scènes, plugins, sauvegardes, fichiers externes, etc.
 * 
 * ▸ Fonctions principales :
 *   - Affiche une bannière personnalisée de démarrage console
 *   - Centralise les logs dans des groupes (console.group)
 *   - Affiche les erreurs de chargement de données JSON
 *   - Affiche les plugins chargés et les données associées
 *   - Suit les instances créées et recréées
 *   - Permet un accès rapide via $debugTool.log(), .warn(), .group(), etc.
 *
 * ▸ Nécessite :
 *   - Le fichier Config.js pour DEBUG_OPTIONS
 *   - Utilisation recommandée en ENV: DEV
 * 
 * ▸ Historique :
 *   v1.0.1 - Ajout des commentaires de méthodes
 *   v1.0.0 - Version initiale de l’outil debug
 */
/*:en
 * @target MZ
 * @plugindesc !SC [v1.0.1] Console debugging tool for SimCraft Engine
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help DebugTool.js
 * 
 *   ███████     ██████    ███████
 *  ██          ██         ██     
 *   ██████     ██         █████  
 *        ██    ██         ██     
 *  ███████      ██████    ███████
 * 
 * Extended console tool for debugging the SimCraft Engine.
 * Visual banners, instance tracking, log grouping, JSON error tracing,
 * plugin tracking, scene lifecycle logs, and more.
 * 
 * ▸ Key Features :
 *   - Shows a custom startup console banner
 *   - Centralized logging using console.group
 *   - Detects JSON loading errors and plugin dependencies
 *   - Tracks plugin and scene initialization
 *   - Global access via $debugTool.log(), .warn(), .group(), etc.
 *
 * ▸ Requirements :
 *   - Config.js file with DEBUG_OPTIONS
 *   - Recommended for use in ENV: DEV
 *
 * ▸ Releases :
 *   v1.0.1 - Added method comments
 *   v1.0.0 - Initial version of the debug tool
 */
class DebugTool{
    /**
     * Initializes the debug tool, prints the header, and sets up internal state.
     */
    constructor(){
        this._objCreated = {};
        this._groupStack = []; // Utiliser une pile pour gérer les groupes imbriqués
        this.scHeader();
    }
    /**
     * Getter to check if debugging is enabled based on global configuration.
     * @returns {boolean}
     */
    get debugLog(){
        return DEBUG_OPTIONS.debug && DEBUG_OPTIONS.env.toUpperCase() == "DEV";
    }
    /**
     * Displays the help menu for the debug tool.
     */
    get help(){
        if(DEBUG_OPTIONS.env != "DEV")return;
        this.helperTop();
        this._helperMenu =[0,0];
        this.drawMenuHelper();
    }
    //console manipulation
    /**
     * Starts a collapsed console group if it hasn't been created yet.
     * @param {string} key - The name of the group.
     */
    group(key){
        if (this.debugLog) {
            console.groupCollapsed(key);
            this._groupStack.push(key);
        }
    }
    /**
     * Ends the current console group.
     */
    groupEnd(){
        if (this.debugLog && this._groupStack.length > 0) {
            console.groupEnd();
            this._groupStack.pop();
        }
    }

    /**
     * Closes all open console groups.
     */
    closeAllGroups() {
        if (this.debugLog) {
            while (this._groupStack.length > 0) {
                console.groupEnd();
                this._groupStack.pop();
            }
        }
    }
    /**
     * Logs a standard message to the console.
     * @param {string} txt - The message to log.
     * @param {boolean} [deep=false] - If true, logs only when DEBUG_OPTIONS.deep is true.
     */
    log(txt, deep = false){
        if(this.debugLog && (!deep || DEBUG_OPTIONS.deep))
            console.log(txt);
    }
    /**
     * Logs a warning message to the console.
     * @param {string} txt - The warning message.
     * @param {boolean} [deep=false] - If true, logs only when DEBUG_OPTIONS.deep is true.
     */
    warn(txt, deep = false){
        if(this.debugLog && (!deep || DEBUG_OPTIONS.deep))
            console.warn(txt);
    }
    /**
     * Logs an error message and throws an exception.
     * @param {string} txt - The error message.
     */
    error(txt){
        if(this.debugLog)
            console.error(txt);
        throw new Error(txt);
    }
    //console contents
    /**
     * Displays the SimCraft Engine header in the console.
     */
    scHeader(){
        let line = "                 ".repeat(4) + "\n";
        console.log.apply(console, [`${line}%c${line}${LOG_HEADER}\n${line}`,'background: #124DA0; padding:0px 5px; color:white']);
        this.group("PRELOADING");
        this.log(`\u{1F50D}\u{1F41E} DEBUG_TOOLS \u{2192} Loaded`);
    }


    /**
     * Draws the content of the help menu based on the current state.
     */
    drawMenuHelper(){
        switch(this._helperMenu[0]){
            case 0:console.log("Le Helper est encore inactif...")
        }
    }
    /**
     * Clears the console and displays the help menu header.
     */
    helperTop(){
        console.clear();
        console.log.apply(console, [`%c
            ██╗  ██╗███████╗██╗     ██████╗ 
            ██║  ██║██╔════╝██║     ██╔══██╗
            ███████║█████╗  ██║     ██████╔╝
            ██╔══██║██╔══╝  ██║     ██╔═══╝ 
            ██║  ██║███████╗███████╗██║     
            ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     
            Bienvenue dans votre helper console ! 🚀
            `,
                "color: green; font-weight: bold;color: cyan; font-style: italic;"]
            );
    }
    

    /**
     * Displays an error for a missing data file.
     * @param {string} instName - The name of the instance that failed to create.
     * @param {string} filename - The name of the missing file.
     */
    drawDatafileError(instName, filename){
        let txt =
`\u{1F4C4} ERROR: ${instName} database not created !!!
         => 'data/SC/${filename}.json'  file not loaded !\n`;
        
        this.error(txt);
    }
    /**
     * Displays a confirmation that a data file has been loaded.
     * @param {string} instName - The name of the data instance.
     * @param {string} path - The path to the loaded file.
     */
    drawDatafileLoaded(instName, path){
        let txt;
        if(instName == "$dataMap"){
            txt =
`         \u{2794}\u{1F4C4}🌐 ${instName} \u{2192} '${path}' "${$gameMap.displayName() || "Location not named"}" loaded\n`;
        }else{
            txt =
`\u{1F4C4} ${instName} \u{2192} '${path}' loaded\n`;
        }
        
        
        this.log(txt);
    }
    /**
     * Displays an error for a missing plugin dependency.
     * @param {object} plugin - The plugin that is missing a dependency.
     * @param {string} requiredDependency - The name of the required dependency.
     */
    drawDependencyError(plugin, requiredDependency){
        let txt =
`\u{1F4E5} ERROR: ${plugin.name} not loaded !!!
\u{2192} To work correctly ???${requiredDependency}??? plugin must be loaded before !`;

        this.error(txt);
    }

    /**
     * Confirms that plugin save data has been loaded.
     * @param {object} plugin - The plugin whose data was loaded.
     */
    drawPluginSavefileLoaded(plugin){
        let txt = `\u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Savefile data loaded\n`;
        this.log(txt);
    }
    /**
     * Displays an error for corrupted plugin save data.
     * @param {object} plugin - The plugin with corrupted data.
     */
    drawPluginSavefileLoadError(plugin){
        let txt = `ERROR !!! \u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Saved data not loaded\n`;
        txt += `Savefile corrupted !`;
        this.error(txt);
    };
    /**
     * Displays an error if a plugin's 'loadSavefileData' method is missing.
     * @param {object} plugin - The plugin missing the method.
     */
    drawPluginSavefileLoadMethodError(plugin){
        let txt = `ERROR !!! \u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Save method not exists!\n`;
        txt += `".loadSavefileData(data) is not exist on ${plugin.createObj.instName}!`;
        this.error(txt);

    }
    /**
     * Confirms that plugin data has been saved.
     * @param {object} plugin - The plugin whose data was saved.
     */
    drawPluginSavefileSaved(plugin){
        let txt = `\u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Savefile data saved\n`;
        this.log(txt);
    }
    /**
     * Displays an error if a plugin's 'makeSavefileData' method is missing.
     * @param {object} plugin - The plugin missing the method.
     */
    drawPluginSavefileSaveMethodError(plugin){
        let txt = `ERROR !!! \u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Save method not exists!\n`;
        txt += `".makeSavefileData() is not exist on ${plugin.createObj.instName}!`;
        this.error(txt);

    }


    /**
     * Displays a confirmation that a plugin has been loaded.
     * @param {object} plugin - The loaded plugin.
     */
    drawPluginLoaded(plugin){
        let txt = `\u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Loaded\n`;

        if(DEBUG_OPTIONS.deep)(
            plugin.loadDataFiles.forEach(datafile=>{
                txt += `         \u{2192} using \u{1F4C4}${datafile.instName} from 'data/SC/${datafile.filename}.json' datafile\n`;
                
            })
        )
        this.log(txt);
    }
    /**
     * Logs the creation of a plugin instance.
     * @param {object} plugin - The plugin whose instance was created.
     */
    drawInstanceCreated(plugin){
        let txt = 
`${plugin.icon} ${plugin.name.toUpperCase()} \u{2192} ${plugin.createObj.instName} instance created`;
        this.log(txt);
    }
    /**
     * Logs the creation or recreation of a base RMMZ engine instance.
     * @param {string} instName - The name of the instance.
     * @param {string} className - The class name of the instance.
     */
    drawBaseInstanceCreated(instName, className){
        let txt;
        if(!this._objCreated)
            this._objCreated = {};
        if(!this._objCreated[className]){
            txt = 
`\u{1F3F0} RMMZ ${className.toUpperCase()} \u{2192} ${instName} instance created`;
            this._objCreated[className] = 1;
        }else if(this._objCreated[className] === 1){
            txt = 
`\u{1F3F0} RMMZ ${className.toUpperCase()} \u{2192} ${instName} instance recreated`;
            this._objCreated[className] = 2;
        }
        if(this._objCreated[className] < 2)
            this.log(txt);
    }
    /**
     * Logs the initialization of a scene.
     * @param {string} name - The name of the scene.
     */
    logInitScene(name){

        if(DEBUG_OPTIONS.deep || name == "Scene_Map"){
            let txt = `\u{1F3AC} SCENE ${name.toUpperCase()} \u{2192} initialized`;
            this.log(txt);
            
        }
    }

    /**
     * Logs an error for a key assignment conflict.
     * @param {string} keyName The name of the key causing the conflict.
     * @param {string} existingAction The action already assigned to the key.
     * @param {string} newAction The new action that failed to be assigned.
     */
    errorKeyConflict(keyName, existingAction, newAction) {
        const txt = `\u{1F6AB} KEY CONFLICT: Cannot assign key '${keyName}' to action '${newAction}'. It is already assigned to action '${existingAction}'.`;
        this.error(txt);
    }

    /**
     * Logs a warning for an unknown key name.
     * @param {string} keyName The unknown key name.
     * @param {string} actionName The action it was supposed to be assigned to.
     */
    warnUnknowKey(keyName, actionName) {
        const txt = `\u{26A0} UNKNOWN KEY: The key '${keyName}' for action '${actionName}' is not recognized. Please check SC/core/InputExtension.js for available key names.`;
        this.warn(txt);
    }
}

const $debugTool = new DebugTool();