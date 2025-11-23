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
 * @plugindesc !SC [v1.0.0] Container global des instances de Game_Plantation.
 * @author SimCraft
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * 
 * @historique
 * 
 */

class Game_Plantations {
    constructor() {
        this._spots = {};
        this._updateBuckets = [];
        this._currentBucketIndex = 0;
    }
    spot(mapId, eventId){
        if(!this._spots[mapId]){
            this._spots[mapId] = {};
        }
        if(!this._spots[mapId][eventId]){
            if($dataPlantationSpots[mapId] && $dataPlantationSpots[mapId][eventId]){
                this._spots[mapId][eventId] = new Game_Plantation(mapId, eventId, $dataPlantationSpots[mapId][eventId]);
            }
        }
        return this._spots[mapId][eventId];
    }
    update() {
        if (!this._updateBuckets || this._updateBuckets.length === 0) {
            this.createBuckets();
        }

        const bucket = this._updateBuckets[this._currentBucketIndex];
        if (bucket) {
            for (const plantation of bucket) {
                this.spot(plantation.mapId, plantation.eventId).update();
            }
        }

        this._currentBucketIndex = (this._currentBucketIndex + 1) % this._updateBuckets.length;
    };
    createBuckets() {
        this._updateBuckets = [];
        for (const mapId in this._spots){
            let index = 0;
            for (const eventId in this._spots[mapId]) {
                const plantation = this.spot(mapId, eventId);
                if (plantation.needUpdate()) {
                    if (!this._updateBuckets[index]) {
                        this._updateBuckets[index] = [];
                    }
                    this._updateBuckets[index].push({mapId: plantation._mapId, eventId: plantation.eventId});
                    index = (index + 1)  % 30;
                }
            }
        }
    }
    
}
// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Game_Plantations",
    version: "1.0.0",
    icon: "🌳",
    author: "0mnipr3z",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["SC_SystemLoader", "SC_Game_Plantation"],
    loadDataFiles: [
        {filename:"PlantationSpots", instName:"$dataPlantationSpots"},
        {filename:"PlantSpecies", instName:"$dataPlantSpecies"}
    ],
    createObj: {
        autoCreate: true,
        classProto: Game_Plantations,
        instName: "$gamePlantations"
    },
    autosave: true
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);