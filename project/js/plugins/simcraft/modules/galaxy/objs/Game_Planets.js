class Game_Planet{
    constructor(data, id){
        this._id = id;
        this._dbId = data.id;
        this._type = data.type || "planet";
        this._name = data.name;
        this._x = data.x;
        this._y = data.y;
        this._zoom = data.zoom;
        this._bitmapName = data.bitmapName;
        this._moves = data.moves;
        this._orbitAngle = 0;
        this._active = false;
    }
    get orbitAngle(){
        return this._orbitAngle;
    }
    set orbitAngle(value){
        this._orbitAngle = value % (Math.PI * 2);
    }
    get active(){
        return this._active
    }
    activate(){
        this._active = true;
    }
    deactivate(){
        this._active = false;
    }
    get id(){
        return this._id;
    }
    get name(){
        return this._name;
    }
    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }
    get zoom(){
        return this._zoom;
    }
    get bitmapName(){
        return this._bitmapName;
    }
    get moves(){
        return this._moves;
    }

};
class Game_PlanetarySystem{
    constructor(data){
        this._data = [];
        this._name = data.name || "unommed system";
        this._position = {
            x: data.pos.x || 0,
            y: data.pos.y || 0
        };
        this._id = data.id;
    }
    get position(){
        return this._position;
    }
    planets(){
        if(this._data.length != $dataPlanetarySystems[this._id].planetIds.length){
            $dataPlanetarySystems[this._id].planetIds.forEach((id, index) => {
                this._data[index] = new Game_Planet($dataPlanets[id], index);
            })
        }
        return this._data;
    }
    planet(id){
        if(! this._data[id]){
            const planetId  = $dataPlanetarySystems[this._id].planetIds[id];
            if(!planetId || !$dataPlanets[planetId]){
                throw new Error("Planet Data not found: " + planetId);
            }else{
                this._data[id] = new Game_Planet($dataPlanets[planetId], id);
            }
        }
        return this._data[id];
    }
    get name(){
        return this._name;
    }
    get id(){
        return this._id;
    }
    load(data){
        data.planetIds.forEach((id, index) => {
            this._data[index] = new Game_PlanetarySystem($dataPlanetarySystems[id], index);
        })
    }
};
class Game_Sector{
    constructor(){
        this._data = [];
        this._current = 0;
    }
    system(systemId){
        if(!this._data[systemId]){
            if($dataPlanetarySystems[systemId]){
                this._data[systemId] = new Game_PlanetarySystem($dataPlanetarySystems[systemId])
            }else{
                throw new Error("Planetary system Data not found: " + systemId);
            }
        }
        return this._data[systemId];
    }
    currentSystem(){
        return this.system(this._current);
    }
}

    
const $gameSector = new Game_Sector();