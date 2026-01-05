

class Scene_SpaceTravel extends Scene_Base {
    constructor() {
        super();
        this._state = 'INITIAL';
        this._timer = 0;
        this.SHIP_SPEED = 0.3; // Vitesse de déplacement du vaisseau
        this._infoWindow = null;
        $gameDate.setScrollSpeedMode(4);
        this._selectedPlanet = -1;
    }
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
    rightPannelRect(){
        return new Rectangle(1280, 0, Graphics.boxWidth - 1280, 720);
    }
    isBusy(){
        return false;
    }
    loadSpaceshipBitmap(filename){
        return ImageManager.loadBitmap("img/GUI/ship/", filename);
    }
    create() {
        super.create();
        this.createBackground();
        this.createSprites();
        this.createLayout();
        this.createWindowLayer();
    }
    createWindowLayer() {
        super.createWindowLayer();
        this.createHuds();
    }
    createHuds() {
        this.createInfoWindow();
        this.createEventWindow();
        this.createMessageWindow();
        this.createCalendarWindow();
        this.createCmdWindow();
        this.createSectorWindow();
    }
    createCmdWindow()  {
        const rect = new Rectangle(1280, 720, this._infoWindow.width, this._eventWindow.height);
        this._cmdWindow = new Window_Cmd(rect);
        this.addWindow(this._cmdWindow);
    } 
    createCalendarWindow() {
        const rect = new Rectangle(0, 0, 1200, 80);
        this._calendarWindow = new Window_Calendar(rect);
        this.addWindow(this._calendarWindow);
    }
    createMessageWindow() {
        const x = this._eventWindow.width,
                y = 720,
                w = Graphics.boxWidth - this._eventWindow.width - this._infoWindow.width,
                h = this._eventWindow.height;

        const rect = new Rectangle(x, y, w, h);

        this._dialWindow = new Window_Dial(rect);
        this.addWindow(this._dialWindow);
    }
    createInfoWindow() {
        const rect = this.rightPannelRect();

        this._infoWindow = new Window_ShipInfo(rect);
        this._infoWindow.setShip(this.spaceships[0]);
        this.addWindow(this._infoWindow);
    }
    createSectorWindow(){
        const rect = this.rightPannelRect();

        this._sectorWindow = new Window_SectorInfos(rect);
        this.addWindow(this._sectorWindow);
    }
    createEventWindow() {
        const rect = new Rectangle(0, 720, 500, Graphics.boxHeight - 720);

        this._eventWindow = new Window_EventInfo(rect);
        this.addWindow(this._eventWindow);
    }
    createLayout(){
        this._layoutSprite = new Sprite();
        this._layoutSprite.bitmap = this.loadSpaceshipBitmap("travelScreenLayout");
        this._layoutSprite.opacity = 180;
        this.addChild(this._layoutSprite);

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
    }
    createSprites() {
        this.createPlanets();
        this.createAlerts();
        this.createSpaceships();
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


    update() {
        super.update();
        if(!this.isBusy()){
            this.updateInput();
            this.updateTimer();
            this.updatePlanets();
            this.updateAlerts();
            this.updateSpaceships();
            this.updateCalendar();
            this._eventWindow.refresh();
            this._calendarWindow.refresh();
            this._dialWindow.setPlanet(this._selectedPlanet);
            this._dialWindow.refresh();
            this._sectorWindow.refresh();

        }
    }

    updateInput() {
        const ship = this.playerSpaceship;
        if (!ship) return;
        if (TouchInput.isTriggered()) {

            let planetClicked = false;
            // Itérer en sens inverse pour vérifier les sprites du dessus en premier
            for (let i = this._planetSprites.length - 1; i >= 0; i--) {

                const planetSprite = this._planetSprites[i];
                const planetData = this.planets[i];
                
                // Vérification simple de la boîte de délimitation
                const x = planetSprite.x - (planetSprite.width * planetSprite.anchor.x * planetSprite.scale.x);
                const y = planetSprite.y - (planetSprite.height * planetSprite.anchor.y * planetSprite.scale.y);
                const rect = new Rectangle(x, y, planetSprite.width * planetSprite.scale.x, planetSprite.height * planetSprite.scale.y);

                if (rect.contains(TouchInput.x, TouchInput.y)) {
                    if(this._selectedPlanet == i){
                        if(ship.orbitPlanetId != i && ship){
                            this._eventWindow.addNews({style:'basicInfos', txt:`The ${ship.name} going to ${planetData.name}.`});
                            ship.setOrbitingPlanet(i);
                        }
                    }else{
                        this._selectedPlanet = i;
                    }
                    
                    planetClicked = true;
                    break; // Arrêter après avoir trouvé la première planète
                }
            }

            if (!planetClicked && TouchInput.x >= 0 && TouchInput.x <= 1280 && TouchInput.y >= 0 && TouchInput.y <= 720   ) {
                    this._selectedPlanet = -1;
                    if(ship.targetX != TouchInput.x || ship.targetY != TouchInput.y){
                        //this._eventWindow.addNews({style:'basicInfos', txt:`The ${ship.name} has new target location: ${TouchInput.x}-${TouchInput.y}`});
                        ship.setTarget(TouchInput.x, TouchInput.y);
                    }
            }
        }
        
        if(Input.isLongPressed("shift") || TouchInput.isLongPressed()){
            if(!ship.isHyperdrive() && ship.canActivateHyperdrive())
                ship.activeHyperdrive();
        }else if(ship.isHyperdrive())
            ship.deactivateHyperdrive();

        if(Input.isTriggered('quit'))
            SceneManager.pop();
    }
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
            sprite.x = alert.pos.x;
            sprite.y = alert.pos.y;
            break;
            default:
                break;
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
                            sprite.x = move.centerX + Math.cos(rad) * move.radiusX;
                            sprite.y = move.centerY + Math.sin(rad) * move.radiusY;
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

                });
            }
        });
    }
    updateSpaceships() {
        this._spaceshipSprites.forEach((sprite, index) => {
            const ship = this.spaceships[index];
            if (ship) {
                const oldX = ship.x;
                const orbitingId = ship.orbitingPlanetId;
                const SHIP_SPEED = ship.speed /8 * $gameDate.getScrollSpeedMode();
                if (orbitingId !== null) {
                    // Logique d'orbite
                    const planetSprite = this._planetSprites[orbitingId];
                    if (planetSprite) {
                        const dx = ship.x - planetSprite.x;
                        const dy = ship.y - planetSprite.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance > SHIP_SPEED) {
                            // Approche de la planète
                            ship.consumeFuel(0.01); 
                            ship.x = ship.x.approach(planetSprite.x, SHIP_SPEED);
                            ship.y = ship.y.approach(planetSprite.y, SHIP_SPEED);
                            
                        } else {
                            // Arrivé : se verrouille sur la position de la planète
                            ship.x = planetSprite.x;
                            ship.y = planetSprite.y;
                            if(ship.status != "Orbiting")
                                this._eventWindow.addNews({style:'infos', txt:`The ${ship.name} approaching ${$gameSector.currentSystem().planet(orbitingId).name} orbit.`});
                            ship.status = "Orbiting";
                        }
                    }
                } else if(ship.x != ship.targetX || ship.y != ship.targetY){
                    
                    ship.consumeFuel(0.01);
                    // Logique de mouvement libre
                    ship.x = ship.x.approach(ship.targetX, SHIP_SPEED);
                    ship.y = ship.y.approach(ship.targetY, SHIP_SPEED);
                }else if(ship.status != "Static"){
                    this._eventWindow.addNews({style:'infos', txt:`The ${ship.name} reached the target position.`});
                    ship.status = "Static";
                }
                
                // Met à jour la position du sprite
                sprite.x = ship.x;
                sprite.y = ship.y;

                // Flip sprite based on direction
                if (ship.x > oldX) { // Moving right
                    sprite.scale.x = -Math.abs(sprite.scale.x);
                } else if (ship.x < oldX) { // Moving left
                    sprite.scale.x = Math.abs(sprite.scale.x);
                }
            }
            if(Math.abs(sprite.scale.x) !=  0.2){
                const newScale = Math.abs(sprite.scale.x).approach( 0.03, 0.002);
                const direction = sprite.scale.x >= 0 ? 1 : -1;
                sprite.scale.x = newScale * direction;
                sprite.scale.y = newScale;
            }
        });
    }
    updateTimer() {
        this._timer++;
        if(this._timer > 100){ // Après 5 secondes, retour à la console
            this._timer = 1;
            $storyManager.update();
        }
        
    }
    updateCalendar(){
        $gameDate.passTick()
    }

};

