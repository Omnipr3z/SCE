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
 * @plugindesc !SC [v1.0.0] Patch pour DebugTool - Méthodes pour InputManager
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @base DebugTool
 * @orderAfter DebugTool
 * @help
 * Ce plugin est un patch. Il ne fait rien par lui-même, mais ajoute
 * des méthodes de logging spécifiques à l'InputManager dans l'outil $debugTool.
 * 
 * Il doit être placé après DebugTool.js dans la liste des plugins.
 */

if (typeof $debugTool !== 'undefined') {

    $debugTool.warnUnknowKey = function(keyName, actionName) {
        this.warn(`InputManager: Nom de touche inconnu "${keyName}" pour l'action "${actionName}".`);
    };

    $debugTool.errorKeyConflict = function(keyName, existingAction, actionName) {
        const errorMessage = `Conflit de touche: La touche "${keyName}" est déjà assignée à l'action "${existingAction}". Impossible de l'assigner également à "${actionName}".`;
        this.error(errorMessage);
    };

    $debugTool.logKeyAssigned = function(keyName, keyCode, actionName) {
        this.log(`InputManager: Touche "${keyName}" (code ${keyCode}) assignée à "${actionName}".`);
    };
}