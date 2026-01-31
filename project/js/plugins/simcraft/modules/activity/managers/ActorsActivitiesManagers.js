/**
 * ╔════════════════════════════════════════╗
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v1.0.0] Gestionnaire global des activités des acteurs.
 * @author SimCraft
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_ActorActivityManager
 * @orderAfter SC_ActorActivityManager
 *
 * @help
 * ActorsActivitiesManagers.js
 * 
 * Conteneur global pour les instances de ActorActivityManager.
 * Accessible via $actorsActivitiesManagers.
 */

class ActorsActivitiesManagers {
    constructor() {
        this.clear();
    }

    clear() {
        this._managers = {};
    }

    /**
     * Récupère ou crée le manager d'activité pour un acteur donné.
     * @param {number} actorId L'ID de l'acteur.
     * @returns {ActorActivityManager}
     */
    manager(actorId) {
        if (!$gameActors.actor(actorId)) return null;
        
        if (!this._managers[actorId]) {
            this._managers[actorId] = new ActorActivityManager(actorId);
        }
        return this._managers[actorId];
    }

    /**
     * Update principal appelé par la scène ou le système global.
     */
    update() {
        // On met à jour uniquement les managers actifs
        for (const id in this._managers) {
            this._managers[id].update();
        }
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorsActivitiesManagers",
    version: "1.0.0",
    icon: "🛠️",
    author: "SimCraft",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["SC_SystemLoader", "SC_ActorActivityManager"],
    createObj: {
        autoCreate: true,
        classProto: ActorsActivitiesManagers,
        instName: "$actorsActivitiesManagers"
    },
    save: {
        save: true, // On sauvegarde l'état des activités en cours
        load: true
    }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);