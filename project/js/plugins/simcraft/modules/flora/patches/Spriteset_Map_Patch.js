//=============================================================================
// SimCrafters Engine - Flora Module
// Spriteset_Map_Patch.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * Patches for the Spriteset_Map class to handle plantation sprites.
 */
//-----------------------------------------------------------------------------

(function() {
    'use strict';

    const _Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        _Spriteset_Map_createCharacters.call(this);
        this.createPlantationSprites();
    };

    Spriteset_Map.prototype.createPlantationSprites = function() {
        // This logic will be completed later. It will iterate through
        // the plantations on the map and create a Sprite_Plantation for each.
    };

})();