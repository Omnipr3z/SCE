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
 * @plugindesc !SC [v1.0.0] Patch pour ajouter la gestion des actions à ActorAnimManager.
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
 */


// --- Surcharge du constructeur pour initialiser les états de l'action ---
const _ActorAnimManager_initialize = ActorAnimManager.prototype.constructor;
ActorAnimManager.prototype.constructor = function(character) {
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
};

// --- Surcharge de la mise à jour pour prioriser l'action ---
const _ActorAnimManager_update = ActorAnimManager.prototype.update;
ActorAnimManager.prototype.update = function() {
    if (this._isActionPlaying) {
        this.updateAction();
    } else {
        _ActorAnimManager_update.call(this);
    }
};

/**
 * [NOUVEAU] Démarre une animation d'action.
 * @param {string} actionName Le nom de l'action à jouer.
 */
ActorAnimManager.prototype.playAction = function(actionName) {
    const actionConfig = SC.ActionConfigs.actions[actionName];
    if (!actionConfig) {
        $debugTool.warn(`[ActorAnimManager] Action "${actionName}" non trouvée dans la configuration.`);
        return;
    }

    this.clearAction();
    this._currentAction = actionConfig;
    this._isActionPlaying = true;
    this._currentState = 'action'; // Met à jour l'état principal

    $debugTool.log(`[ActorAnimManager] Acteur ${this._getActorId()}: Démarre l'action "${actionName}".`);
    // Applique immédiatement la première frame
    this.updateActionFrame();
    

    // Assure que l'animation de pas est active pour voir le changement
    this._character.setWalkAnime(true);
    this._character.setStepAnime(false);
};

/**
 * [NOUVEAU] Arrête l'animation d'action en cours.
 */
ActorAnimManager.prototype.stopAction = function() {
    if (!this._isActionPlaying) return;

    const actionName = this._currentAction.actionName;
    const returnToIdle = this._currentAction.returnToIdle;

    this.clearAction();
    
    // Force le retour à un état stable
    if (returnToIdle) {
        this.setIdleAnim();
    } else {
        this.setWalkAnim();
    }
    
    $debugTool.log(`[ActorAnimManager] Acteur ${this._getActorId()}: Arrête l'action "${actionName}". Retour à "${returnToIdle ? 'idle' : 'walk'}".`);
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

    const action = this._currentAction;
    const pattern = action.frames[this._actionFrameIndex];

    // Applique l'index de la feuille de sprite (la ligne)
    $gameVariables.setValue(this._visualIndexVarId, action.sheetIndex);
    //
    // Applique le pattern (la colonne)
    if(pattern !== undefined && pattern !== null)
        this._character.setPattern(pattern);

    $debugTool.log(
        `[ActorAnimManager] Acteur ${this._getActorId()}: Action "${action.actionName}"
        - Frame ${this._actionFrameIndex}
        (Sheet Index: ${action.sheetIndex},
        Pattern: ${pattern}).
        Character Pattern set to: ${this._character.pattern()}
        Real Character Pattern set to: ${this._character._pattern}`);
};


// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorAnimManager_ActionPatch",
    version: "1.0.0",
    icon: "💪",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_ActorAnimManager", "SC_CharacterActionConfig"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);