/**
 * ╔════════════════════════════════════════╗
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v1.0.0] Patch pour intégrer le gestionnaire d'activités à Scene_Map.
 * @author SimCraft
 * @base SC_SystemLoader
 * @base SC_ActorsActivitiesManagers
 * @orderAfter SC_ActorsActivitiesManagers
 *
 * @help
 * Scene_Map_ActivityPatch.js
 * 
 * Ce patch s'assure que le gestionnaire global d'activités ($actorsActivitiesManagers)
 * est mis à jour à chaque frame de la carte.
 */

(() => {
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this._activityTimer = this._activityTimer ||0;
        if ($actorsActivitiesManagers && this._activityTimer == 0) {
            $actorsActivitiesManagers.update();
            this._activityTimer = $gameVariables.value(TIME_TICK_VAR)*60; // Mise à jour toutes les secondes
        }else{
            this._activityTimer = (this._activityTimer +1) %60;
        }
    };
})();

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Scene_Map_ActivityPatch",
    version: "1.0.0",
    icon: "⚙️",
    author: "SimCraft",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["SC_SystemLoader", "SC_ActorsActivitiesManagers"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);