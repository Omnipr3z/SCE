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
 * @plugindesc !SC [v1.1.0] Composant de gestion d'animation pour un personnage.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * ActorAnimManager.js
 * 
 * Ce composant est instancié pour chaque personnage sur la carte.
 * Il est responsable de suivre l'état du personnage (marche, course, inactif)
 * et de déterminer quelle animation doit être appliquée.
 */

class ActorAnimManager {
    /**
     * @param {number} actorId L'ID de l'acteur à gérer.
     */
    constructor(actorId) {
        this._actorId = actorId;
        this._idleTimer = 0;
        this._currentState = 'default'; // 'default', 'dash', 'idle', 'action'
        this._visualIndexVarId = ACTOR_VISUAL_INDEX_VAR[this._actorId] || null;
        
        // From Action Patch
        this._actionQueue = [];
        this.clearAction();
    }

    /**
     * @returns {ActorMainManager} The main manager instance for this actor.
     */
    get mainManager() {
        return $actorsMainManagers.actor(this._actorId);
    }

    //================================================================================
    // Indices des animations
    //================================================================================

    getDefaultIndex() {
        return SC.CharacterAnimConfig.DEFAULT_ANIM_INDEX;
    }
    getDashIndex() {
        return SC.CharacterAnimConfig.DASH_ANIM_INDEX;
    }
    getIdleIndex() {
        return SC.CharacterAnimConfig.IDLE_ANIM_INDEX;
    }
    getJumpIndex() {
        return SC.CharacterAnimConfig.JUMP_ANIM_INDEX;
    }

    //================================================================================
    // Gestion des Actions (fusionné depuis le patch)
    //================================================================================

    clearAction() {
        this._currentAction = null;
        this._isActionPlaying = false;
        this._actionFrameIndex = 0;
        this._actionTimer = 0;
        this._waitCallback = null;
    }

    playAction(actionName, waitCallback = null) {
        const actionConfig = SC.ActionConfigs.actions[actionName];
        if (!actionConfig) {
            $debugTool.warn(`[ActorAnimManager] Action "${actionName}" non trouvée dans la configuration.`);
            if (waitCallback) waitCallback();
            return;
        }
        this._actionQueue.push({ actionName, waitCallback });
    }

    _playActionInternal(actionName, waitCallback) {
        const actionConfig = SC.ActionConfigs.actions[actionName];
        if (!actionConfig || !this.mainManager.character) return;
        
        this.clearAction();
        this._currentAction = actionConfig;
        this._isActionPlaying = true;
        this._currentState = 'action';
        this._waitCallback = waitCallback;

        this.mainManager.character.setWalkAnime(true);
        this.mainManager.character.setStepAnime(false);

        $debugTool.log(`[ActorAnimManager] Acteur ${this._actorId}: Démarre l'action "${actionName}".`, true);
        this.updateActionFrame();
    }

    stopAction() {
        if (!this._isActionPlaying) return;

        const actionName = this._currentAction.actionName;
        const returnToIdle = this._currentAction.returnToIdle;

        if (this._waitCallback) {
            this._waitCallback();
        }

        this.clearAction();
        
        if (returnToIdle) {
            this.setIdleAnim();
        } else {
            this.setWalkAnim();
        }
        
        $debugTool.log(`[ActorAnimManager] Acteur ${this._actorId}: Arrête l'action "${actionName}". Retour à "${returnToIdle ? 'idle' : 'walk'}".`, true);
    }

    updateAction() {
        this._actionTimer++;
        if (this._actionTimer >= this._currentAction.speed) {
            this._actionTimer = 0;
            this.updateActionFrame();
            this._actionFrameIndex++;
            
            const frames = this._currentAction.frames;
            if (this._actionFrameIndex >= frames.length) {
                if (this._currentAction.loop) {
                    this._actionFrameIndex = 0;
                } else {
                    this.stopAction();
                }
            }
        }
    }

