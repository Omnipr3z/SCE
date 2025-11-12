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
 * @plugindesc !SC [v1.0.2] Configuration des options graphiques pour SimCraft Engine.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @orderAfter SC_CoreConfig
 *
 * @help
 * SC_GraphicsConfig.js
 * 
 * Ce plugin sert à définir la configuration graphique par défaut
 * pour le jeu (résolution, mode d'affichage, etc.).
 *
 * @param defaultMode
 * @text Mode d'affichage par défaut
 * @type select
 * @option Fenêtré
 * @value Windowed
 * @option Plein écran
 * @value Fullscreen
 * @default Windowed
 * @desc Le mode d'affichage au lancement du jeu.
 *
 * @param defaultResolution
 * @text Résolution par défaut (Fenêtré)
 * @type string
 * @default 1280x720
 * @desc La résolution par défaut en mode fenêtré (format: LargeurxHauteur).
 *
 * @param availableResolutions
 * @text Résolutions disponibles
 * @type string[]
 * @default ["816x624", "1280x720", "1920x1080"]
 * @desc Liste des résolutions qui seront proposées au joueur.
 *
 * @param uiReferenceResolution
 * @text Résolution de Référence UI
 * @type string
 * @default 1280x720
 * @desc La résolution pour laquelle l'interface a été conçue. Toutes les positions et tailles seront calculées par rapport à celle-ci.
 *
 * @param fullSpriteScaling
 * @text Mise à l'échelle complète des sprites
 * @desc'true', les fonds sont étirés pour remplir l'écran (peut déformer). Si 'false', leur ratio est préservé.
 * @type boolean
 * @default true
 * 
 * 
 */

var Imported = Imported || {};
Imported.SC_GraphicsConfig = true;

(function($) { // $ = SC.GraphicsConfig
    'use strict';

    const pluginName = "SC_GraphicsConfig";
    const parameters = PluginManager.parameters(pluginName);

    const parseResolution = (resString) => {
        const parts = resString.toLowerCase().split('x');
        return { width: parseInt(parts[0]), height: parseInt(parts[1]) };
    };

    $.defaultMode = parameters['defaultMode'] || 'Windowed';
    $.defaultResolution = parseResolution(parameters['defaultResolution'] || '1280x720');
    $.availableResolutions = JSON.parse(parameters['availableResolutions'] || '[]').map(parseResolution);
    $.uiReferenceResolution = parseResolution(parameters['uiReferenceResolution'] || '1280x720');
    $.fullSpriteScaling = parameters['fullSpriteScaling'] === 'true';

})(SC.GraphicsConfig = SC.GraphicsConfig || {});
// Enregistrement du plugin auprès du SystemLoader
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_GraphicsConfig",
    version: "1.0.2",
    icon: "🔠",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false},
    autoSave: false // La configuration des touches sera gérée par un système de config joueur plus tard
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);