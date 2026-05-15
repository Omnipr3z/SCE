class ActorsDialsManager {
    constructor(){
        this._data = [];
    }
    actor(actorId){
        if(!this._data[actorId]){
            const data = {actorId:actorId};
            this._data[actorId] = new ActorDialsManager(data);
        }

        return this._data[actorId];
    }
    makeSavefileData() {
        return this._data;
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorsDialsManager",
    version: "1.0.0",
    icon: "👨‍💼",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_ActorMainManager", "SC_ActorDialsManager"],
    createObj: {
        autoCreate: true,
        classProto: ActorsDialsManager,
        instName: "$actorsDialsManager"
    },
    autoSave: false
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);