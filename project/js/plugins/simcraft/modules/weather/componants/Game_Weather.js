//=============================================================================
// RPG Maker MZ - Game_Weather
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [SC] Manages automated and forced weather system.
 * @author SimCraft
 * @url https://github.com/simcraft-engine
 * @orderAfter SC_SystemLoader
 * @orderAfter SC_GameDate
 * @orderAfter SC_WeatherConfig
 *
 * @help
 * This plugin creates and manages the $gameWeather object, which handles
 * the weather simulation.
 *
 * It requires SC_GameDate for seasonal changes and SC_WeatherConfig for
 * weather type definitions.
 *
 * --- PLUGIN COMMANDS ---
 * ForceWeather type intensity duration
 *  - type: The name of the weather type (e.g., rain, cloudy).
 *  - intensity: The opacity of the overlay (0-255).
 *  - duration: The time in frames for the transition.
 *  Example: ForceWeather rain 200 120
 *
 * ReleaseWeather duration
 *  - duration: The time in frames to transition back to auto-weather.
 *  Example: ReleaseWeather 300
 */

//=============================================================================
// Game_Weather
//=============================================================================
class Game_Weather {
    constructor() {
        this.initialize();
    }

    initialize() {
        this._type                  = "clear";
        this._intensity             = 0;
        this._targetIntensity       = 0;
        this._duration              = 0;
        this._isForced              = false;
        this._lastLogicUpdateTime   = 0;
        this._climate               = "temperate";
        // Visual properties
        this._overlayName           = "";
        this._scrollX               = 0;
        this._scrollY               = 0;
    }

    // --- PUBLIC API (GETTERS) ---
    get type() {            return this._type; }
    get intensity() {       return this._intensity; }
    get isForced() {        return this._isForced; }
    get overlayName() {     return this._overlayName; }
    get scrollX() {         return this._scrollX; }
    get scrollY() {         return this._scrollY; }
    
    // --- CONTROL METHODS ---

    /**
     * Forces a specific weather type, overriding automation.
     * @param {string} type The weather type from config.
     * @param {number} intensity The target intensity (0-255).
     * @param {number} duration The transition duration in frames.
     */
    force(type, intensity, duration) {
        if(!SC.weather.config[type]) {
            $dabugTool.warn(`SimCraft Weather: Unknown weather type "${type}" forced.`);
            return;
        }
        this._isForced = true;
        this.change(type, intensity, duration);
    }

    /**
     * Releases a forced weather and returns to automation.
     * @param {number} duration The transition duration in frames.
     */
    release(duration) {
        this._isForced = false;
        // Set a long duration to smoothly fade out the forced effect
        this._duration = duration || 120;
        // Trigger an immediate automatic update to find the new target
        this.updateAutomaticWeather();
    }

    /**
     * Initiates a change to a new weather state.
     * @param {string} type The weather type from config.
     * @param {number} intensity The target intensity (0-255).
     * @param {number} duration The transition duration in frames.
     */
    change(type, intensity, duration) {
        const config = SC.weather.config[type];
        if (!config) return;

        this._type = type;
        this._targetIntensity = intensity;
        this._duration = duration || 60;

        this._overlayName = config.overlay || "";
        this._scrollX = config.scrollX || 0;
        this._scrollY = config.scrollY || 0;

        if (this._intensity === 0 && this._duration === 0) {
             this._intensity = this._targetIntensity;
        }

        // Handle native RPG Maker weather
        const native = config.native || { type: "none", power: 0 };
        // Use a default transition time for native weather
        $gameScreen.changeWeather(native.type, native.power, 60);
    }

    // --- UPDATE LOGIC ---

    /**
     * The main update method, called every frame.
     */
    update() {
        this.updateLogic();
    }
    
    /**
     * Updates the core weather logic (calculation).
     * This part is optimized to run periodically.
     */
    updateLogic() {
        if (this._isForced)  {
            $debugTool.log("SimCraft Weather: Weather is forced; skipping automatic update.");
            return;
        }
        if (!$gameDate) {
            $debugTool.warn("SimCraft Weather: $gameDate not found. Weather automation disabled.");
            return;
        }
        if(!$dataWeather){
            $debugTool.warn("SimCraft Weather: $dataWeather not loaded. Weather automation disabled.");
            return;
        }

        // 10 virtual minutes = 600 seconds
        if (($gameDate.timestamp - this._lastLogicUpdateTime) >= 15) {
            this.updateAutomaticWeather();
            this.updateVisuals();
            this._lastLogicUpdateTime = $gameDate.timestamp;
            $debugTool.log("SimCraft Weather: Automatic weather update triggered.");
        }
    }

    /**
     * Updates visual properties like intensity interpolation.
     * This part runs every frame for smooth transitions.
     */
    updateVisuals() {
        if (this._duration > 0) {
            const d = this._duration;
            this._intensity = (this._intensity * (d - 1) + this._targetIntensity) / d;
            this._duration--;
        }
    }

    // --- AUTOMATION ENGINE ---

    /**
     * Determines the next weather based on season, climate and probabilities.
     */
    updateAutomaticWeather() {

        // TODO: Get climate from map metadata
        const climate = this._climate || "temperate"; 
        const season = $dataTimeSystem.seasons_global[$gameDate.getSeasonIndex()].toLowerCase();
        
        const weatherProbabilities = $dataWeather.climates[climate]?.[season];
        if (!weatherProbabilities) {
            $dabugTool.warn(`SimCraft Weather: No weather data for climate "${climate}" in season "${season}".`);
            this.change("clear", 0, 120);
            return;
        }

        const newType = this.getWeightedRandom(weatherProbabilities);
        const config = SC.weather.config[newType];
        
        if (newType !== this._type) {
            const intensity = config.defaultIntensity || 0;
            // Use a long duration for natural weather changes
            this.change(newType, intensity, 600); 
        }
    }
    
    /**
     * Selects a weather type from a weighted list.
     * @param {[{type: string, weight: number}]} list 
     */
    getWeightedRandom(list) {
        const totalWeight = list.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;

        for (const item of list) {
            if (random < item.weight) {
                return item.type;
            }
            random -= item.weight;
        }
        // Fallback to the last item
        return list[list.length - 1].type;
    }
}

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_Game_Weather",
    icon                : "🌦️",
    version             : "1.0.0",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader", "SC_Game_Date", "SC_WeatherConfig"],
    loadDataFiles       : [ { instName: '$dataWeather', filename: 'Weather.json' } ],
    createObj           : { autoCreate: true, classProto: Game_Weather, instName: '$gameWeather' },
    autoSave            : true
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
