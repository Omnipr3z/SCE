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
 * @plugindesc !SC [v1.0.0] Gestionnaire global des données de santé des acteurs.
 * @author SimCraft
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SCE_ActorHealthManager
 * @orderAfter SCE_ActorHealthManager
 *
 * @help
 * ActorsHealthManagers.js
 * 
 * Ce manager est le conteneur global pour toutes les instances de
 * ActorHealthManager. Il est responsable de créer et de fournir l'accès
 * à ces instances via l'objet global $actorHealthManagers.
 * 
 */

class ActorsHealthManagers {
    constructor() {
        this.clear();
    }

    clear() {
        this._data = {};
    }

    /**
     * Retrieves the health manager for a specific actor.
     * If it doesn't exist, it creates one on the fly.
     * @param {number} actorId The ID of the actor.
     * @returns {ActorHealthManager | null} The health manager instance.
     */
    manager(actorId) {
        if (!$gameActors.actor(actorId)) {
            return null;
        }
        if (!this._data[actorId]) {
            this._data[actorId] = new ActorHealthManager(actorId);
        }
        return this._data[actorId];
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorsHealthManagers",
    version: "1.0.0",
    icon: "❤️",
    author: "SimCraft",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["SC_SystemLoader", "SCE_ActorHealthManager"],
    createObj: {
        autoCreate: true,
        classProto: ActorsHealthManagers,
        instName: "$actorHealthManagers"
    },
    save: {
        save: true,
        load: true
    }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);