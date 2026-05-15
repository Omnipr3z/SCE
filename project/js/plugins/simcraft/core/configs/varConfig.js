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
 * @plugindesc !SC [v1.0.0] Configuration des variables et interrupteurs du jeu.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @base SC_SystemLoader
 * @orderAfter SC_CoreConfig
 * @help
 * varConfig.js
 * 
 * Ce fichier centralise la définition des ID des variables et interrupteurs
 * utilisés par les différents modules du SimCraft Engine.
 * Cela permet de reconfigurer facilement les ID sans avoir à chercher
 * dans tous les fichiers de script. De plus cela permet d'utiliser
 * simplement un nom de constante explicite dans le code sans avoir à
 * retenir des indexes.
 * 
 * Ce plugin n'a pas de paramètres. Pour modifier les ID, il faut
 * éditer directement ce fichier.
 */

// --- TIME SYSTEM VARIABLES ---
const TIME_SPEED_VAR = 101;
const TIME_TICK_VAR = 102;
const TIME_TIMESTAMP_VAR = 3;
const TIME_MIN_VAR = 104;
const TIME_HOUR_VAR = 105;
const TIME_DAYPART_INDEX_VAR = 106;
const TIME_DAYPART_NAME_VAR = 107;
const TIME_DAYDECADE_INDEX_VAR = 108;
const TIME_DAYDECADE_NAME_VAR = 109;
const TIME_DAYMONTH_VAR = 110;
const TIME_DECADE_INDEX_VAR = 111;
const TIME_MONTH_INDEX_VAR = 112;
const TIME_MONTH_NAME_VAR = 113;
const TIME_SEASON_INDEX_VAR = 114;
const TIME_SEASON_NAME_VAR = 115;
const TIME_YEAR_VAR = 116;
const TIME_TIMEZONE_VAR = 117;

// --- TIME SYSTEM SWITCHES ---
const TIME_NIGHT_SW = 101;

const ACTOR_VISUAL_INDEX_VAR = {
    1:118,
    2:119,
    3:120,
    4:121
};
// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_VarConfig",
    version: "1.0.0",
    icon: "🔢",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false },
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);