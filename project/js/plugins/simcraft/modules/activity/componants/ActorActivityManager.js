/**
 * ╔════════════════════════════════════════╗
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v1.0.0] Gestionnaire d'activité pour un acteur unique.
 * @author SimCraft
 * @base SC_SystemLoader
 *
 * @help
 * ActorActivityManager.js
 *
 * Gère l'activité courante d'un acteur.
 * Utilise le registre SC.Activities pour instancier les classes.
 */

SC.Activities = SC.Activities || {};

class ActorActivityManager {
    constructor(actorId) {
        this._actorId = actorId;
        this._currentActivity = null;
    }

    get mainManager() {
        return $actorsMainManagers.actor(this._actorId);
    }

    /**
     * Vérifie si une activité peut être lancée.
     * @param {string} activityKey La clé de l'activité (ex: "sleep").
     * @returns {boolean}
     */
    canUseActivity(activityKey) {
        // Si on fait déjà quelque chose, on ne peut pas (sauf si on implémente une file d'attente plus tard)
        if (this._currentActivity) return false;

        const activityClass = SC.Activities[activityKey];
        if (!activityClass) {
            console.warn(`[ActorActivityManager] Activité '${activityKey}' introuvable.`);
            return false;
        }

        // Appel de la méthode statique de la classe d'activité
        if (typeof activityClass.canUse === 'function') {
            return activityClass.canUse(this._actorId);
        }
        
        return true;
    }

    /**
     * Démarre une activité.
     * @param {string} activityKey La clé de l'activité.
     * @param {Object} params Paramètres optionnels pour l'activité.
     */
    startActivity(activityKey, params = {}) {
        if (!this.canUseActivity(activityKey)) return;

        const activityClass = SC.Activities[activityKey];
        this._currentActivity = new activityClass(this._actorId, params);
        
        $debugTool.log(`[Activity] Acteur ${this._actorId} démarre : ${activityKey}`, true);
        
        // Lancement effectif
        this._currentActivity.onStart();
    }

    /**
     * Arrête l'activité en cours.
     */
    stopActivity() {
        if (this._currentActivity) {
            this._currentActivity.onStop();
            this._currentActivity = null;
            $debugTool.log(`[Activity] Acteur ${this._actorId} arrête son activité.`, true);
        }
    }

    /**
     * Appelé à chaque frame.
     */
    update() {
        $debugTool.log(`[Activity] Mise à jour de l'activité pour l'acteur ${this._actorId}.`);
        if (this._currentActivity) {
            // Si l'activité demande l'arrêt (via son propre update)
            if (this._currentActivity.isFinished()) {
                this.stopActivity();
            } else {
                this._currentActivity.update();
            }
        }
    }
    
    isBusy() {
        return !!this._currentActivity;
    }
}

// Expose la classe
SC.ActorActivityManager = ActorActivityManager;

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorActivityManager",
    version: "1.0.0",
    icon: "⚙️",
    author: "SimCraft",
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);