//=============================================================================
// RPG Maker MZ - ImageManager_WeatherPatch
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [SC] Adds weather image loading functionality to ImageManager.
 * @author SimCraft
 * @url https://github.com/simcraft-engine
 * @orderAfter Game_Weather
 *
 * @help
 * This patch adds the `loadWeather` method to the ImageManager.
 */

// Add the new loader function to ImageManager
ImageManager.loadWeather = function(filename) {
    return this.loadBitmap("img/weather/", filename);
};

//=============================================================================
// System Loader
//=============================================================================
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ImageManager_WeatherPatch",
    version: "1.0.0",
    icon: "🖼️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_Game_Weather"],
    createObj: { autoCreate: false },
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
