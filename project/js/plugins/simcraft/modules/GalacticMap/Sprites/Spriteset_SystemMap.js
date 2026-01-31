class SpriteSystemMap extends Sprite {
    get planets(){
        return $gameSector.currentSystem().planets();
    }
    get alerts(){
        return $gameQuests.alerts();
    }
    get spaceships(){
        return $gameSpaceships.spaceships();
    }
    get playerSpaceship(){
        return $gameSpaceships.playerShip();
    }

    isBusy(){
        return false;
    }
    loadSpaceshipBitmap(filename){
        return ImageManager.loadBitmap("img/GUI/ship/", filename);
    }
    bottomPannelHeight(){
        return 720 / 3;
    }
    gridCaseWidth(){
        return 1280 / 4; 
    }
    rightPannelRect(){
        const w = this.gridCaseWidth();
        const h = 1280 - this.bottomPannelHeight();
        const x = 1280 - w;
        const y = 0;
        return new Rectangle(x, y, w, h);
    }
    getMapDistance(ship, planetSprite) {
        const dx = ship.x - planetSprite.x + this._mapOffsetX;
        const dy = ship.y - planetSprite.y + this._mapOffsetY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance;
    }

    // CREATE
    create() {
        super.create();
        this.createBackground();
        this.createSprites();
        this.createLayout();
    }
    createBackground(){
        this._bgSprite = new Sprite();
        this._bgSprite.bitmap = this.loadSpaceshipBitmap("travelScreenBg");
        this._bgSprite.opacity = 255;
        this.addChild(this._bgSprite);

        this._bg2Sprite = new Sprite();
        this._bg2Sprite.bitmap = this.loadSpaceshipBitmap("space");
        this._bg2Sprite.opacity = 180;
        this.addChild(this._bg2Sprite);

        this._boxWidth = this._bgSprite.bitmap.width;
        this._boxHeight = this._bgSprite.bitmap.height;
    }
    createSprites() {
        this.createPlanets();
        this.createAlerts();
        this.createSpaceships();
    }
    createPlanets(){
        this._planetSprites = [];
        this.planets.forEach((planet, index) => {
            const bitmap = this.loadSpaceshipBitmap(planet.bitmapName);
            
            this._planetSprites[index] = new Sprite();
            this._planetSprites[index].anchor.x = 0.5;
            this._planetSprites[index].anchor.y = 0.5;
            this._planetSprites[index].bitmap = bitmap;
            this._planetSprites[index].opacity = 255;
            this._planetSprites[index].x = planet.x;
            this._planetSprites[index].y = planet.y;
            this._planetSprites[index].scale.x = planet.zoom || 1;
            this._planetSprites[index].scale.y = planet.zoom || 1;
            this._planetSprites[index].zoomOriginal = planet.zoom || 1;

            this.addChild(this._planetSprites[index]);
        });
    }
    createAlerts(){
        this._alertSprites = [];
        this.alerts.forEach((icon, index)=>{
            const bitmap = this.loadSpaceshipBitmap(icon.iconName);
            this._alertSprites[index] = new Sprite();
            this._alertSprites[index].bitmap = bitmap;
            this._alertSprites[index].opacity = 0;
            this._alertSprites[index].x = -100;
            this._alertSprites[index].y = -100;
            this._alertSprites[index].anchor.x = 0.5;
            this._alertSprites[index].anchor.y = 0.5
            this.addChild(this._alertSprites[index]);
        })
    }
    createSpaceships() {
        this._spaceshipSprites = [];
        this.spaceships.forEach((ship, index) => {
            const bitmap = this.loadSpaceshipBitmap(ship.bitmapName);

            this._spaceshipSprites[index]           = new Sprite();
            this._spaceshipSprites[index].bitmap    = bitmap;
            this._spaceshipSprites[index].x         = ship.x;
            this._spaceshipSprites[index].y         = ship.y;
            this._spaceshipSprites[index].anchor.x  = 0.5;
            this._spaceshipSprites[index].anchor.y  = 0.5;
            this._spaceshipSprites[index].scale.x   = 0.001;
            this._spaceshipSprites[index].scale.y   = 0.001;

            this.addChild(this._spaceshipSprites[index]);
        });
    }
    createLayout(){
        this._layoutSprite = new Sprite();
        this._layoutSprite.bitmap = this.loadSpaceshipBitmap("travelScreenLayout");
        this._layoutSprite.opacity = 180;
        this.addChild(this._layoutSprite);

    }


    //UPDATE
    update() {
        super.update();
        if(!this.isBusy()){
            this.updateMapOffset();
            this.updatePlanets();
            this.updateAlerts();
            this.updateSpaceships();
        }
    }
    updateMapOffset(){
        if(this.playerSpaceship){
            const ship = this.playerSpaceship;
            let targetOffsetY = 0;
            let targetOffsetX = 0;

                if(ship.x > (this.gridCaseWidth() * 3)/2){
                    targetOffsetX = Math.max(
                        -this.gridCaseWidth() /2,
                        - ship.x /2
                    );
                }
            }

            const middleHeight = (Graphics._height - this.bottomPannelHeight())/2;

            if(ship.y > middleHeight){
                targetOffsetY = Math.max(
                    -(this.bottomPannelHeight()/2),
                    middleHeight - ship.y
                );

            }
            if(targetOffsetX != this._mapOffsetX || targetOffsetY != this._mapOffsetY){
                this._targetOffsetX = targetOffsetX;
                this._targetOffsetY = targetOffsetY;

                this._mapOffsetX = this._mapOffsetX.approach(targetOffsetX, 1);
                this._mapOffsetY = this._mapOffsetY.approach(targetOffsetY, 1);

                this._bgSprite.x =      this._mapOffsetX;
                this._bgSprite.y =      this._mapOffsetY;

                this._bg2Sprite.x =     this._mapOffsetX;
                this._bg2Sprite.y =     this._mapOffsetY;

                this._layoutSprite.x =  this._mapOffsetX;
                this._layoutSprite.y =  this._mapOffsetY;
            }
        }
    }
    updatePlanets() {
        this._planetSprites.forEach((sprite, index) => {
            const planet = this.planets[index];
            if(planet.moves instanceof Array){
                planet.moves.forEach(move => {
                    switch(move.type) {
                        case   "rotation":
                            sprite.rotation = (sprite.rotation + move.value  * $gameDate.getScrollSpeedMode()) % (Math.PI * 2);
                            break;
                        case   "scale":
                            if(!sprite.scaleDir && sprite.scale.x < move.value){
                                sprite.scale.x += move.speed || 0.01;
                                sprite.scale.y += move.speed || 0.01;
                                if(sprite.scale.x > move.value){
                                    sprite.scaleDir = true; // Inverse la direction
                                }
                            }else if(sprite.scale.x > sprite.zoomOriginal){
                                sprite.scale.x -= move.speed || 0.01;
                                sprite.scale.y -= move.speed || 0.01;
                            }else if(sprite.scale.x <= sprite.zoomOriginal){
                                    sprite.scaleDir = false; // Inverse la direction
                            }
                            break;
                        case   "opacity":
                            if(!sprite.opacityFadeOut && sprite.opacity <= move.max){
                                sprite.opacity += move.speed || 1;
                                if(sprite.opacity >=  move.max){
                                    sprite.opacityFadeOut = true; // Inverse la direction
                                }
                            }else if(sprite.opacity > move.min){
                                sprite.opacity -= move.speed || 1;
                            }else if(sprite.opacity <= move.min){
                                    sprite.opacityFadeOut = false; // Inverse la direction
                            }
                            break;
                        case "orbit":
                            if(!sprite.orbitAngle)
                                sprite.orbitAngle = planet.active? planet.orbitAngle: (Math.random() * Math.PI * 2);
                            sprite.orbitAngle = (sprite.orbitAngle + (move.speed || 0.01) * $gameDate.getScrollSpeedMode()) % (Math.PI * 2);
                            const rad = sprite.orbitAngle;
                            sprite.x = move.centerX + Math.cos(rad) * move.radiusX + this._mapOffsetX;
                            sprite.y = move.centerY + Math.sin(rad) * move.radiusY + this._mapOffsetY;
                            planet.orbitAngle = sprite.orbitAngle;
                            planet.activate();
                            break;
                        case "scaleOnY":
                            const change = (move.value - sprite.zoomOriginal) * (sprite.y /720);

                            sprite.scale.y = sprite.zoomOriginal + change;
                            sprite.scale.x = sprite.zoomOriginal + change;
                            break;
                        default:
                            break;
                    }
                    if(move.type != "orbit"){
                        sprite.x = planet.x + this._mapOffsetX;
                        sprite.y = planet.y + this._mapOffsetY;
                    }

                });
            }
        });
    }

    // update alert
    updateAlerts(){
        this._alertSprites.forEach((sprite, index) => {
            const alert = this.alerts[index];
            if(alert.active){
                this.updateAlertsPos(sprite, alert);
                this.updateAlertBlink(sprite);
                this.updateAlertScale(sprite);
            }else{
                sprite.opacity = 0;
                sprite.scale.x = 1;
                sprite.scale.y = 1;
            }
        })
    }
    updateAlertBlink(sprite){
        sprite.opacity = this.__timer * 1,6;
    }
    updateAlertScale(sprite){
        const scale = this._timer / 500 + .2;
        sprite.scale.x = scale;
        sprite.scale.y = scale;
    }
    updateAlertsPos(sprite, alert){
        switch(alert.pos.type){
            case "follow":
            const planet = this._planetSprites[alert.pos.planetId];
            sprite.x = planet.x;
            sprite.y = planet.y;
            break;
            case "static":
            sprite.x = alert.pos.x + this._mapOffsetX;
            sprite.y = alert.pos.y + this._mapOffsetY;
            break;
            default:
                break;
        }
    }

    //update spaceships
    updateSpaceships() {
        this._spaceshipSprites.forEach((sprite, index) => {
            const ship = this.spaceships[index];
            if (ship) {
                const oldX = ship.x;
                const orbitingId = ship.orbitingPlanetId;
                const speed = ship.speed /8 * $gameDate.getScrollSpeedMode();

                // Déplacement vers la planète en orbite
                if (orbitingId !== null) {
                    const planet = this.planets[orbitingId];
                    this.updateSpaceshipOrbiting(ship, planetData, speed);

                // Déplacement vers la cible
                } else if(ship.x != ship.targetX || ship.y != ship.targetY){
                    this.moveShipToTarget(ship, speed);

                // Statique
                }else if(ship.status != "Static"){
                    this.logArrivedTo(ship);
                    ship.status = "Static";
                }
                
                this.updateSpaceshipSprite(sprite, ship, oldX);
            }
            this.updateSpaceshipScale(sprite);
        });
    }
    updateSpaceshipOrbiting(ship, planet, speed) {
        if (planet) {
            const distance = this.getMapDistance(ship, planet);
            
            if (distance > speed) {
                this.approachPlanet(ship, planet, speed);
            } else {
                this.shipStaticOrbit(ship, planet);
            }
        }
    }
    approachPlanet(ship, planet, speed) {
        // Approche de la planète
        ship.consumeFuel(0.01); 
        ship.x = ship.x.approach(planet.x + this._mapOffsetX, speed);
        ship.y = ship.y.approach(planet.y + this._mapOffsetY, speed);
    }
    shipStaticOrbit(ship, planet) {
        // Arrivé : se verrouille sur la position de la planète
        ship.x = planet.x;
        ship.y = planet.y;
        
        if(ship.status != "Orbiting")
            this.logEnterOrbit(ship.name, this.planets[ship.orbitingPlanetId].name);

        ship.status = "Orbiting";
    }
    moveShipToTarget(ship, speed) {
        ship.consumeFuel(0.01);
        ship.x = ship.x.approach(ship.targetX, speed);
        ship.y = ship.y.approach(ship.targetY, speed);
    }
    updateSpaceshipScale(sprite) {
        if(Math.abs(sprite.scale.x) !=  0.2){
            const newScale = Math.abs(sprite.scale.x).approach( 0.03, 0.002);
            const direction = sprite.scale.x >= 0 ? 1 : -1;
            sprite.scale.x = newScale * direction;
            sprite.scale.y = newScale;
        }
    }
    updateSpaceshipSprite(sprite, ship, oldX) {
        // Met à jour la position du sprite
        sprite.x = ship.x + this._mapOffsetX;
        sprite.y = ship.y + this._mapOffsetY;

        // Flip sprite based on direction
        if (ship.x > oldX) { // Moving right
            sprite.scale.x = -Math.abs(sprite.scale.x);
        } else if (ship.x < oldX) { // Moving left
            sprite.scale.x = Math.abs(sprite.scale.x);
        }
    }
};