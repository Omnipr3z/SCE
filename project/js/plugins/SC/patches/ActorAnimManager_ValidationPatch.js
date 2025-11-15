/**
 * ╔════════════════════════════════════════╗
 * ║                                        ║
 * ║ ███████╗ ██████╗███████╗ ║
 * ║ ██╔════╝██╔════╝██╔════╝ ║
 * ║ ███████╗██║     █████╗ ║
 * ║ ╚════██║██║     ██╔══╝ ║
 * ║ ███████║╚██████╗███████╗ ║
 * ║ ╚══════╝ ╚═════╝╚══════╝ ║
 * ║ S I M C R A F T   E N G I N E ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v1.0.0] Patch pour ajouter des méthodes de validation à ActorAnimManager.
 * @author SimCraft
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base ActorAnimManager
 * @orderAfter ActorAnimManager
 *
 * @help
 * ActorAnimManager_ValidationPatch.js
 * 
 * Ce patch ajoute des méthodes de validation à ActorAnimManager pour vérifier
 * la configuration des actions.
 *
 */

(() => {

    /**
     * [NOUVEAU] Valide si une action est configurée pour être une action
     * continue et immobilisante (loop: true, blockMovement: true).
     * @param {string} actionName - Le nom de l'action à valider.
     * @returns {boolean}
     */
    ActorAnimManager.prototype.validateImmobilizingAction = function(actionName) {
        const actionConfig = this.getActionConfig(actionName);

        if (!actionConfig) {
            $debugTool.error(`Action '${actionName}' not defined for actor ${this._character.actorId()}.`);
            return false;
        }
        if (actionConfig.loop !== true) {
            $debugTool.error(`Action '${actionName}' must be loopable (loop: true).`);
            return false;
        }
        if (actionConfig.blockMovement !== true) {
            $debugTool.error(`Action '${actionName}' must block movement (blockMovement: true).`);
            return false;
        }
        return true;
    };

})();