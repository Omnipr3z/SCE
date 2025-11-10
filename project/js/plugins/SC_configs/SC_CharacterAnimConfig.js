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
 * @plugindesc !SC [v1.1.0] Configuration pour le système d'animations dynamiques.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @orderAfter SC_CoreConfig
 *
 * @help
 * SC_CharacterAnimConfig.js
 * 
 * Ce fichier de configuration définit les constantes pour le système
 * d'animations dynamiques des personnages.
 *
 * @param defaultIndex
 * @text Index de l'Animation par Défaut
 * @desc L'index du spritesheet (0-7) à utiliser pour l'animation de marche par défaut.
 * @type number
 * @default 0
 *
 * @param idleThreshold
 * @text Seuil d'Inactivité (frames)
 * @desc Nombre de frames après lequel un personnage immobile passe en animation "idle". 60 frames = 1 seconde.
 * @type number
 * @default 300
 *
 * @param idleIndex
 * @text Index de l'Animation "Idle"
 * @desc L'index du spritesheet (0-7) à utiliser pour l'animation d'inactivité.
 * @type number
 * @default 1
 *
 * @param dashIndex
 * @text Index de l'Animation "Dash"
 * @desc L'index du spritesheet (0-7) à utiliser pour l'animation de course.
 * @type number
 * @default 2
 *
 * @param jumpIndex
 * @text Index de l'Animation "Jump"
 * @desc L'index du spritesheet (0-7) à utiliser pour l'animation de saut.
 * @type number
 * @default 3
 */

SC.CharacterAnimConfig = SC.CharacterAnimConfig || {};

(() => {
    const params = PluginManager.parameters("SC_CharacterAnimConfig");
    SC.CharacterAnimConfig.DEFAULT_ANIM_INDEX = parseInt(params.defaultIndex) || 0;
    SC.CharacterAnimConfig.IDLE_THRESHOLD_FRAMES = parseInt(params.idleThreshold) || 300;
    SC.CharacterAnimConfig.IDLE_ANIM_INDEX = parseInt(params.idleIndex) || 1;
    SC.CharacterAnimConfig.DASH_ANIM_INDEX = parseInt(params.dashIndex) || 2;
    SC.CharacterAnimConfig.JUMP_ANIM_INDEX = parseInt(params.jumpIndex) || 3;
})();

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_CharacterAnimConfig",
    version: "1.1.0",
    icon: "🏃",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);