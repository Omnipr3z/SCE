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