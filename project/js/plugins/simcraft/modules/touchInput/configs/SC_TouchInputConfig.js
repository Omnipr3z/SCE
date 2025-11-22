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
 * @plugindesc !SC [v1.0.0] Configuration des entrées tactiles pour SimCraft Engine.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @orderAfter SC_CoreConfig
 *
 * @help
 * SC_TouchInputConfig.js
 * 
 * Ce plugin sert à définir la configuration par défaut pour le
 * TouchInputManager.
 * 
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *
 * @param cancelOnRightClick
 * @text Annulation par Clic Droit
 * @desc Si 'true', le clic droit de la souris déclenche une action d'annulation (comme la touche 'Echap').
 * @type boolean
 * @default true
 */

var Imported = Imported || {};
Imported.SC_TouchInputConfig = true;

(function($) { // $ = SC.TouchInputConfig
    'use strict';

    const pluginName = "SC_TouchInputConfig";
    const parameters = PluginManager.parameters(pluginName);

    $.cancelOnRightClick = parameters['cancelOnRightClick'] === 'true';

})(SC.TouchInputConfig = SC.TouchInputConfig || {});
// Enregistrement du plugin auprès du SystemLoader
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_TouchInputConfig",
    version: "1.0.0",
    icon: "🔠",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false},
    autoSave: false // La configuration des touches sera gérée par un système de config joueur plus tard
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);