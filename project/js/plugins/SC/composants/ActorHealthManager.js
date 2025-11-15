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
 * @plugindesc !SC [v1.0.0] Composant pour la gestion de la santé des acteurs.
 * @author SimCraft
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_HealthConfig
 * @orderAfter SC_HealthConfig
 *
 * @help
 * ActorHealthManager.js
 *
 * Ce composant fournit la classe ActorHealthManager, qui gère les statistiques
 * de survie et de bien-être pour un acteur individuel (faim, soif, fatigue, etc.).
 *
 * Ce fichier ne fait que définir la classe. C'est le manager
 * 'ActorsHealthManagers' qui se charge de créer et de gérer les instances
 * de cette classe pour chaque acteur.
 */

var Imported = Imported || {};
Imported.ActorHealthManager = true;

var SimCraft = SimCraft || {};
SimCraft.ActorHealthManager = SimCraft.ActorHealthManager || {};


    //=============================================================================
    // ActorHealthManager
    //=============================================================================
    // Manages the health and well-being stats for a single actor.

class ActorHealthManager {
    /**
     * @param {number} actorId
     */
    constructor(actorId) {
        this.initMembers(actorId);
    }

    /**
     * Initializes all member variables.
     * @param {number} actorId
     */
    initMembers(actorId) {
        this._actorId = actorId;
        // All values are percentages, initialized to 100%.
        this._alim = 100;   // Satiety
        this._form = 100;   // Vitality / Form
        this._clean = 100;  // Cleanliness / Hygiene
        this._hydra = 100;  // Hydration
        this._breath = 100; // Breath / Short-term stamina
        this._impulse = 0;  // Impulse / Sudden exertion level
    }

    /**
     * @returns {Game_Actor} The associated Game_Actor instance.
     */
    actor() {
        return $gameActors.actor(this._actorId);
    }

    //--- Getters
    getAlim() { return this._alim; }
    getForm() { return this._form; }
    getClean() { return this._clean; }
    getHydra() { return this._hydra; }
    getBreath() { return this._breath; }

    //--- Update Hooks
    updateMin() { /* Logic for minute-by-minute updates */ }
    updateHr() { /* Logic for hour-by-hour updates */ }
    mapUpdate() {
        this.updateBreath();
    }

    /**
     * Updates the breath stat based on the character's movement on the map.
     */
    updateBreath() {
        // Find the character on the map corresponding to this actor.
        // For now, we only handle the player character.
        const playerActor = $gamePlayer.actor();
        if (!playerActor || playerActor.actorId() !== this._actorId) {
            return;
        }
        const character = $gamePlayer;

        const isCurrentlyBreathing = this.isBreathing(character);

        if (character.isDashing()) {
            this.updateBreathDashing();
            if (this._breath <= 0) {
                this.startBreathing(character);
            }
        } else if (this.isOutOfBreath() && !isCurrentlyBreathing) {
            this.startBreathing(character);
        } else if (isCurrentlyBreathing) {
            this.recoverBreathWhileStatic(); // Recovering while the "breathing" animation plays
        } else if (character.isMoving()) {
            this.updateBreathMoving();
        } else {
            this.recoverBreathWhileStatic();
        }

        if (this.isBreathRecovered() && isCurrentlyBreathing) {
            this.stopBreathing(character);
        }

        this._breath = this._breath.clamp(0, 100);
    }

    updateBreathDashing() {
        // Decrease breath quickly when dashing
        this._breath -= SC.HealthConfig.breathDashDecreaseRate;
        this._impulse++;
    }

    updateBreathMoving() {
        // Slowly recover breath when walking
        this._breath += SC.HealthConfig.breathWalkRecoverRate;
        this._impulse = 0;
    }

    recoverBreathWhileStatic() {
        // Recover breath faster when not moving
        this._breath += SC.HealthConfig.breathStaticRecoverRate;
        this._impulse = 0;
    }

    isOutOfBreath() {
        return this._breath <= SC.HealthConfig.breathOutThreshold;
    }

    startBreathing(character) {
        const animManager = $gameActorsAnims.getManagerFor(character);
        if (!animManager) return;

        const actionName = "breathing";
        const actionConfig = SC.ActionConfigs.actions[actionName];

        if (!actionConfig) {
            $debugTool.error(`Action '${actionName}' is not defined in the animation config for actor ${this._actorId}.`);
            return;
        }
        if (actionConfig.loop !== true) {
            $debugTool.error(`Action '${actionName}' for actor ${this._actorId} must be loopable (loop: true).`);
            return;
        }
        if (actionConfig.blockMovement !== true) {
            $debugTool.error(`Action '${actionName}' for actor ${this._actorId} must block movement (canMove: false).`);
            return;
        }

        if (animManager.getCurrentActionName() !== actionName) {
            character.playAction("breathing");
        }
        this._impulse = 0;
    }

    stopBreathing(character) {
        character.stopAction();
        this._impulse = 0;
    }

    isBreathing(character) {
        const manager = $gameActorsAnims.getManagerFor(character);
        if (!character || !manager) {
            return false;
        }
        return manager.getCurrentActionName() === "breathing";
    }
    
    isBreathRecovered() {
        /* TBD */
        return this._breath >= SC.HealthConfig.breathRecoveredThreshold;
    }
    /**
     * Calculates a global health score from 0.0 (death) to 1.0 (perfect).
     * @returns {number}
     */
    getHealthScore() {
        // TBD: Logic to calculate the score based on all stats.
        const factors = [
            this._alim / 100,
            this._form / 100,
            this._clean / 100,
            this._hydra / 100
        ];
        const average = factors.reduce((a, b) => a + b, 0) / factors.length;
        return average;
    }

    //--- Actions
    canEat(item) { /* TBD */ return false; }
    eat(item) { /* TBD */ }

    canSleep(bedData) { /* TBD */ return false; }
    sleep(bedData) { /* TBD */ }

    impulse() { /* TBD: Logic for jumps/dashes affecting breath */ }

    wash() { /* TBD */ }
    getDirty() { /* TBD */ }

    drink() { /* TBD */ }
    thirst() { /* TBD */ }
}

// Expose the class within the SimCraft (SC) namespace.
SC.ActorHealthManager = ActorHealthManager;

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorHealthManager",
    version: "1.0.0",
    icon: "🧬",
    author: "SimCraft",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["SC_SystemLoader", "SC_HealthConfig"],
    createObj: null,
    save: null
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
