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
        this._lastTimeStamp = -1; // Last timestamp for minute-based updates
        this._minCounter = 0; // Minute counter for tracking time-based updates
        this._healthChange = {};
    }

    /**
     * @returns {ActorMainManager} The main manager instance for this actor.
     */
    get mainManager() {
        return $actorsMM.actor(this._actorId);
    }

    //--- Getters
    getAlim() { return this._alim; }
    getForm() { return this._form; }
    getClean() { return this._clean; }
    getHydra() { return this._hydra; }
    getBreath() { return this._breath; }

    //--- Update Hooks
    updateMinCounter(){
        if(this._minCounter >= 60){
            this.updateHr();
            this._minCounter = 0;
        }
        this._minCounter++;
    }
    updateMin() { 
        this.updateMinCounter();
        this.updateHealthActivity();
    }

    updateHealthChanges() {
        this._alim  +=  this._healthChange.alim  || 0;
        this._form  +=  this._healthChange.form  || 0;
        this._clean +=  this._healthChange.clean || 0;
        this._hydra +=  this._healthChange.hydra || 0;
        this._alim  =   this._alim.clamp(0, 100);
        this._form  =   this._form.clamp(0, 100);
        this._clean =   this._clean.clamp(0, 100);
        this._hydra =   this._hydra.clamp(0, 100);
    }
    updateHealthActivity() {
        if(this._healthActivityTimer > 0){
            this.updateHealthChanges();
            this._healthActivityTimer--;
        }else{
            this._healthChange = {};
            this._healthActivityTimer = 30;
        }
    }
    updateHr() {
        this._alim -= SC.HealthConfig.alimDecreaseRate;
        if(!this.mainManager.activity._currentActivity && false){
            const staminaRate = this.getStaminaCostRate ? this.getStaminaCostRate() : 1.0;
            this._form -= SC.HealthConfig.formDecreaseRate * staminaRate;
            this._clean -= SC.HealthConfig.cleanDecreaseRate;
            this._hydra -= SC.HealthConfig.hydraDecreaseRate;
            this._alim = this._alim.clamp(0, 100);
            this._form = this._form.clamp(0, 100);
            this._clean = this._clean.clamp(0, 100);
            this._hydra = this._hydra.clamp(0, 100);
        }
        this.updateHealthDeceaseStates()
    }
    updateHealthDeceaseStates(){
        if(this._alim <= 0){
            this.mainManager.actor.addState(SC.HealthConfig.hungryStateId);
        }
        if(this._form <= 0){
            this.mainManager.actor.addState(SC.HealthConfig.deformStateId);
        }
        if(this._clean <= 0){
            this.mainManager.actor.addState(SC.HealthConfig.dirtyStateId);
        }
        if(this._hydra <= 0){
            this.mainManager.actor.addState(SC.HealthConfig.thirstyStateId);
        }
    }
    mapUpdate() {
        this.updateBreath();
        if($gameDate.timestamp != this._lastTimeStamp){
            this.updateMin();
            this._lastTimeStamp = $gameDate.timestamp;
        }
    }

    /**
     * Updates the breath stat based on the character's movement on the map.
     */
    updateBreath() {
        const character = this.mainManager.character;
        if (!character) {
            return;
        }

        const isCurrentlyBreathing = this.isBreathing();

        if (character.isDashing()) {
            this.updateBreathDashing();
            if (this._breath <= 0) {
                this.startBreathing();
            }
        } else if (this.isOutOfBreath() && !isCurrentlyBreathing) {
            this.startBreathing();
        } else if (isCurrentlyBreathing) {
            this.recoverBreathWhileStatic(); // Recovering while the "breathing" animation plays
        } else if (character.isMoving()) {
            this.updateBreathMoving();
        } else {
            this.recoverBreathWhileStatic();
        }

        if (this.isBreathRecovered() && isCurrentlyBreathing) {
            this.stopBreathing();
        }

        this._breath = this._breath.clamp(0, 100);
    }

    updateBreathDashing() {
        // Decrease breath quickly when dashing
        const staminaRate = this.getStaminaCostRate ? this.getStaminaCostRate() : 1.0;
        this._breath -= SC.HealthConfig.breathDashDecreaseRate * staminaRate;
        const impulseRate = this.getImpulseGainRate ? this.getImpulseGainRate() : 1.0;
        this._impulse += 1 * impulseRate;
    }

    updateBreathMoving() {
        // Slowly recover breath when walking
        const regenRate = this.getBreathRegenRate ? this.getBreathRegenRate() : 1.0;
        this._breath += SC.HealthConfig.breathWalkRecoverRate * regenRate;
        this._impulse = 0;
    }

    recoverBreathWhileStatic() {
        // Recover breath faster when not moving
        const regenRate = this.getBreathRegenRate ? this.getBreathRegenRate() : 1.0;
        this._breath += SC.HealthConfig.breathStaticRecoverRate * regenRate;
        this._impulse = 0;
    }

    isOutOfBreath() {
        return this._breath <= SC.HealthConfig.breathOutThreshold;
    }
    startBreathing() {
        const animManager = this.mainManager.animator;
        if (!animManager) return;

        const actionName = "breathing";
        if (!animManager.validateImmobilizingAction(actionName)) return;

        if (animManager.getCurrentActionName() !== actionName) {
            this.mainManager.character.playAction("breathing");
        }
        this._impulse = 0;
    }

    stopBreathing() {
        if (this.mainManager.character) {
            this.mainManager.character.stopAction();
        }
        this._impulse = 0;
    }

    isBreathing() {
        const manager = this.mainManager.animator;
        if (!this.mainManager.character || !manager) {
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
            this._alim,
            this._form,
            this._clean,
            this._hydra
        ];
        const average = factors.reduce((a, b) => a + b, 0) / factors.length;
        return Math.round(average);
    }

    /**
     * Checks if the actor has enough breath to perform a jump.
     * @returns {boolean}
     */
    canJump() {
        return this._breath >= SC.HealthConfig.jumpMinBreathCost;
    }

    /**
     * Calculates the jump distance based on the current impulse.
     * Uses the threshold system defined in the config.
     * @returns {number} The calculated jump distance in tiles.
     */
    calculateJumpDistance() {
        let distance = SC.HealthConfig.jumpBaseDistance;
        const thresholds = SC.HealthConfig.jumpImpulseThresholds;

        for (const threshold of thresholds) {
            if (this._impulse >= threshold) {
                distance++;
            } else {
                break; // Stop checking once a threshold is not met
            }
        }

        // Applique le multiplicateur de distance (AGI + Traits)
        const char = this.mainManager.character;
        const multiplier = (char && char.getJumpDistanceMultiplier) ? char.getJumpDistanceMultiplier() : 1.0;
        const finalDistance = Math.round(distance * multiplier);

        return finalDistance.clamp(SC.HealthConfig.jumpBaseDistance, SC.HealthConfig.jumpMaxDistance);
    }

    /**
     * Called after a jump has been performed.
     * Consumes breath and resets impulse.
     */
    onJump() {
        this._breath -= SC.HealthConfig.jumpMinBreathCost;
        this._impulse = 0;
    }

    // testEat(){
    //     $actorsMM.actor($gameParty.leader().actorId()).health.useHealthItem(
    //         {
    //             meta: {
    //                 alimIncrease: 1,
    //                 formIncrease: 0,
    //                 cleanIncrease: 0,
    //                 hydraIncrease: 0,
    //                 activityDuration: 80,
    //                 actionName: 'combat_idle'
    //             }
    //         }
    //     )
    // }
    
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
