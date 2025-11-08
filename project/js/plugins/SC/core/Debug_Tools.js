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
 * @plugindesc !SC [v1.0.0] Outil de debug console de SimCraft Engine
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
 *   v1.0.0 - Version initiale de l’outil debug
 */
/*:en
 * @target MZ
 * @plugindesc !SC [v1.0.0] Console debugging tool for SimCraft Engine
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
 *   v1.0.0 - Initial version of the debug tool
 */
class DebugTool{
    constructor(){
        this.scHeader();
        this._objCreated = {};
        this._groupCreated = {};
    }
    get debugLog(){
        return DEBUG_OPTIONS.debug && DEBUG_OPTIONS.env.toUpperCase() == "DEV";
    }
    get help(){
        if(DEBUG_OPTIONS.env != "DEV")return;
        this.helperTop();
        this._helperMenu =[0,0];
        this.drawMenuHelper();
    }
    //console manipulation
    group(key){
        if(!this._groupCreated)
            this._groupCreated = {};
        if(this.debugLog){
            if(!this._groupCreated[key]){
                console.groupCollapsed(key);
                this._groupCreated[key] = true;
            }else if(DEBUG_OPTIONS.deep){
                console.groupCollapsed("RESTORE \u{2192}"+key);
            }
        }
            
    }
    groupEnd(){
        if(this.debugLog)
            console.groupEnd();
    }
    log(txt){
        if(this.debugLog)
            console.log(txt);
    }
    warn(txt){
        if(this.debugLog)
            console.warn(txt);
    }
    error(txt){
        if(this.debugLog)
            console.error(txt);
        throw new Error(txt);
    }
    //console contents
    scHeader(){
        let line = "                 ".repeat(4) + "\n";
        console.log.apply(console, [`${line}%c${line}${LOG_HEADER}\n${line}`,'background: #124DA0; padding:0px 5px; color:white']);
        this.group("PRELOADING");
        this.log(`\u{1F50D}\u{1F41E} DEBUG_TOOLS \u{2192} Loaded`);
    }



    drawMenuHelper(){
        switch(this._helperMenu[0]){
            case 0:console.log("Le Helper est encore inactif...")
        }
    }
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
    

    drawDatafileError(instName, filename){
        let txt =
`\u{1F4C4} ERROR: ${instName} database not created !!!
         => 'data/SC/${filename}.json'  file not loaded !\n`;
        
        this.error(txt);
    }
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
    drawDependencyError(plugin, requiredDependency){
        let txt =
`\u{1F4E5} ERROR: ${plugin.name} not loaded !!!
\u{2192} To work correctly ???${requiredDependency}??? plugin must be loaded before !`;

        this.error(txt);
    }

    drawPluginSavefileLoaded(plugin){
        let txt = `\u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Savefile data loaded\n`;
        this.log(txt);
    }
    drawPluginSavefileLoadError(plugin){
        let txt = `ERROR !!! \u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Saved data not loaded\n`;
        txt += `Savefile corrupted !`;
        this.error(txt);
    };
    drawPluginSavefileLoadMethodError(plugin){
        let txt = `ERROR !!! \u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Save method not exists!\n`;
        txt += `".loadSavefileData(data) is not exist on ${plugin.createObj.instName}!`;
        this.error(txt);

    }
    drawPluginSavefileSaved(plugin){
        let txt = `\u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Savefile data saved\n`;
        this.log(txt);
    }
    drawPluginSavefileSaveMethodError(plugin){
        let txt = `ERROR !!! \u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Save method not exists!\n`;
        txt += `".makeSavefileData() is not exist on ${plugin.createObj.instName}!`;
        this.error(txt);

    }


    drawPluginLoaded(plugin){
        let txt = `\u{1F4E5} ${plugin.icon} ${plugin.name.camelToSnake().toUpperCase()} \u{2192} Loaded\n`;

        if(DEBUG_OPTIONS.deep)(
            plugin.loadDataFiles.forEach(datafile=>{
                txt += `         \u{2192} using \u{1F4C4}${datafile.instName} from 'data/SC/${datafile.filename}.json' datafile\n`;
                
            })
        )
        this.log(txt);
    }
    drawInstanceCreated(plugin){
        let txt = 
`${plugin.icon} ${plugin.name.toUpperCase()} \u{2192} ${plugin.createObj.instName} instance created`;
        this.log(txt);
    }
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
    logInitScene(name){

        if(DEBUG_OPTIONS.deep || name == "Scene_Map"){
            let txt = `\u{1F3AC} SCENE ${name.toUpperCase()} \u{2192} initialized`;
            this.log(txt);
            
        }
    }
    logPlantation(plantation = 24){
        console.log(plantation);
        console.log(plantation.currentStep())
        console.log(plantation.nextStepData())
    }
}
const $debugTool = new DebugTool();