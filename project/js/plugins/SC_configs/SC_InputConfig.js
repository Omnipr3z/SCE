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
 * @desc La touche principale pour l'action 'OK'.
 * @type text
 * @default enter
 *
 * @param cancel
 * @text Touche Annuler
 * @desc La touche principale pour l'action 'Annuler'.
 * @type text
 * @default escape
 *
 * @param shift
 * @text Touche Courir
 * @desc La touche principale pour l'action 'Courir'.
 * @type text
 * @default shift
 *
 * @param menu
 * @text Touche Menu
 * @desc La touche principale pour l'action 'Menu'.
 * @type text
 * @default x
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

var SC = SC || {};
SC.InputConfig = SC.InputConfig || {};

(function($) { // $ = SC.InputConfig
    'use strict';

    const pluginName = "SC_InputConfig";
    const parameters = PluginManager.parameters(pluginName);

    // 1. Charger les touches de base (vanilla)
    const baseKeys = {
        ok: parameters['ok'] || 'enter',
        cancel: parameters['cancel'] || 'escape',
        shift: parameters['shift'] || 'shift',
        menu: parameters['menu'] || 'x',
        pageup: 'pageup', // RMMZ default
        pagedown: 'pagedown', // RMMZ default
        up: 'up', // RMMZ default
        down: 'down', // RMMZ default
        left: 'left', // RMMZ default
        right: 'right' // RMMZ default
    };

    // 2. Charger les touches personnalisées
    const customKeys = JSON.parse(parameters.defaultKeyMappings || "[]").map(mapping => JSON.parse(mapping));

    // 3. Exposer la configuration combinée
    $.keyMappings = { ...baseKeys };
    customKeys.forEach(mapping => {
        $.keyMappings[mapping.inputCode] = mapping.keyName;
    });

})(SC.InputConfig);