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
     * C'est un alias plus long pour la méthode `anim()`.
     * @param {string} actionName Le nom de l'action à jouer.
     */
    Game_CharacterBase.prototype.playAction = function(actionName) {
        return this.anim(actionName);
    };

    /**
     * [NOUVEAU] Raccourci pour jouer une animation d'action sur ce personnage.
     * Conçu pour être utilisé dans les commandes de script (ex: this.anim('cast')).
     * @param {string} actionName Le nom de l'action à jouer.
     * @param {function} [waitCallback=null] Callback pour la gestion de l'attente.
     */
    Game_CharacterBase.prototype.anim = function(actionName, waitCallback = null) {
        // Vérifie si le personnage est un acteur visuel (soit un membre du groupe, soit un Game_ActorEvent)
        const actor = this.actor ? this.actor() : null;

        if ((!actor || !actor.isVisual()) && this !== $gamePlayer) {
            $debugTool.warn(`[ActionPatch] Tentative de jouer l'action '${actionName}' sur un personnage non-visuel (Event ID: ${this._eventId || 'N/A'}).`);
            if (waitCallback) waitCallback(); // Débloque l'attente immédiatement si l'action ne peut pas être jouée.
            return;
        }

        const manager = this.getAnimManager();
        if (manager) {
            manager.playAction(actionName, waitCallback); // Délègue à l'ActorAnimManager
        }
    };

    /**
     * [NOUVEAU] Démarre une séquence d'actions sur ce personnage.
     * @param {string} sequenceName Le nom de la séquence à jouer.
     */
    Game_CharacterBase.prototype.playSequence = function(sequenceName) {
        // Vérifie si le personnage est un acteur visuel
        const actor = this.actor ? this.actor() : null;

        if ((!actor || !actor.isVisual()) && this !== $gamePlayer) {
            $debugTool.warn(`[ActionPatch] Tentative de jouer la séquence '${sequenceName}' sur un personnage non-visuel (Event ID: ${this._eventId || 'N/A'}).`);
            return;
        }

        const manager = this.getAnimManager();
        if (manager) {
            manager.playSequence(sequenceName); // Délègue à l'ActorAnimManager
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