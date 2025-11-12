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
 * @plugindesc !SC [v1.0.0] Patch pour ajouter l'API des actions à Game_Character.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_ActorsAnimsManagers
 * @base ActorAnimManager_ActionPatch
 * @orderAfter ActorAnimManager_ActionPatch
 *
 * @help
 * Game_Character_ActionPatch.js
 * 
 * Ce patch fournit l'interface publique pour le système d'actions.
 * Il ajoute des méthodes à Game_CharacterBase pour démarrer, arrêter et
 * vérifier les actions, et surcharge canMove() pour bloquer le mouvement
 * du personnage si nécessaire.
 */

(() => {
    Game_CharacterBase.prototype.getAnimManager = function(){
        return $gameActorsAnims.getManagerFor(this);
    }
    /**
     * [NOUVEAU] Démarre une animation d'action sur ce personnage.
     * @param {string} actionName Le nom de l'action à jouer.
     */
    Game_CharacterBase.prototype.playAction = function(actionName) {
        const manager = this.getAnimManager();
        if (manager) {
            manager.playAction(actionName);
        }
    };

    /**
     * [NOUVEAU] Arrête l'animation d'action en cours sur ce personnage.
     */
    Game_CharacterBase.prototype.stopAction = function() {
        const manager = this.getAnimManager();
        if (manager) {
            manager.stopAction();
        }
    };

    /**
     * [NOUVEAU] Vérifie si ce personnage est en train de jouer une action.
     * @returns {boolean}
     */
    Game_CharacterBase.prototype.isActionPlaying = function() {
        const manager = this.getAnimManager();
        return manager ? manager._isActionPlaying : false;
    };

    // --- Surcharge de canMove pour bloquer le mouvement ---
    const _Game_CharacterBase_canMove = Game_CharacterBase.prototype.canMove;
    Game_CharacterBase.prototype.canMove = function() {
        const manager = this.getAnimManager();
        if (manager && manager._isActionPlaying && manager._currentAction.blockMovement) {
            return false; // Ne peut pas bouger si une action bloquante est en cours.
        }
        return _Game_CharacterBase_canMove.call(this);
    };
    const _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        const manager = this.getAnimManager();
        if (manager && manager._isActionPlaying && manager._currentAction.blockMovement) {
            return false; // Ne peut pas bouger si une action bloquante est en cours.
        }
        return _Game_Player_canMove.call(this);
    };

})();

// --- Enregistrement du plugin ---
SC._temp.pluginRegister = {
    name: "SC_Game_Character_ActionPatch",
    version: "1.0.0",
    icon: "🕹️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_ActorsAnimsManagers", "SC_ActorAnimManager_ActionPatch"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);