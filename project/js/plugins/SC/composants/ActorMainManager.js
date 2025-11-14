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
 * @plugindesc !SC [v1.0.0] Composant central pour la gestion d'un acteur.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * ActorMainManager.js
 * 
 * Ce composant sert de "hub" pour un acteur spécifique, fournissant un
 * point d'accès unifié à tous les autres managers et systèmes qui lui
 * sont rattachés (animation, santé, etc.).
 */

class ActorMainManager {
    /**
     * @param {number} actorId L'ID de l'acteur que ce manager représente.
     */
    constructor(actorId) {
        this._id = actorId;
        this._actionQueue = [];
    }

    /**
     * Raccourci pour accéder à l'objet Game_Actor.
     * @returns {Game_Actor}
     */
    get actor() {
        return $gameActors.actor(this._id);
    }

    /**
     * Raccourci pour accéder au manager d'animation de cet acteur.
     * @returns {ActorAnimManager|null}
     */
    get actorAnimManager() {
        return $gameActorsAnims.getManagerForActorId(this._id);
    }

    /**
     * Raccourci pour accéder à l'objet Game_Character (Game_Player ou Game_Follower) sur la carte.
     * Retourne null si l'acteur n'est pas actuellement sur la carte.
     * @returns {Game_Character|null}
     */
    get character() {
        // Vérifie si l'acteur est le leader du groupe (et donc le joueur)
        if ($gameParty.leader().actorId() === this._id) {
            return $gamePlayer;
        }

        // Cherche l'acteur parmi les followers visibles
        const follower = $gamePlayer.followers().visibleFollowers().find(f => f.actor() && f.actor().actorId() === this._id);
        if (follower) {
            return follower;
        }

        // Cherche si un événement sur la carte représente cet acteur (pour le futur module ActorEvents)
        const event = $gameMap.events().find(e => e._actorEventId && e._actorEventId === this._id);
        if (event) {
            return event;
        }

        // L'acteur n'est pas sur la carte en tant que joueur, follower ou événement.
        return null;
    }
}

// --- Enregistrement du plugin ---
// Ce plugin ne crée pas d'objet global, mais il doit être enregistré
// pour que d'autres plugins puissent déclarer une dépendance envers lui.
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorMainManager",
    version: "1.0.0",
    icon: "HUB",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false } // C'est une classe, pas une instance globale.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);