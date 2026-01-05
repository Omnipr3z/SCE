class Game_Spaceship {
    constructor(data) {
        this._id                = data.id;
        this._name              = data.name; this._shipClass = data.shipClass;
        this._x                 = data.x;
        this._y                 = data.y;
        this._targetX           = data.x;
        this._targetY           = data.y;
        this._bitmapName        = data.bitmapName;
        this._orbitingPlanetId  = null;
        this._captainId         = data.captainId;
        this._category          = data.category;
        this._capacity          = data.capacity;
        this._faction           = data.faction;
        this._status            = "static";
        this._tmpSpeed          = 0;
        this._motorId           = data.motorId;
    }

    get motor() {               return $dataShipMotors[this._motorId]; }
    get fuel() {                if(!this._fuel) this._fuel = this.motor.capacity; return this._fuel; }
    get id() {                  return this._id; }
    get name() {                return this._name; }
    get x() {                   return this._x; }
    get y() {                   return this._y; }
    get targetX() {             return this._targetX; }
    get targetY() {             return this._targetY; }
    get bitmapName() {          return this._bitmapName; }
    get orbitingPlanetId() {    return this._orbitingPlanetId; }
    get speed() {
        let buff = 1;
        if(this.isHyperdrive()) buff = this.motor.hyperdrive.buffRate || 1.1;
        if(this.motor.capacity == -1 || this.fuel > 0) return this.motor.speed * buff;
        else return 0.1;

    }
    get shipClass() {           return this._shipClass; }
    get captainId() {           return this._captainId; }
    get captain() {             return $gameActors.actor(this.captainId)}
    get category() {            return this._category; }
    get capacity() {            return this._capacity; }
    get faction() {             return this._faction; }; 
    get orbitingPlanet() {      return $gameSector.currentSystem().planet(this.orbitingPlanetId); }
    get status() {              return this._status; }
    get positionTxt() {
        return `${Math.round(this.x)}.${Math.round(this.y)}`;
    }
    get statusTxt () {
        switch(this.status){
            case "Static":      return "Static";
            case "Orbiting":    return `Orbiting ${this.orbitingPlanet.name}`;
            case "MoveToOrbit": return `Moving to ${this.orbitingPlanet.name}`;
            case "MoveToDest":  return `Move to ${this.targetX}-${this.targetY}`;
            default:            return `Undefined`;
        }
    }
    get speedTxt() {
        let hdTxt = "";
        if(this.isHyperdrive())hdTxt = "(Hyperdrive) ";

        
        
        if(!this.isMoving() && this._tmpSpeed != 0)
                this._tmpSpeed = this._tmpSpeed.approach(0, 0.04);
        else if(this.isMoving() && this.speed != this._tmpSpeed)
                this._tmpSpeed = this._tmpSpeed.approach(this.speed, 0.01);

        

        return `${hdTxt}${Math.round(this._tmpSpeed * 100)} u/s`;
    }

    set x(value) { this._x = value; }
    set y(value) { this._y = value; }
    set status(value) {
        this._status = value;
    }
    isMoving(){
        return this.status != "Orbiting" && this.status != "Static";
    }
    isHyperdrive() {
        return this.motor.hyperdrive? this._driveActive : false;
    }
    activeHyperdrive(){
        this._driveActive = true;
    }
    deactivateHyperdrive(){
        this._driveActive = false;
    }
    update() {
    }
    setTarget(x, y) {
        this.clearOrbit();
        this._targetX = x;
        this._targetY = y;
        this.status = "MoveToDest";
    }

    setOrbitingPlanet(planetId) {
        this._orbitingPlanetId = planetId;
        this.status = "MoveToOrbit";
    }

    clearOrbit() {
        this._orbitingPlanetId = null;
    }

    consumeFuel(amount) {
        
        if(this.isHyperdrive()) amount *= this.motor.hyperdrive.consumeRate;
        this._fuel -= amount;

    }
    canActivateHyperdrive() {
        return true;
    }
}

class Game_Spaceships {
    constructor(data) {
        this._data = [];
        this.load(data);
    }

    spaceships() {
        return this._data;
    }
    actorShip(actorId){
        return this._data.find(ship => ship.captainId == actorId);
    }
    playerShip(){
        return this.actorShip($gameParty.leader().actorId())
    }
    ship(shipId) {
        return this._data[shipId];  
    }
    load(data) {
        data.forEach((spaceship, index) => {
            this._data[index] = new Game_Spaceship(spaceship);
        });
    }
}

const $gameSpaceships = new Game_Spaceships($dataSpaceships);