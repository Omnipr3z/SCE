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
 * @plugindesc !SC [v1.0.0] Patch pour que Game_Map instancie les Game_ActorEvent.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_Game_ActorEvent
 * @orderAfter SC_Game_ActorEvent
 *
 * @help
 * GameActorEvent_GameMapPatch.js
 * 
 * Ce patch surcharge la méthode Game_Map.prototype.setupEvents pour agir
 * comme une "usine" (factory).
 * 
 * Lors de la création des événements d'une carte, il vérifie la présence
 * du notetag <actorId:ID>. Si le notetag est trouvé, il instancie notre
 * classe spécialisée Game_ActorEvent. Sinon, il instancie la classe
 * Game_Event normale de RMMZ.
 */

const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
Game_Map.prototype.setupEvents = function() {
    this._events = [];
    for (const eventData of $dataMap.events) {
        if (eventData) {
            const meta = DataManager.extractEventMetaFromFirstComment(eventData);
            if (meta && meta.actorId) {
                // Si le notetag <actorId:ID> est présent, on crée un Game_ActorEvent.
                this._events[eventData.id] = new Game_ActorEvent(this._mapId, eventData.id);
            } else {
                // Sinon, on crée un Game_Event normal.
                this._events[eventData.id] = new Game_Event(this._mapId, eventData.id);
            }
        }
    }
};

const _ActorAnimManager_update2 = ActorAnimManager.prototype.update;
ActorsAnimsManagers.prototype.update = function() {
    const eventsActors = $gameMap.events().filter(event => event.actor);
    
    for (const character of eventsActors) {
        const manager = this.getManagerFor(character);
        if (manager) {
            manager.update();
        }
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_GameActorEvent_GameMapPatch",
    version: "1.0.0",
    icon: "🏭",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_Game_ActorEvent"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);