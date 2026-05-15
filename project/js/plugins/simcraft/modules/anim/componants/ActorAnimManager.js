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
        return $actorsMM.actor(this._actorId);
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
        $gameVariables.setValue(this._visualIndexVarId, this.getIndexForState('dash'));
    }

    setIdleAnim() {
        if(this._currentState !== 'idle') {
            this._currentState = 'idle';
            $gameVariables.setValue(this._visualIndexVarId, this.getIdleIndex());
            this.mainManager.character.setStepAnime(true);
            $debugTool.log(`[ActorAnimManager] Acteur ${this._actorId}: Passe en idle (index: ${this.getIdleIndex()}).`, true);
        }
        $gameVariables.setValue(this._visualIndexVarId, this.getIndexForState('idle'));
    }

    setWalkAnim() {
        if (this._currentState !== 'default') {
            this._currentState = 'default';
            $gameVariables.setValue(this._visualIndexVarId, this.getDefaultIndex());
            this.mainManager.character.setStepAnime(false);
            $debugTool.log(`[ActorAnimManager] Acteur ${this._actorId}: Passe en marche/défaut (index: ${this.getDefaultIndex()}).`, true);
        }
        this._idleTimer = 0;
        $gameVariables.setValue(this._visualIndexVarId, this.getIndexForState('walk'));
    }

    setJumpAnim() {
        if (this._currentState !== 'jump') {
            this._currentState = 'jump';
            $gameVariables.setValue(this._visualIndexVarId, this.getJumpIndex());
            this.mainManager.character.setStepAnime(false);
            $debugTool.log(`[ActorAnimManager] Acteur ${this._actorId}: Passe en saut (index: ${this.getJumpIndex()}).`, true);
        }
        this._idleTimer = 0;
        $gameVariables.setValue(this._visualIndexVarId, this.getIndexForState('jump'));
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

    /**
     * [NOUVEAU] Valide si une action est configurée pour être une action
     * continue et immobilisante (loop: true, blockMovement: true).
     * @param {string} actionName - Le nom de l'action à valider.
     * @returns {boolean}
     */
    validateImmobilizingAction(actionName) {
        const actionConfig = SC.ActionConfigs.actions[actionName];

        if (!actionConfig) {
            $debugTool.error(`Action '${actionName}' not defined for actor ${this._character.actor().actorId()}.`);
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

    /**
     * [NOUVEAU] Récupère l'index d'animation pour un état donné, en fonction de la pose actuelle de l'acteur.
     * @param {string} animState Le nom de l'état d'animation (ex: 'walk', 'idle').
     * @returns {number} L'index du spritesheet.
     */
    getIndexForState(animState) {
        const manager = this.mainManager;
        let actor = null;

        if (manager) {
            if (typeof manager.getPose === 'function') {
                actor = manager;
            } else if (manager.actor) {
                actor = (typeof manager.actor === 'function') ? manager.actor() : manager.actor;
            }
        }

        if (!actor && this._actorId) actor = $gameActors.actor(this._actorId);

        if (!actor) {
            return 0; // Fallback de sécurité
        }

        const poseName = actor.getPose();

        if (poseName === 'default') {
            $debugTool.log("Pose par défaut détectée pour l'acteur ID " + actor.actorId(), true); //
            // Pour la pose par défaut, on utilise la configuration de base des animations.
            switch (animState) {
                case 'walk': return SC.CharacterAnimConfig.DEFAULT_ANIM_INDEX;
                case 'idle': return SC.CharacterAnimConfig.IDLE_ANIM_INDEX;
                case 'dash': return SC.CharacterAnimConfig.DASH_ANIM_INDEX;
                case 'jump': return SC.CharacterAnimConfig.JUMP_ANIM_INDEX;
                default: return SC.CharacterAnimConfig.DEFAULT_ANIM_INDEX; // Fallback
            }
        } else {
            // Pour les poses spéciales, on utilise la configuration des poses.
            const poseData = SC.posesConfig[poseName];
            if (poseData) {
                // Retourne l'index pour l'état demandé, ou l'index de 'walk' de cette pose si non trouvé.
                return poseData[animState] !== undefined ? poseData[animState] : poseData['walk'];
            }
            return SC.CharacterAnimConfig.DEFAULT_ANIM_INDEX; // Fallback si la pose spéciale n'est pas trouvée.
        }
    }

    
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorAnimManager",
    version: "1.1.0",
    icon: "🏃‍♂️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: {
        autoCreate: false
    }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);


// --- Surcharge du constructeur pour initialiser les états de l'action ---
const _ActorAnimManager_initialize = ActorAnimManager.prototype.initialize;
ActorAnimManager.prototype.initialize = function(character) {
    _ActorAnimManager_initialize.call(this, character);
    this.clearAction();
};

/**
 * [NOUVEAU] Réinitialise l'état de l'action en cours.
 */
ActorAnimManager.prototype.clearAction = function() {
    this._currentAction = null;
    this._isActionPlaying = false;
    this._actionFrameIndex = 0;
    this._actionTimer = 0;
    this._waitCallback = null; // Callback à appeler à la fin de l'action
};

// --- Surcharge de la mise à jour pour prioriser l'action ---
const _ActorAnimManager_update = ActorAnimManager.prototype.update;
ActorAnimManager.prototype.update = function() {
    if(!this._actionQueue) this._actionQueue = [];
    // S'il n'y a pas d'action en cours mais qu'il y en a dans la file, on lance la suivante.
    if (!this._isActionPlaying && this._actionQueue.length > 0) {
        const nextAction = this._actionQueue.shift();
        this._playActionInternal(nextAction.actionName, nextAction.waitCallback);
    }

    // Si une action est en cours, on la met à jour.
    // Sinon, on exécute la logique de mise à jour normale (marche, idle...).
    if (this._isActionPlaying) {
        this.updateAction();
    } else {
        _ActorAnimManager_update.call(this);
    }
};

/**
 * [NOUVEAU] Démarre une animation d'action.
 * Cette méthode ajoute l'action à la file d'attente.
 * @param {string} actionName Le nom de l'action à jouer.
 * @param {function} [waitCallback=null] La fonction à appeler quand l'action est terminée.
 */
ActorAnimManager.prototype.playAction = function(actionName, waitCallback = null) {
    const actionConfig = SC.ActionConfigs.actions[actionName];
    if (!actionConfig) {
        $debugTool.warn(`[ActorAnimManager] Action "${actionName}" non trouvée dans la configuration.`);
        return;
    }
    this._actionQueue.push({ actionName, waitCallback });
};

/**
 * [INTERNE] Logique interne pour démarrer une action depuis la file d'attente.
 * @param {string} actionName Le nom de l'action.
 * @param {function} waitCallback La fonction de callback pour l'attente.
 * @private
 */
ActorAnimManager.prototype._playActionInternal = function(actionName, waitCallback) {
    const actionConfig = SC.ActionConfigs.actions[actionName];
    if (!actionConfig) return;
    
    this.clearAction();
    this._currentAction = actionConfig;
    this._isActionPlaying = true;
    this._currentState = 'action'; // Met à jour l'état principal
    this._waitCallback = waitCallback;

    const character = this.mainManager.character;
    if (character) {
        // Assure que l'animation de pas est active pour voir le changement
        character.setWalkAnime(true);
        character.setStepAnime(false);
    }

    $debugTool.log(`[ActorAnimManager] Acteur ${this.mainManager.actor.actorId()}: Démarre l'action "${actionName}".`, true);
    // Applique immédiatement la première frame
    this.updateActionFrame();
};

/**
 * [NOUVEAU] Arrête l'animation d'action en cours.
 */
ActorAnimManager.prototype.stopAction = function() {
    if (!this._isActionPlaying) return;

    const actionName = this._currentAction.actionName;
    const returnToIdle = this._currentAction.returnToIdle;

    // Si un callback d'attente est défini, on l'appelle.
    if (this._waitCallback) {
        this._waitCallback();
    }

    this.clearAction();
    
    // Force le retour à un état stable
    if (returnToIdle) {
        this.setIdleAnim();
    } else {
        this.setWalkAnim();
    }
    this.mainManager.character.setPattern(1);
    
    $debugTool.log(`[ActorAnimManager] Acteur ${this.mainManager.actor.actorId()}: Arrête l'action "${actionName}". Retour à "${returnToIdle ? 'idle' : 'walk'}".`,true);
};

/**
 * [NOUVEAU] Met à jour la logique de l'animation d'action à chaque frame.
 */
ActorAnimManager.prototype.updateAction = function() {
    this._actionTimer++;
    if (this._actionTimer >= this._currentAction.speed) {
        this._actionTimer = 0;
        
        // Applique la frame actuelle AVANT d'incrémenter
        this.updateActionFrame();
        
        // Incrémente l'index pour la prochaine frame
        this._actionFrameIndex++;
        
        const frames = this._currentAction.frames;
        if (this._actionFrameIndex >= frames.length) {
            if (this._currentAction.loop) {
                this._actionFrameIndex = 0; // Recommence la boucle
            } else {
                this.stopAction(); // Termine l'action
            }
        }
    }
};

/**
 * [NOUVEAU] Applique la frame actuelle de l'animation d'action au personnage.
 */
ActorAnimManager.prototype.updateActionFrame = function() {
    if (!this._isActionPlaying) return;

    const character = this.mainManager.character;
    if (!character) return;

    const action = this._currentAction;
    const pattern = action.frames[this._actionFrameIndex];

    // Applique l'index de la feuille de sprite (la ligne)
    $gameVariables.setValue(this._visualIndexVarId, action.sheetIndex);
    //
    // Applique le pattern (la colonne)
    if(pattern !== undefined && pattern !== null)
        character.setPattern(pattern);

    $debugTool.log(
        `[ActorAnimManager] Acteur ${this.mainManager.actor.actorId()}: Action "${action.actionName}"
        - Frame ${this._actionFrameIndex}
        (Sheet Index: ${action.sheetIndex},
        Pattern: ${pattern}).
        Character Pattern set to: ${character.pattern()}
        Real Character Pattern set to: ${character._pattern}`, true);
};
/**
 * Returns the name of the currently playing action.
 * @returns {string|null} The name of the action, or null if none is playing.
 */
ActorAnimManager.prototype.getCurrentActionName = function() {
    return this._currentAction ? this._currentAction.actionName : null;
};

ActorAnimManager.prototype.getRealActionName = function() {
    let actionTxt = 'null';
    if(this.mainManager && this.mainManager.character){
         if(this.mainManager.character.isJumping()){
            actionTxt = 'jump';
        }else if(this.mainManager.character.isDashing()){
            actionTxt = 'dash';
        }else if(this.mainManager.character.isMoving()){
            actionTxt = 'walk';
        }else{
            actionTxt = 'wait';
        }
    }
    return actionTxt = this._currentAction ? this._currentAction.actionName : actionTxt;
};


const _sequence__ActorAnimManager_initialize = ActorAnimManager.prototype.initialize;
ActorAnimManager.prototype.initialize = function(actorId, config) {
    this._animQueue = []; // Initialise la file d'attente des animations
    _sequence__ActorAnimManager_initialize.call(this, actorId, config);
};

/**
 * [NOUVEAU] Lance une séquence d'animations prédéfinie.
 * @param {string} sequenceName Le nom de la séquence à jouer (doit être définie dans la config).
 */
ActorAnimManager.prototype.playSequence = function(sequenceName) {
    if (this._isActionPlaying) {
        $debugTool.warn(`ActorAnimManager (Actor ${this._actorId}): Impossible de lancer la séquence '${sequenceName}' car une animation est déjà en cours.`);
        return;
    }

    const sequence = SC.SequenceConfig.sequences ? SC.SequenceConfig.sequences[sequenceName] : null;
    if (!sequence || !Array.isArray(sequence)) {
        $debugTool.error(`ActorAnimManager (Actor ${this._actorId}): Séquence '${sequenceName}' non trouvée ou invalide dans la configuration.`);
        return;
    }

    // Remplit la file d'attente avec les animations de la séquence
    this._animQueue = [...sequence];
    $debugTool.log(`Séquence '${sequenceName}' chargée pour l'acteur ${this._actorId}. Actions en file: ${this._animQueue.length}`, true);
};

/**
 * [NOUVEAU] Gère la progression de la file d'attente des animations.
 * @private
 */
ActorAnimManager.prototype.updateSequence = function() {
    // fix provisoire si la file n'existe pas
    if(!this._animQueue) this._animQueue = [];
    
    // Si une animation est en cours ou si la file est vide, on ne fait rien.
    if (this._isActionPlaying || this._animQueue.length === 0) {
        return;
    }

    // On récupère la prochaine animation de la file et on la lance.
    const nextAnim = this._animQueue.shift();
    this.playAction(nextAnim);
};

const _sequence_ActorAnimManager_update = ActorAnimManager.prototype.update;
ActorAnimManager.prototype.update = function() {
    _sequence_ActorAnimManager_update.call(this);
    this.updateSequence(); // On vérifie s'il faut lancer la prochaine animation de la séquence.
};