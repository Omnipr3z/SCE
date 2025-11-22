//=============================================================================
// RPG Maker MZ - Game_Interpreter_WeatherPatch
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [SC] Overrides the weather event command to use Game_Weather.
 * @author SimCraft
 * @url https://github.com/simcraft-engine
 * @orderAfter Game_Weather
 *
 * @help
 * This patch redirects the `command236` (Change Weather) to use the
 * $gameWeather.force() and $gameWeather.release() methods.
 */

// --- Aliasing Game_Interpreter.command236 ---
const _alias_Game_Interpreter_command236 = Game_Interpreter.prototype.command236;
Game_Interpreter.prototype.command236 = function(params) {
    if (!$gameWeather) {
        // If our system is not available, fall back to the original command.
        return _alias_Game_Interpreter_command236.call(this, params);
    }

    const typeId = params[0];
    const power = params[1];
    const duration = params[2]; // Not directly used by our system in the same way

    let type = "clear";
    switch (typeId) {
        case 1:
            type = "rain";
            break;
        case 2:
            type = "storm";
            break;
        case 3:
            type = "snow";
            break;
    }

    if (type === "clear") {
        $gameWeather.release(60); // Transition back to auto in 60 frames
    } else {
        // Map power (0-9) to intensity (0-255).
        // A simple linear mapping. (power + 1) * 25
        const intensity = Math.min((power + 1) * 25, 255);
        $gameWeather.force(type, intensity, 60); // Force the weather with a 60 frame transition
    }
    
    // We don't call the original function because we are replacing it.
    // We also don't handle the "wait for completion" as our transitions are visual.
    return true;
};


//=============================================================================
// System Loader
//=============================================================================
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Game_Interpreter_WeatherPatch",
    version: "1.0.0",
    icon: "🎬",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_Game_Weather"],
    createObj: { autoCreate: false },
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
