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
 * @plugindesc !SC [v1.1.0] Gestionnaire global des animations de personnages.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_ActorAnimManager
 * @orderAfter SC_ActorAnimManager
 *
 * @help
 * ActorsAnimsManagers.js
 * 
 * Ce manager est le "manager des managers". Il est responsable de créer,
 * mettre à jour et détruire les instances de ActorAnimManager pour chaque
 * personnage visible sur la carte.
 * 
 * Il sera instancié en tant que $gameActorsAnims.
 */

class ActorsAnimsManagers {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.clear();
    }

    /**
     * Réinitialise l'état du manager.
     */
    clear() {
        this._actorManagers = new Map();
    }

    /**
     * Méthode principale appelée à chaque frame de la carte.
     */
    update() {
        // Personnages du groupe (joueur + followers)
        const characters = [$gamePlayer, ...$gamePlayer.followers().visibleFollowers()];
        for (const character of characters) {
            const manager = this.getManagerFor(character);
            if (manager) {
                manager.update();
            }
        }

        // Événements qui sont des acteurs
        const eventsActors = $gameMap.events().filter(event => event.actor);
        for (const character of eventsActors) {
            const manager = this.getManagerFor(character);
            if (manager) {
                manager.update();
            }
        }
    }

    /**
     * Récupère ou crée le manager d'animation pour un personnage donné.
     * @param {Game_Character} character Le personnage cible.
     * @returns {ActorAnimManager|null}
     */
    getManagerFor(character) {
        if (!character) return null;
        // Utilise l'ID de l'acteur s'il existe, sinon une clé unique pour les autres personnages.
        const characterId = character.actor ? character.actor().actorId() : $gameParty.leader().actorId();
        
        if (!this._actorManagers.has(characterId)) {
            this._actorManagers.set(characterId, new ActorAnimManager(character));
        }
        return this._actorManagers.get(characterId);
    }
    getManagerById(actorId) {
        if (!actorId) return null;
        if (!this._actorManagers.has(actorId)) {
            this._actorManagers.set(actorId, new ActorAnimManager(actorId));
        }
        return this._actorManagers.get(actorId);
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorsAnimsManagers",
    version: "1.1.0",
    icon: "🎬",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_ActorAnimManager"],
    createObj: {
        autoCreate: true,
        classProto: ActorsAnimsManagers,
        instName: "$gameActorsAnims"
    },
    autoSave: false // La gestion de l'état sera probablement transitoire et reconstruite.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);