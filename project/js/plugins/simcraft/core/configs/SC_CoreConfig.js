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
 * @plugindesc !SC [v0.3.0] Configuration du Cœur Moteur de SimCraft
 * @author SimCraft Engine
 * @url https://github.com/Omnipr3z/SCE
 * @help
 * Ce fichier configure les options de base du Cœur Moteur (Engine Core).
 * Il est requis par les autres modules du cœur (Debug_Tools, SystemLoader, DataManager).
 *
 * Il doit être placé AVANT les autres fichiers du Cœur Moteur dans la liste des plugins.
 * 
 * @param Debug - Environment Mode
 * @text Mode d’environnement
 * @type select
 * @option DEV
 * @option TEST
 * @option PROD
 * @default DEV
 * @desc Définit l’environnement actif (influence certains comportements internes).
 *
 * @param Debug - Enable Debug
 * @text Mode Debug
 * @type boolean
 * @default true
 * @desc Active ou désactive l’affichage des logs et infos de debug.
 *
 * @param Debug - Deep Debug
 * @text Debug Profond
 * @type boolean
 * @default false
 * @desc Active un mode debug plus verbeux ou intrusif (mémoire, traçages, etc).
 *
 * @param Debug - Skip Title
 * @text Passer l'écran-titre
 * @type boolean
 * @default false
 * @desc Si 'true', le jeu démarre directement sur la carte, en sautant le splash screen et l'écran-titre.
 * Utile pour accélérer les tests.
 *
 * @param Debug - Show Debug Window
 * @text Afficher la fenetre de Debug
 * @type boolean
 * @default false
 * @desc Si 'true', une fenetre de debug est affiché audessu de la Scene Map
 *
 *
 */

// Initialisation de l'objet global SimCraft
const SC = {};
SC._temp = {};
SC._clone = {};
SC.totalDataFilesToLoad = 0;
SC.totalDataFilesLoaded = 0;

// --- Parsing des Paramètres du Plugin ---
const scCoreConfigPluginName = document.currentScript.src.match(/.+\/([^\/]+)\.js/)[1];
const scCoreConfigRawParams = PluginManager.parameters(scCoreConfigPluginName);

const DEBUG_OPTIONS = {
    env: scCoreConfigRawParams["Debug - Environment Mode"] || "DEV",
    debug: scCoreConfigRawParams["Debug - Enable Debug"] === "true",
    deep: scCoreConfigRawParams["Debug - Deep Debug"] === "true",
    skipTitle: scCoreConfigRawParams["Debug - Skip Title"] === "true",
    showDebugWindow: scCoreConfigRawParams["Debug - Show Debug Window"] === "true"
};

// --- Constantes pour le Logging ---
const AUTHOR = "SimCraft Engine";
const AUTHOR_NAME = "Community";
const OFFICIAL_SITE = "https://github.com/Omnipr3z/SCE";
const LICENCE = "CC BY-NC-SA 4.0";
const ENGINE_NAME = "SimCraft Engine Core";
const ENGINE_VERSION = "0.3.0";

const LOG_HEADER =
` ╔════════════════════════════════╗ ⚙️ ${ENGINE_NAME}
 ║                                ║ 📜 ${LICENCE}    
 ║  ███████╗   ██████╗  ███████╗  ║ ✍️ ${AUTHOR}                 
 ║  ██╔════╝  ██╔════╝  ██╔════╝  ║ ✍️ (${AUTHOR_NAME})    
 ║  ███████╗  ██║       █████╗    ║ 🌍 ${OFFICIAL_SITE} 
 ║  ╚════██║  ██║       ██╔══╝    ║ 📦 Version: ${ENGINE_VERSION}     
 ║  ███████║  ╚██████╗  ███████╗  ║          ENV:        ⚙️ "${DEBUG_OPTIONS.env}"  
 ║  ╚══════╝   ╚═════╝  ╚══════╝  ║          Debug:      ${DEBUG_OPTIONS.debug ? "✔️ On " : "❌ Off"}    
 ║ S I M C R A F T   E N G I N E  ║          Deep Log:   ${DEBUG_OPTIONS.deep ? "✔️ On " : "❌ Off"}    
 ║                                ║          Skip Title: ${DEBUG_OPTIONS.skipTitle ? "✔️ On " : "❌ Off"}    
 ║                                ║          Skip Splash: ${DEBUG_OPTIONS.forceSkipSplash ? "✔️ On " : "❌ Off"}    
 ║________________________________║`;