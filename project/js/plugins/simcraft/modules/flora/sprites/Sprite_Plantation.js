//=============================================================================
// SimCrafters Engine - Flora Module
// Sprite_Plantation.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * The sprite for displaying a plantation.
 *
 * @class Sprite_Plantation
 * @extends Sprite_Character
 */
//-----------------------------------------------------------------------------

function Sprite_Plantation() {
    this.initialize(...arguments);
}

Sprite_Plantation.prototype = Object.create(Sprite_Character.prototype);
Sprite_Plantation.prototype.constructor = Sprite_Plantation;

Sprite_Plantation.prototype.initialize = function(character) {
    Sprite_Character.prototype.initialize.call(this, character);
};

// We will add methods here to update the bitmap based on the plant's growth stage.

SimCrafters.Modules.Flora.Sprite_Plantation = Sprite_Plantation;