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
        this._alim += this._healthChange.alim || 0;
        this._form += this._healthChange.form || 0;
        this._clean += this._healthChange.clean || 0;
        this._hydra += this._healthChange.hydra || 0;
        this._alim = this._alim.clamp(0, 100);
        this._form = this._form.clamp(0, 100);
        this._clean = this._clean.clamp(0, 100);
        this._hydra = this._hydra.clamp(0, 100);
    }
    isEndSleepMode() {
        return manager._currentAction !== "sleep"
        const manager = $gameActorsAnims.getManagerFor(this.actor());
        return !manager || manager.getCurrentActionName() !== "sleep"
            || this._form >= this._healthChange.formMaxThreshold
    }
    checkWakeUp() {
        if(this._healthChange.activityDuration !== "sleepMode") return;
        if(this.isEndSleepMode()){
            this._healthActivityTimer = 0;
    isEndWashMode() {
        const manager = $gameActorsAnims.getManagerFor(this.actor());
        return !manager || manager.getCurrentActionName() !== "wash"
            || this._clean >= this._healthChange.cleanMaxThreshold
    }
    checkContinuousActivityEnd() {
        if (this._healthActivityTimer === "sleepMode" && this.isEndSleepMode()) {
            this._healthActivityTimer = 0; // End activity
        } else if (this._healthActivityTimer === "washMode" && this.isEndWashMode()) {
            this._healthActivityTimer = 0; // End activity
        }
    }
    isContinuousActivity() {
        return this._healthActivityTimer === "sleepMode" || this._healthActivityTimer === "washMode";
    }
    updateHealthActivity() {
        if(!this._healthChange) return;
        if(this._healthActivityTimer === "sleepMode") {
        if(this.isContinuousActivity()) {
            this.updateHealthChanges();
            this.checkWakeUp();
            this.checkContinuousActivityEnd();
        }else if(this._healthActivityTimer > 0){
            this.updateHealthChanges();
            this._healthActivityTimer--;
        }else{
            this._healthChange = null;
            this._healthActivityTimer = 0;
            const manager = $gameActorsAnims.getManagerFor(this.actor());
            if (manager) {
                manager.stopAction()
            }
        }
    }
    updateHr() {
        this._alim -= SC.HealthConfig.alimDecreaseRate;
        this._form -= SC.HealthConfig.formDecreaseRate;
        this._clean -= SC.HealthConfig.cleanDecreaseRate;
        this._hydra -= SC.HealthConfig.hydraDecreaseRate;
        this._alim = this._alim.clamp(0, 100);
        this._form = this._form.clamp(0, 100);
        this._clean = this._clean.clamp(0, 100);
        this._hydra = this._hydra.clamp(0, 100);
        if(this._alim <= 0){
            this.actor().addState(SC.HealthConfig.hungryStateId);
        }
        if(this._form <= 0){
            this.actor().addState(SC.HealthConfig.deformStateId);
        }
        if(this._clean <= 0){
            this.actor().addState(SC.HealthConfig.dirtyStateId);
        }
        if(this._hydra <= 0){
            this.actor().addState(SC.HealthConfig.thirstyStateId);
        }
    }
    mapUpdate() {
        this.updateBreath();
        if($gameDate._timestamp != this._lastTimeStamp){
            this.updateMin();
            this._lastTimeStamp = $gameDate._timestamp;
        }
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
        if (!animManager.validateImmobilizingAction(actionName)) return;

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
    canConsumeItem(item) {
        if(!item) return false;
        return true;
    }
    useHealthItem(item) {
        if(this.canConsumeItem(item)){
            if(!item.meta)
                DataManager.extractMetadata(item);

            this._healthChange= {
                alim: item.meta.alimIncrease || 0, // un nombre négatif peut reduire la valeur
                form: item.meta.formIncrease || 0,
                clean: item.meta.cleanIncrease || 0,
                hydra: item.meta.hydraIncrease || 0,
                activityDuration: item.meta.activityDuration || 0
            }
            this._healthActivityTimer = item.meta.activityDuration || 0;
            const actionName = item.meta.actionName || "useItem";

            const manager = $gameActorsAnims.getManagerFor(this.actor());
            if (manager) {
                if (!manager.validateImmobilizingAction(actionName))  return;

                manager.stopAction();
                manager.playAction(actionName);
            }
        }
    }

    canSleep(bedData) { return this._form < 70; }
    sleep(bedData) {
        if(this.canSleep(bedData)){
            this.useHealthItem({
                meta: {
                    alimIncrease: bedData.alimIncrease || 0,
                    formIncrease: bedData.formIncrease || 1,
                    cleanIncrease: bedData.cleanIncrease || 0,
                    hydraIncrease: bedData.hydraIncrease || 0,
                    formMaxThreshold: bedData.formMaxThreshold || 100,
                    activityDuration: 'sleepMode',
                    actionName: 'sleep'
                }
            });
        }
    }

    canWash() {
        // Can wash if not perfectly clean and no other activity is running
        return this._clean < 100 && !this._healthChange;
    }
    wash(washData = {}) {
        if (this.canWash()) {
            this.useHealthItem({
                meta: {
                    cleanIncrease: washData.cleanIncrease || 1,
                    cleanMaxThreshold: washData.cleanMaxThreshold || 100,
                    activityDuration: 'washMode',
                    actionName: 'wash'
                }
            });
        }
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

        return distance.clamp(SC.HealthConfig.jumpBaseDistance, SC.HealthConfig.jumpMaxDistance);
    }

    /**
     * Called after a jump has been performed.
     * Consumes breath and resets impulse.
     */
    onJump() {
        this._breath -= SC.HealthConfig.jumpMinBreathCost;
        this._impulse = 0;
    }
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
