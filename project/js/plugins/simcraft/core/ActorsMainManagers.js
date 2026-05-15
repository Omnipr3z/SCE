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
 * @plugindesc !SC [v1.0.0] Gestionnaire principal des acteurs.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_ActorMainManager
 * @orderAfter SC_ActorMainManager
 *
 * @help
 * ActorsMainManagers.js
 * 
 * Ce manager global sert de conteneur pour toutes les instances de
 * ActorMainManager. Il fournit un point d'accès centralisé pour
 * récupérer le "hub" de n'importe quel acteur via son ID.
 * 
 * Il sera instancié en tant que $actorsMM.
 * 
 * ________________________________________________________________________
 *      Methodes principales:
 * ________________________________________________________________________
 * 
 * $actorsMM.actor(actorId)
 * Récupère ou crée à la demande le manager principal pour un acteur donné.
 * param {number} actorId L'ID de l'acteur.
 * returns {ActorMainManager|null}
 * 
 * historique:
 * - v1.0.0 - 2024-06-12 : Version initiale. 
 */

class ActorsMainManagers {
    constructor() {
        this.clear();
    }

    /**
     * Réinitialise l'état du manager.
     */
    clear() {
        this._actorManagers = new Map();
    }

    /**
     * Récupère ou crée à la demande le manager principal pour un acteur donné.
     * @param {number} actorId L'ID de l'acteur.
     * @returns {ActorMainManager|null}
     */
    actor(actorId) {
        if ($dataActors[actorId]) {
            if (!this._actorManagers.has(actorId)) {
                this._actorManagers.set(actorId, new ActorMainManager(actorId));
            }
            return this._actorManagers.get(actorId);
        }
        return null;
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorsMainManagers",
    version: "1.0.0",
    icon: "👨‍💼",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_ActorMainManager"],
    createObj: {
        autoCreate: true,
        classProto: ActorsMainManagers,
        instName: "$actorsMM"
    },
    autoSave: false
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);