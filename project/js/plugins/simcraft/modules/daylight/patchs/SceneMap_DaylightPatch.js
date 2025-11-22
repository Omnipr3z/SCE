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
 * @plugindesc !SC [v1.0.0] Patch pour Scene_Map pour intégrer Game_DayLight.
 * @author By '0mnipr3z' ©2025 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help SceneMap_DaylightPatch.js
 * 
 * Ce patch modifie Scene_Map pour appeler les méthodes de $gameDayLight
 * aux moments appropriés du cycle de vie de la scène.
 * 
 * ▸ Modifications :
 *   - `Scene_Map.prototype.onMapLoaded`: Initialise le système de lumière du jour.
 *   - `Scene_Map.prototype.update`: Met à jour la teinte de l'écran à chaque frame.
 * 
 * ▸ Nécessite :
 *   - SC_Game_DayLight
 *
 * ▸ Historique :
 *   v1.0.0 - 2025-11-22 : Version initiale.
 */

(function() {
    'use strict';

    //=============================================================================
    // Scene_Map
    //=============================================================================

    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        if ($gameDayLight) {
            $gameDayLight.initializeForMap();
        }
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if ($gameDayLight) {
            $gameDayLight.update();
        }
    };

})();

SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_SceneMap_DaylightPatch",
    icon: "🔌",
    version: "1.0.0",
    author: "0mnipr3z",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["SC_Game_DayLight"],
    loadDataFiles: [],
    createObj: { autoCreate: false },
    autoSave: false
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
