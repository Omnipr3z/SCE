

class Scene_SpaceTravel extends Scene_Base {
    constructor() {
        super();
        this._state = 'INITIAL';
        this._timer = 0;
        this.SHIP_SPEED = 0.3; // Vitesse de déplacement du vaisseau
        this._infoWindow = null;
        this._oldScrollSpeedMode = $gameDate.getScrollSpeedMode();
        $gameDate.setScrollSpeedMode(4);
        this._selectedPlanet = -1;
        this._mapOffsetX = 0;
        this._mapOffsetY = 0;
        this._rightPannelActive = "shipInfos";
    
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
    //UTILS
    //getters context
    isBusy(){
        return false;
    }
    //getters positionning
    bottomPannelHeight(){
        return 720 / 3;
    }
    gridCaseWidth(){
        return 1280 / 4; 
    }

    rateW(){ return Graphics._width /1280};
    rateH(){ return Graphics._height /720};
    
    bottomPanelRealSize(){
        return  this.bottomPannelHeight() * this.rateH();
    }
    rightPanelRealSize (){
        return this.gridCaseWidth() * this.rateW();
    }
    isOnMapArea(x, y) {
        const coldZone = 4;
        return x > coldZone
            && x <= 1280 - coldZone
            && y > coldZone
            && y <= Graphics._height - this.bottomPanelRealSize()  - coldZone;
    }
    rightPannelRect(){
        const w = this.gridCaseWidth();
        const h = 1280 - this.bottomPannelHeight();
        const x = 1280 - w;
        const y = 0;
        return new Rectangle(x, y, w, h);
    }
    eventWindowRect(){
        const w = this.gridCaseWidth();
        const h = this.bottomPannelHeight();
        const x = 0;
        const y = 720 - h;
        
        return new Rectangle(x, y, w, h);
    }
    messageWindowRect(){
        const w = this.gridCaseWidth() * 2;
        const h = this.bottomPannelHeight();
        const x = this.gridCaseWidth();
        const y = 720 - h;
        
        return new Rectangle(x, y, w, h);
    }
    cmdWindowRect() {
        const w = this.gridCaseWidth();
        const h = this.bottomPannelHeight();

        const x = this.gridCaseWidth() * 3;
        const y = 720 - h;

        return new Rectangle(x, y, w, h);
    }
    //logs
    log(style, info){
        this._eventWindow.addNews({style: style, txt: info});
    }
    logMove(shipName, x, y){
        this.log('basicInfos', `The ${shipName} has new target location: ${x}-${y}`);
    }
    logEnterOrbit(shipName, planetName){
        this.log('basicInfos', `The ${shipName} is entering orbit around ${planetName}.`);
    }
    logArrivedTo(ship){
        this.log('infos', `The ${ship.name} reached the target position.`);
    }
    //positionning System Map
    getMapDistance(ship, target) {
        const dx = ship.x - target.x;
        const dy = ship.y - target.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance;
    }
    //others
    loadSpaceshipBitmap(filename){
        return ImageManager.loadBitmap("img/GUI/ship/", filename);
    }
    
    //CREATE
    create() {
        super.create();
        this.createBackground();
        this.createSprites();
        this.createLayout();
        this.createWindowLayer();
    }

    // Create System Map Sprites
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
    createLayout(){
        this._layoutSprite = new Sprite();
        this._layoutSprite.bitmap = this.loadSpaceshipBitmap("travelScreenLayout");
        this._layoutSprite.opacity = 180;
        this.addChild(this._layoutSprite);

    }
    
    // WINDOWS
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
    //Info Window - Fenetre des infos du vaisseau
    createInfoWindow() {
        const rect = this.rightPannelRect();

        this._infoWindow = new Window_ShipInfo(rect);
        this._infoWindow.setShip(this.spaceships[0]);
        this.addWindow(this._infoWindow);
    }
    //Event Window - Fenetre du log des evenements
    createEventWindow() {
        const rect = this.eventWindowRect();

        this._eventWindow = new Window_EventInfo(rect);
        this.addWindow(this._eventWindow);
    }
    //Message Window - Fenetre des du contenu actif
    createMessageWindow() {;
        const rect = this.messageWindowRect();

        this._dialWindow = new Window_Dial(rect);
        this.addWindow(this._dialWindow);
    }
    //CMD Window - Fenetre des commandes contextuelles
    createCmdWindow()  {
        const rect = this.cmdWindowRect();
        this._cmdWindow = new Window_Cmd(rect);
        this.addWindow(this._cmdWindow);
    }
    //Calendar Window
    createCalendarWindow() {
        const rect = new Rectangle(0, 0, this.gridCaseWidth() * 3, 80);
        this._calendarWindow = new Window_Calendar(rect);
        this.addWindow(this._calendarWindow);
    }
    //Sector Window
    createSectorWindow(){
        const rect = this.rightPannelRect();

        this._sectorWindow = new Window_SectorInfos(rect);
        this.addWindow(this._sectorWindow);
    }

    //UPDATE
    update() {
        super.update();
        if(!this.isBusy()){
            this.updateInput();
            this.updateTimer();
            this.updateMapOffset();
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
    //Input
    updateInput() {
        const ship = this.playerSpaceship;
        if (!ship) return;
        if (TouchInput.isTriggered()) {

            let planetClicked = false;
            // Itérer en sens inverse pour vérifier les sprites du dessus en premier
            if(!this.checkPlanetClick(ship)){
                this.checkPlayerTravelClick(ship);
            }
        }
        
        if(Input.isLongPressed("shift") || TouchInput.isLongPressed()){
            if(!ship.isHyperdrive() && ship.canActivateHyperdrive())
                ship.activeHyperdrive();
        }else if(ship.isHyperdrive())
            ship.deactivateHyperdrive();

        if(Input.isTriggered('cancel')){
            
            $gameDate.setScrollSpeedMode(this._oldScrollSpeedMode);
            SceneManager.pop();
        }
    }
    checkPlayerTravelClick(ship){
        if (this.isOnMapArea(TouchInput.x, TouchInput.y)) {
            this._selectedPlanet = -1;
            const mapXTouch = TouchInput.x - this._mapOffsetX;
            const mapYTouch = TouchInput.y - this._mapOffsetY;

            if(ship.targetX  != mapXTouch
                || ship.targetY != mapYTouch){
                this.logMove(ship.name, mapXTouch, mapYTouch);
                ship.setTarget(mapXTouch, mapYTouch);
            }
        }
    }
    checkPlanetClick(ship){
        let planetClicked = false;

        for (let i = this._planetSprites.length - 1; i >= 0; i--) {

                const planetSprite = this._planetSprites[i];
                const planetData = this.planets[i];
                
                // Vérification simple de la boîte de délimitation
                const x = planetSprite.x
                    - (planetSprite.width * planetSprite.anchor.x * planetSprite.scale.x);
                const y = planetSprite.y
                    - (planetSprite.height * planetSprite.anchor.y * planetSprite.scale.y);

                const rect = new Rectangle(
                    x,
                    y,
                    planetSprite.width * planetSprite.scale.x,
                    planetSprite.height * planetSprite.scale.y
                );

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
            return planetClicked;
    }


    // SYSTEM MAP
    updateMapOffset(){
        if(this.playerSpaceship){
            const ship = this.playerSpaceship;
            let targetX = 0;
            let targetY = 0;
            
            targetY = Math.max(
                -ship.y + 310,
                -this.bottomPanelRealSize() + (Graphics._height - 720)
            );

            if (this._rightPannelActive != "none") {
                targetX = Math.max(-ship.x + 640, -this.rightPanelRealSize() + (Graphics._width - 1280));
            }

            targetX = Math.min(targetX, 0);
            targetY = Math.min(targetY, 0);


            if(targetX != this._mapOffsetX || targetY != this._mapOffsetY) {
                this._mapOffsetX = targetX;
                this._mapOffsetY = targetY;
                this.updateSystemMapLayers();
            }
        }
    }
    updateSystemMapLayers(){
        this._bgSprite.x =      this._mapOffsetX;
        this._bgSprite.y =      this._mapOffsetY;

        this._bg2Sprite.x =     this._mapOffsetX;
        this._bg2Sprite.y =     this._mapOffsetY;

        this._layoutSprite.x =  this._mapOffsetX;
        this._layoutSprite.y =  this._mapOffsetY;
    }
    // Met à jour les positions des planètes
    updatePlanets() {
        this._planetSprites.forEach((sprite, index) => {
            const planet = this.planets[index];

            if(planet.moves instanceof Array){
                planet.moves.forEach(move => {
                    switch(move.type) {
                        case "rotation":
                            this.updatePlanetRotation(sprite, move);
                            break;
                        case "scale":
                            this.updatePlanetScale(sprite, move);
                            break;
                        case "opacity":
                            this.updatePlanetOpacity(sprite, move);
                            break;
                        case "orbit":
                            this.updatePlanetOrbit(planet, move);
                            break;
                        case "scaleOnY":
                            this.updatePlanetScaleOnY(sprite, planet, move);
                            break;
                        default:
                            break;
                    }
                });
            }
            sprite.x = planet.x + this._mapOffsetX;
            sprite.y = planet.y + this._mapOffsetY;
        });
    }
    updatePlanetRotation(sprite, move){
        sprite.rotation = (sprite.rotation + move.value 
                * $gameDate.getScrollSpeedMode()
            )
            % (Math.PI * 2);
    }
    updatePlanetScale(sprite, move){
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
    }
    updatePlanetOpacity(sprite, move){
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
    }
    updatePlanetOrbit(planet, move){
        const pi2 = Math.PI * 2;
        const speed = move.speed || 0.01 * $gameDate.getScrollSpeedMode();
        
        if(!planet.active){
            planet.orbitAngle = Math.random() * pi2;
            planet.activate();
        }else{
            planet.orbitAngle = (planet.orbitAngle + speed) % pi2;
        }
        const angle = planet.orbitAngle;

        planet._x = move.centerX + Math.cos(angle) * move.radiusX;
        planet._y = move.centerY + Math.sin(angle) * move.radiusY;
    }
    updatePlanetScaleOnY(sprite, planet, move){
        const change = (move.value - sprite.zoomOriginal) * (planet.y /720);

        sprite.scale.y = sprite.zoomOriginal + change;
        sprite.scale.x = sprite.zoomOriginal + change;
    }
    // Met à jour les alerte
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
            const planetSprite = this._planetSprites[alert.pos.planetId];
            sprite.x = planetSprite.x;
            sprite.y = planetSprite.y;
            break;
            case "static":
            sprite.x = alert.pos.x + this._mapOffsetX;
            sprite.y = alert.pos.y + this._mapOffsetY;
            break;
            default:
                break;
        }
    }
    //spaceship positionning
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
                    this.updateSpaceshipOrbiting(ship, planet, speed);

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
        });
    }
    updateSpaceshipOrbiting(ship, planet, speed) {
        if (planet) {
            const distance = this.getMapDistance(ship, planet);
            
            if (distance > speed) {
                this.approachTarget(ship, planet, speed);
            } else {
                this.shipStaticOrbit(ship, planet);
            }
        }
    }
    approachTarget(ship, target, speed) {
        // Approche de la cible
        ship.consumeFuel(0.01); 
        ship.x = ship.x.approach(target.x, speed);
        ship.y = ship.y.approach(target.y, speed);
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
    //UPDATE SPRITE
    updateSpaceshipSprite(sprite, ship, oldX) {
        // Met à jour la position du sprite
        sprite.x = ship.x + this._mapOffsetX;
        sprite.y = ship.y + this._mapOffsetY;

        this.updateSpriteDir(sprite, oldX, ship);
        this.updateSpaceshipScale(sprite);
    }
    updateSpriteDir(sprite, oldX, ship){
        // Flip sprite based on direction
        if (ship.x > oldX) { // Moving right
            sprite.scale.x = -Math.abs(sprite.scale.x);
        } else if (ship.x < oldX) { // Moving left
            sprite.scale.x = Math.abs(sprite.scale.x);
        }
    }
    updateSpaceshipScale(sprite) {
        if(Math.abs(sprite.scale.x) !=  0.2){
            const newScale = Math.abs(sprite.scale.x).approach( 0.03, 0.002);
            const direction = sprite.scale.x >= 0 ? 1 : -1;
            sprite.scale.x = newScale * direction;
            sprite.scale.y = newScale;
        }
    }
    //others
    updateTimer() {
        this._timer++;
        if(this._timer > 100){ // Après 5 secondes, retour à la console
            this._timer = 1;
            $storyManager.update();
        }
        
    }
    updateCalendar(){
        $gameDate.passTick();
    }

};

