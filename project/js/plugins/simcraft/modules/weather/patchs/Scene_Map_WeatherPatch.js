//=============================================================================
// RPG Maker MZ - Scene_Map_WeatherPatch
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [SC] Adds the weather overlay to Scene_Map.
 * @author SimCraft
 * @url https://github.com/simcraft-engine
 * @orderAfter ImageManager_WeatherPatch
 *
 * @help
 * This patch handles the creation and update of the weather TilingSprite
 * on the map scene. It also hooks the $gameWeather.update() call.
 */

// --- Aliasing Scene_Map.createDisplayObjects ---
const _alias_Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
    _alias_Scene_Map_createDisplayObjects.call(this);
    this.createWeatherOverlay();
};

// --- Aliasing Scene_Map.update ---
const _alias_Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _alias_Scene_Map_update.call(this);
    if ($gameWeather) {
        $gameWeather.update();
        this.updateWeatherOverlay();
    }    
};

/**
 * Creates the weather TilingSprite.
 */
Scene_Map.prototype.createWeatherOverlay = function() {
    this._weatherOverlaySprite = new TilingSprite();
    this._weatherOverlaySprite.blendMode = 1; // additive blend mode
    this._weatherOverlaySprite.move(0, 0, Graphics.width, Graphics.height);
    
    // Add the sprite to the scene
    this.addChild(this._weatherOverlaySprite);
    
    // Ensure it's above characters but below windows
    if (this._windowLayer) {
        const windowLayerIndex = this.getChildIndex(this._windowLayer);
        this.setChildIndex(this._weatherOverlaySprite, windowLayerIndex);
    }
};

/**
 * Updates the weather TilingSprite's properties each frame.
 */
Scene_Map.prototype.updateWeatherOverlay = function() {
    if (!this._weatherOverlaySprite || !$gameWeather) return;

    const overlayName = $gameWeather.overlayName;

    // Update bitmap if it has changed
    if (this._weatherOverlaySprite.name !== overlayName) {
        this._weatherOverlaySprite.name = overlayName; // Store the name to prevent reloading
        this._weatherOverlaySprite.bitmap = ImageManager.loadWeather(overlayName);
    }
    
    // Update visual properties
    this._weatherOverlaySprite.opacity = ($gameWeather.intensity * 100).clamp(0, 255);
    
    if (this._weatherOverlaySprite.bitmap) {
        this._weatherOverlaySprite.origin.x += $gameWeather.scrollX;
        this._weatherOverlaySprite.origin.y += $gameWeather.scrollY;
    }
};

// --- Aliasing Scene_Map.terminate ---
// Ensure sprites are released from memory
const _alias_Scene_Map_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function() {
    if (this._weatherOverlaySprite) {
        this.removeChild(this._weatherOverlaySprite);
        this._weatherOverlaySprite.destroy();
        this._weatherOverlaySprite = null;
    }
    _alias_Scene_Map_terminate.call(this);
};


//=============================================================================
// System Loader
//=============================================================================
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Scene_Map_WeatherPatch",
    version: "1.0.0",
    icon: "🗺️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_ImageManager_WeatherPatch"],
    createObj: { autoCreate: false },
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
