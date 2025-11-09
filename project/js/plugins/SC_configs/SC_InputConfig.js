/*:
 * @target MZ
 * @plugindesc !SC [v1.0.0] Configuration des entrées pour SimCraft Engine
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @base SC_SystemLoader
 * @orderAfter SC_SystemLoader
 * 
 * @help
 * SC_InputConfig.js
 * 
 * Ce plugin sert à définir les configurations de touches par défaut pour
 * le SimCraft Engine. Il ne contient aucune logique de jeu mais expose
 * les paramètres du plugin pour que d'autres modules, comme InputManager,
 * puissent les utiliser.
 * 
 * Il combine deux types de paramètres :
 * 1. Des paramètres simples pour les touches de base de RMMZ.
 * 2. Une liste structurée pour ajouter des touches personnalisées.
 * 
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *
 * ▸ Historique :
 *   v1.0.0 - 2024-07-29 : Création initiale et fusion des approches de configuration.
 *
 * @param ok
 * @text Touche OK
 * @desc Liste des touches pour l'action 'OK'.
 * @type string[]
 * @default ["ok","enter","space","z"]
 *
 * @param cancel
 * @text Touche Annuler (Escape)
 * @desc Liste des touches pour l'action 'escape'.
 * @type string[]
 * @default ["escape","insert","numpad_0","x"]
 *
 * @param shift
 * @text Touche Courir
 * @desc Liste des touches pour l'action 'Courir'.
 * @type string[]
 * @default ["shift"]
 *
 * @param menu
 * @text Touche Menu
 * @desc Liste des touches pour l'action 'Menu' (assignée à 'escape' par RMMZ).
 * @type string[]
 * @default ["x"]
 *
 * @param pageup
 * @text Touche Page Haut
 * @desc Liste des touches pour l'action 'Page Haut'.
 * @type string[]
 * @default ["pageup","q"]
 *
 * @param pagedown
 * @text Touche Page Bas
 * @desc Liste des touches pour l'action 'Page Bas'.
 * @type string[]
 * @default ["pagedown","w"]
 *
 * @param left
 * @text Touche Gauche
 * @desc Liste des touches pour l'action 'Gauche'.
 * @type string[]
 * @default ["left","numpad_4"]
 *
 * @param up
 * @text Touche Haut
 * @desc Liste des touches pour l'action 'Haut'.
 * @type string[]
 * @default ["up","numpad_8"]
 *
 * @param right
 * @text Touche Droite
 * @desc Liste des touches pour l'action 'Droite'.
 * @type string[]
 * @default ["right","numpad_6"]
 *
 * @param down
 * @text Touche Bas
 * @desc Liste des touches pour l'action 'Bas'.
 * @type string[]
 * @default ["down","numpad_2"]
 *
 * @param tab
 * @text Touche Tab
 * @desc Liste des touches pour l'action 'Tab'.
 * @type string[]
 * @default ["tab"]
 *
 * @param control
 * @text Touche Control
 * @desc Liste des touches pour l'action 'Control'.
 * @type string[]
 * @default ["control","alt"]
 *
 * @param debug
 * @text Touche Debug
 * @desc La touche principale pour l'action 'Debug' (ouvrir l'écran de debug).
 * @type string[]
 * @default ["f9"]
 *
 * @param defaultKeyMappings
 * @type struct<KeyMapping>[]
 * @text Mappages de touches personnalisées
 * @desc Définit des mappages de touches supplémentaires pour le jeu.
 *
 * @help
 */

/*~struct~KeyMapping:
 * @param inputCode
 * @type string
 * @text Input Code
 * @desc The internal code for the game action (e.g., 'ok', 'cancel', 'left').
 *
 * @param keyName
 * @type string
 * @text Key Name
 * @desc Le nom de la touche physique (ex: 'a', 'space', 'pagedown').
 */

var Imported = Imported || {};
Imported.SC_InputConfig = true;

(function($) { // $ = SC.InputConfig
    'use strict';

    const pluginName = "SC_InputConfig";
    const parameters = PluginManager.parameters(pluginName);

    // Fonction utilitaire pour parser les paramètres de type string[]
    const parseStringArray = (param, defaultValue) => {
        return param ? JSON.parse(param) : defaultValue;
    };

    // 1. Charger les touches de base en utilisant les paramètres du plugin.
    // Chaque action est maintenant associée à un tableau de touches.
    const keyMappings = {
        ok: parseStringArray(parameters['ok'], ['enter', 'space', 'z']),
        escape: parseStringArray(parameters['cancel'], ['escape', 'insert', 'numpad_0', 'x']),
        shift: parseStringArray(parameters['shift'], ['shift']),
        pageup: parseStringArray(parameters['pageup'], ['pageup', 'q']),
        pagedown: parseStringArray(parameters['pagedown'], ['pagedown', 'w']),
        up: parseStringArray(parameters['up'], ['up', 'numpad_8']),
        down: parseStringArray(parameters['down'], ['down', 'numpad_2']),
        left: parseStringArray(parameters['left'], ['left', 'numpad_4']),
        right: parseStringArray(parameters['right'], ['right', 'numpad_6']),
        tab: parseStringArray(parameters['tab'], ['tab']),
        control: parseStringArray(parameters['control'], ['control', 'alt']),
        debug: parseStringArray(parameters['debug'], ['f9'])
    };

    // 2. Charger les touches personnalisées
    const customKeys = JSON.parse(parameters.defaultKeyMappings || "[]").map(mapping => JSON.parse(mapping));

    // 3. Exposer la configuration combinée
    $.keyMappings = keyMappings;
    customKeys.forEach(mapping => {
        if (!$.keyMappings[mapping.inputCode]) {
            $.keyMappings[mapping.inputCode] = [];
        }
        $.keyMappings[mapping.inputCode].push(mapping.keyName);
    });

})(SC.InputConfig = SC.InputConfig || {});
// Enregistrement du plugin auprès du SystemLoader
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_InputConfig",
    version: "1.0.0",
    icon: "🔠",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false},
    autoSave: false // La configuration des touches sera gérée par un système de config joueur plus tard
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);