    updateActionFrame() {
        if (!this._isActionPlaying || !this.mainManager.character) return;

        const action = this._currentAction;
        const pattern = action.frames[this._actionFrameIndex];

        $gameVariables.setValue(this._visualIndexVarId, action.sheetIndex);
        
        if (pattern !== undefined && pattern !== null) {
            this.mainManager.character.setPattern(pattern);
        }
    }

    getCurrentActionName() {
        return this._currentAction ? this._currentAction.actionName : null;
    }

    validateImmobilizingAction(actionName) {
        const actionConfig = SC.ActionConfigs.actions[actionName];

        if (!actionConfig) {
            $debugTool.error(`Action '${actionName}' not defined for actor ${this._actorId}.`);
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
    }
    
    //================================================================================
    // Gestion des états de base (Marche, Course, Repos, Saut)
    //================================================================================

    setDashAnim() {
        if (this._currentState !== 'dash') {
            this._currentState = 'dash';
            $gameVariables.setValue(this._visualIndexVarId, this.getDashIndex());
            $debugTool.log(`[ActorAnimManager] Acteur ${this._actorId}: Passe en dash (index: ${this.getDashIndex()}).`, true);
        }
        this._idleTimer = 0;
    }

    setIdleAnim() {
        if(this._currentState !== 'idle') {
            this._currentState = 'idle';
            $gameVariables.setValue(this._visualIndexVarId, this.getIdleIndex());
            this.mainManager.character.setStepAnime(true);
            $debugTool.log(`[ActorAnimManager] Acteur ${this._actorId}: Passe en idle (index: ${this.getIdleIndex()}).`, true);
        }
    }

    setWalkAnim() {
        if (this._currentState !== 'default') {
            this._currentState = 'default';
            $gameVariables.setValue(this._visualIndexVarId, this.getDefaultIndex());
            this.mainManager.character.setStepAnime(false);
            $debugTool.log(`[ActorAnimManager] Acteur ${this._actorId}: Passe en marche/défaut (index: ${this.getDefaultIndex()}).`, true);
        }
        this._idleTimer = 0;
    }

    setJumpAnim() {
        if (this._currentState !== 'jump') {
            this._currentState = 'jump';
            $gameVariables.setValue(this._visualIndexVarId, this.getJumpIndex());
            this.mainManager.character.setStepAnime(false);
            $debugTool.log(`[ActorAnimManager] Acteur ${this._actorId}: Passe en saut (index: ${this.getJumpIndex()}).`, true);
        }
        this._idleTimer = 0;
    }

    isIdleState() {
        this._idleTimer++;
        return this._idleTimer >= SC.CharacterAnimConfig.IDLE_THRESHOLD_FRAMES;
    }

    //================================================================================
    // Update principal
    //================================================================================

    update() {
        const character = this.mainManager.character;
        if (!character) {
            return;
        }

        // --- Priorité aux actions ---
        if (!this._isActionPlaying && this._actionQueue.length > 0) {
            const nextAction = this._actionQueue.shift();
            this._playActionInternal(nextAction.actionName, nextAction.waitCallback);
        }

        if (this._isActionPlaying) {
            this.updateAction();
            return; // Si une action est en cours, elle a la priorité absolue.
        }

        // --- Logique des états de base ---
        if (!this._visualIndexVarId) {
            return;
        }

        const isMoving = character.isMoving();
        const isDashing = character.isDashing();
        const isJumping = character.isJumping();

        if (isJumping) {
            this.setJumpAnim();
        } else if (isDashing) {
            this.setDashAnim();
        } else if (!isMoving) {
            if(this.isIdleState()) {
                this.setIdleAnim();
            } else {
                this.setWalkAnim();
            }
        } else {
            this.setWalkAnim();
        }
    }
}

// --- Enregistrement du plugin ---
// Ce plugin ne crée pas d'objet global, mais il doit être enregistré
// pour que d'autres plugins puissent déclarer une dépendance envers lui.
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorAnimManager",
    version: "1.1.0",
    icon: "🏃‍♂️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    
    // Pas de createObj car c'est une classe utilitaire à instancier au besoin.
    createObj: {
        autoCreate: false
    }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);