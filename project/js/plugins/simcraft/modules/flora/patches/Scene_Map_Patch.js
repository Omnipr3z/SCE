//=============================================================================
// SimCrafters Engine - Flora Module
// Scene_Map_Patch.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * Patches for the Scene_Map class to handle the plantations manager.
 */
//-----------------------------------------------------------------------------

(function() {
    'use strict';

    const _Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        _Scene_Map_create.call(this);
        this.createPlantations();
    };

    Scene_Map.prototype.createPlantations = function() {
        this._plantations = new SimCrafters.Modules.Flora.Game_Plantations();
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this._plantations.update();
    };

})();