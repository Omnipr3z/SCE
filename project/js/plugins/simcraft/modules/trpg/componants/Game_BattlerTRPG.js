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
 * @plugindesc !SC [v1.0.0] Classe logique pour une unité de combat TRPG.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_Game_ActorEvent
 * @orderAfter SC_Game_ActorEvent
 *
 * @help
 * Game_BattlerTRPG.js
 * 
 * Ce fichier définit la classe Game_BattlerTRPG. C'est l'objet logique
 * qui représente une unité (acteur ou ennemi) sur le champ de bataille.
 * 
 * Il hérite de Game_ActorEvent pour pouvoir être placé sur la carte et
 * être géré par le système visuel, mais il y ajoute des propriétés et
 * des méthodes spécifiques au combat tactique.
 */

class Game_BattlerTRPG extends Game_ActorEvent {
    /**
     * @param {number} mapId L'ID de la carte.
     * @param {number} eventId L'ID de l'événement qui sert de base.
     * @param {Game_Actor | Game_Enemy} battlerData L'objet de données de l'acteur ou de l'ennemi.
     */
    constructor(mapId, eventId, battlerData) {
        super(mapId, eventId);
        this._battler = battlerData;
        this.initCombatMembers();
    }

    /**
     * Initialise les propriétés spécifiques au combat.
     */
    initCombatMembers() {
        this._hasMoved = false;
        this._hasActed = false;
        // Ici, nous pourrions initialiser les PV/PM en copiant ceux du _battler, etc.
    }

    // Nous pourrions surcharger actor() pour qu'il retourne directement _battler s'il est un Game_Actor.
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Game_BattlerTRPG",
    version: "1.0.0",
    icon: "♟️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_Game_ActorEvent"],
    createObj: { autoCreate: false } // C'est une classe, pas une instance globale.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);