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
 * @plugindesc !SC [v1.0.1] Patch pour ajouter la gestion des actions à ActorAnimManager.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_ActorAnimManager
 * @base SC_CharacterActionConfig
 * @orderAfter SC_ActorAnimManager
 *
 * @help
 * ActorAnimManager_ActionPatch.js
 * 
 * Ce patch étend les fonctionnalités de ActorAnimManager pour lui permettre
 * de jouer des animations d'action personnalisées, définies dans
 * SC_CharacterActionConfig.js.
 *
 * Il surcharge la logique de mise à jour pour donner la priorité aux actions
 * sur les animations d'état (marche, idle, etc.).
 * 
 * ▸ Historique :
 *  v1.0.0 - 2025-12-22 : Création initiale du patch.
 */


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

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorAnimManager_ActionPatch",
    version: "1.0.1",
    icon: "💪",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_ActorAnimManager", "SC_CharacterActionConfig"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);