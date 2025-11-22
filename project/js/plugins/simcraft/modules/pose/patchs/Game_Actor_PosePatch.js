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
 * @plugindesc !SC [v1.0.0] Patch pour la gestion des Poses de personnages.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_ActorAnimManager
 * @base SC_CharacterPoseConfig
 * @orderAfter SC_ActorAnimManager
 *
 * @help
 * Game_Actor_PosePatch.js
 * 
 * Ce patch intègre le système de Poses dans le moteur.
 * 1. Il ajoute à Game_Actor la capacité de gérer sa pose actuelle.
 * 2. Il surcharge ActorAnimManager pour qu'il utilise la pose de l'acteur
 *    afin de déterminer l'index d'animation correct.
 *
 * ▸ Historique :
 *   v1.0.0 - 2024-08-03 : Création initiale du patch.
 */

//=============================================================================
// Game_Actor
//=============================================================================

const _Game_Actor_initMembers2 = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
    _Game_Actor_initMembers.call(this);
    this._currentPose = 'default'; // La pose par défaut de chaque acteur.
};

/**
 * [NOUVEAU] Définit la pose actuelle de l'acteur.
 * @param {string} poseName Le nom de la nouvelle pose (doit exister dans SC.posesConfig).
 */
Game_Actor.prototype.setPose = function(poseName) {
    if (SC.posesConfig[poseName]) {
        this._currentPose = poseName;
    } else {
        console.warn(`Tentative de définir une pose inconnue: "${poseName}"`, true);
        this._currentPose = 'default';
    }
};

/**
 * [NOUVEAU] Récupère le nom de la pose actuelle de l'acteur.
 * @returns {string}
 */
Game_Actor.prototype.getPose = function() {
    return this._currentPose || 'default';
};

//=============================================================================
// ActorAnimManager
//=============================================================================

/**
 * [NOUVEAU] Récupère l'index d'animation pour un état donné, en fonction de la pose actuelle de l'acteur.
 * @param {string} animState Le nom de l'état d'animation (ex: 'walk', 'idle').
 * @returns {number} L'index du spritesheet.
 */
ActorAnimManager.prototype.getIndexForState = function(animState) {
    const actor = this._character === $gamePlayer? $gameParty.leader() : this._character.actor();
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
};

// --- Surcharge des méthodes d'application d'animation ---

const _ActorAnimManager_setDashAnim = ActorAnimManager.prototype.setDashAnim;
ActorAnimManager.prototype.setDashAnim = function() {
    _ActorAnimManager_setDashAnim.call(this);
    $gameVariables.setValue(this._visualIndexVarId, this.getIndexForState('dash'));
};

const _ActorAnimManager_setIdleAnim = ActorAnimManager.prototype.setIdleAnim;
ActorAnimManager.prototype.setIdleAnim = function() {
    _ActorAnimManager_setIdleAnim.call(this);
    $gameVariables.setValue(this._visualIndexVarId, this.getIndexForState('idle'));
};

const _ActorAnimManager_setWalkAnim = ActorAnimManager.prototype.setWalkAnim;
ActorAnimManager.prototype.setWalkAnim = function() {
    _ActorAnimManager_setWalkAnim.call(this);
    $gameVariables.setValue(this._visualIndexVarId, this.getIndexForState('walk'));
};

const _ActorAnimManager_setJumpAnim = ActorAnimManager.prototype.setJumpAnim;
ActorAnimManager.prototype.setJumpAnim = function() {
    _ActorAnimManager_setJumpAnim.call(this);
    $gameVariables.setValue(this._visualIndexVarId, this.getIndexForState('jump'));
};

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Game_Actor_PosePatch",
    version: "1.0.0",
    icon: "🧘",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_ActorAnimManager", "SC_CharacterPoseConfig"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);