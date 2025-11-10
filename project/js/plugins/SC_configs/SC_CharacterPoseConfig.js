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
 * @plugindesc !SC [v1.1.1] Configuration pour les Poses de personnages.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @orderAfter SC_CoreConfig
 *
 * @help
 * SC_CharacterPoseConfig.js
 * 
 * Ce plugin permet de définir TOUTES les poses de personnages et les index
 * d'animation qui leur sont associés, via un seul paramètre de plugin.
 *
 * ATTENTION : Le nom de pose 'default' est réservé pour les animations
 * de base et ne doit pas être utilisé ici. Les animations par défaut
 * se configurent dans le plugin SC_CharacterAnimConfig.
 *
 * @param poses
 * @text Liste des Poses
 * @desc Définissez ici toutes les poses disponibles dans le jeu.
 * @type struct<PoseConfig>[]
 * @default []
 */
/*~struct~PoseConfig:
 * @param poseName
 * @text Nom de la Pose
 * @desc Le nom unique de cette pose (ex: 'default', 'carry', 'rifle').
 * @type string
 *
 * @param animations
 * @text Mappages d'Animations
 * @desc Liste des animations et de leurs index pour cette pose.
 * @type struct<AnimationMapping>[]
 * @default []
 */
/*~struct~AnimationMapping:fr
 * @param animName
 * @text Nom de l'Animation
 * @desc Le nom de l'état d'animation (ex: 'walk', 'idle', 'dash', 'jump').
 * @type string
 *
 * @param animIndex
 * @text Index du Spritesheet
 * @desc L'index (0-7) du spritesheet à utiliser pour cette animation.
 * @type number
 * @min 0
 * @default 0
 */

SC.posesConfig = SC.posesConfig || {};

(() => {
    const pluginName = "SC_CharacterPoseConfig";
    const params = PluginManager.parameters(pluginName);
    const posesList = JSON.parse(params.poses || "[]");

    for (const poseString of posesList) {
        const poseParams = JSON.parse(poseString);
        const poseName = poseParams.poseName;

        if (poseName === 'default') {
            $debugTool.error("Le nom de pose 'default' est réservé et ne doit pas être configuré dans SC_CharacterPoseConfig.js. Utilisez SC_CharacterAnimConfig.js pour les animations par défaut.");
            continue; // On ignore cette entrée
        }

        if (poseName) {
            const animations = JSON.parse(poseParams.animations || "[]");
            const poseData = {};
            for (const animString of animations) {
                const animParams = JSON.parse(animString);
                poseData[animParams.animName] = parseInt(animParams.animIndex);
            }
            SC.posesConfig[poseName] = poseData;
        }
    }
})();

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_CharacterPoseConfig",
    version: "1.1.1",
    icon: "🧘",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);