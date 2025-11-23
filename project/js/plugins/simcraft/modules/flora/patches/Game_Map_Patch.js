//=============================================================================
// SimCrafters Engine - Flora Module
// Game_Map_Patch.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * Patches for the Game_Map class to handle plantation objects.
 */
//-----------------------------------------------------------------------------

(function() {
    'use strict';

    const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        _Game_Map_setupEvents.call(this);
        this.clearPlantations();
        this.setupPlantations();
    };

    Game_Map.prototype.clearPlantations = function() {
        this._plantations = [];
    };

    Game_Map.prototype.setupPlantations = function() {
        const plantationSpots = SystemLoader.get('SC_PlantationSpots');
        if (!plantationSpots) {
            return;
        }

        const mapSpots = plantationSpots.filter(spot => spot.mapId === this.mapId());

        for (const spotData of mapSpots) {
            const eventId = spotData.eventId;
            if (this._events[eventId]) {
                const plantation = new SimCrafters.Modules.Flora.Game_Plantation(spotData);
                this._events[eventId] = plantation;
                this._plantations.push(plantation);
            }
        }
    };

    /**
     * @returns {Game_Plantation[]}
     */
    Game_Map.prototype.plantations = function() {
        return this._plantations || [];
    };

})();