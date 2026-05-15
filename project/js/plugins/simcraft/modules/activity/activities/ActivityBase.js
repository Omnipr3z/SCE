/**
 * ╔════════════════════════════════════════╗
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v1.0.0] Classes de base pour les activités.
 * @author SimCraft
 * @base SC_ActorActivityManager
 *
 * @help
 * ActivityBase.js
 *
 * Définit la structure d'une activité et enregistre les activités concrètes.
 */

// ==============================================================================
// CLASSE DE BASE
// ==============================================================================

class ActivityBase {
    constructor(actorId, params = {}) {
        this._actorId = actorId;
        this._params = params;
        this._finished = false;
        this.onStart();
    }

    get mainManager() {
        return $actorsMM.actor(this._actorId);
    }

    /**
     * Méthode statique pour vérifier les conditions avant instanciation.
     * À surcharger dans les classes filles.
     */
    static canUse(actorId) {
        return true;
    }

    /**
     * Appelé au démarrage de l'activité.
     * Sert à lancer les animations, initialiser les timers, etc.
     */
    onStart() {
        // À implémenter
    }

    /**
     * Appelé à chaque frame.
     * Sert à appliquer les effets (santé, etc.) et vérifier les conditions de fin.
     */
    update() {
        // À implémenter
    }

    /**
     * Appelé à l'arrêt de l'activité (manuel ou automatique).
     * Sert à nettoyer (arrêter l'animation, reset variables).
     */
    onStop() {
        // À implémenter
    }

    /**
     * Marque l'activité comme terminée pour que le manager la supprime.
     */
    finish() {
        this._finished = true;
    }

    isFinished() {
        return this._finished;
    }
}





SC.Activities = [];
// Enregistrement dans le registre

// Expose Base Class
SC.ActivityBase = ActivityBase;