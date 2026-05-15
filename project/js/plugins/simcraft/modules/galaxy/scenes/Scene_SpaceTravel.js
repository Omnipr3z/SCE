class Scene_SpaceTravel extends Scene_Base {
    constructor() {
        super();
        this._state = 'INITIAL';
        this._timer = 0;
        this._infoWindow = null;
        this._oldScrollSpeedMode = $gameDate.getScrollSpeedMode();
        $gameDate.setScrollSpeedMode(4);
        this._selectedPlanet = -1;
        
        // Instanciation du Manager de la carte système
        this._mapManager = new SystemMapManager();
    }

    // Accès raccourci aux données gérées par le manager
    get planets() { return this._mapManager.planets; }
    get alerts() { return this._mapManager.alerts; }
    get spaceships() { return this._mapManager.spaceships; }
    get playerSpaceship() { return this._mapManager.playerSpaceship; }

    isBusy() {
        return false;
    }

    // Helpers UI
    bottomPannelHeight() { return 720 / 3; }
    gridCaseWidth() { return 1280 / 4; }
    rateW() { return Graphics._width / 1280; }
    rateH() { return Graphics._height / 720; }
    
    bottomPanelRealSize() {
        return this.bottomPannelHeight() * this.rateH();
    }
    
    rightPanelRealSize() {
        return this.gridCaseWidth() * this.rateW();
    }

    isOnMapArea(x, y) {
        const coldZone = 4;
        return x > coldZone
            && x <= 1280 - coldZone
            && y > coldZone
            && y <= Graphics._height - this.bottomPanelRealSize() - coldZone;
    }

    // Rectangles des HUDs
    rightPannelRect() {
        const w = this.gridCaseWidth();
        const h = 1280 - this.bottomPannelHeight();
        const x = 1280 - w;
        const y = 0;
        return new Rectangle(x, y, w, h);
    }
    eventWindowRect() {
        const w = this.gridCaseWidth();
        const h = this.bottomPannelHeight();
        const x = 0;
        const y = 720 - h;
        return new Rectangle(x, y, w, h);
    }
    messageWindowRect() {
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

    // Système de log (récupération des logs du manager + logs directs de la scène)
    log(style, info) {
        if(this._eventWindow) {
            this._eventWindow.addNews({style: style, txt: info});
        }
    }
    logMove(shipName, x, y) {
        this.log('basicInfos', `The ${shipName} has new target location: ${x}-${y}`);
    }
    processManagerLogs() {
        const logs = this._mapManager.pullLogs();
        logs.forEach(l => this.log(l.style, l.txt));
    }

    // CREATE
    create() {
        super.create();
        this.createSystemMap();
        this.createWindowLayer();
    }

    // Instanciation de la Vue (SpriteSystemMap)
    createSystemMap() {
        this._spriteset = new SpriteSystemMap(this._mapManager);
        this._spriteset.create();
        this.addChild(this._spriteset);
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
    createInfoWindow() {
        const rect = this.rightPannelRect();
        this._infoWindow = new Window_ShipInfo(rect);
        this._infoWindow.setShip(this.spaceships[0]);
        this.addWindow(this._infoWindow);
    }
    createEventWindow() {
        const rect = this.eventWindowRect();
        this._eventWindow = new Window_EventInfo(rect);
        this.addWindow(this._eventWindow);
    }
    createMessageWindow() {
        const rect = this.messageWindowRect();
        this._dialWindow = new Window_Dial(rect);
        this.addWindow(this._dialWindow);
    }
    createCmdWindow()  {
        const rect = this.cmdWindowRect();
        this._cmdWindow = new Window_Cmd(rect);
        this.addWindow(this._cmdWindow);
    }
    createCalendarWindow() {
        const rect = new Rectangle(0, 0, this.gridCaseWidth() * 3, 80);
        this._calendarWindow = new Window_Calendar(rect);
        this.addWindow(this._calendarWindow);
    }
    createSectorWindow(){
        const rect = this.rightPannelRect();
        this._sectorWindow = new Window_SectorInfos(rect);
        this.addWindow(this._sectorWindow);
    }

    // UPDATE
    update() {
        super.update();
        if(!this.isBusy()){
            // Mise à jour du manager (logique et physique)
            this._mapManager.update();
            this.processManagerLogs();

            // Mise à jour de la scène (inputs, timers, UI)
            this.updateInput();
            this.updateTimer();
            this.updateCalendar();
            
            this._eventWindow.refresh();
            this._calendarWindow.refresh();
            this._dialWindow.setPlanet(this._selectedPlanet);
            this._dialWindow.refresh();
            this._sectorWindow.refresh();
        }
    }

    // Input
    updateInput() {
        const ship = this.playerSpaceship;
        if (!ship) return;
        
        if (TouchInput.isTriggered()) {
            if(!this.checkPlanetClick(ship)){
                this.checkPlayerTravelClick(ship);
            }
        }
        
        if(Input.isLongPressed("shift") || TouchInput.isLongPressed()){
            if(!ship.isHyperdrive() && ship.canActivateHyperdrive())
                ship.activeHyperdrive();
        }else if(ship.isHyperdrive()) {
            ship.deactivateHyperdrive();
        }

        if(Input.isTriggered('cancel')){
            $gameDate.setScrollSpeedMode(this._oldScrollSpeedMode);
            SceneManager.pop();
        }
    }

    checkPlayerTravelClick(ship) {
        if (this.isOnMapArea(TouchInput.x, TouchInput.y)) {
            this._selectedPlanet = -1;
            
            // Calcul des coordonnées logiques du clic en retirant l'offset de la caméra
            const mapXTouch = TouchInput.x - this._mapManager.mapOffsetX;
            const mapYTouch = TouchInput.y - this._mapManager.mapOffsetY;

            if(ship.targetX != mapXTouch || ship.targetY != mapYTouch){
                this.logMove(ship.name, mapXTouch, mapYTouch);
                ship.setTarget(mapXTouch, mapYTouch);
            }
        }
    }

    checkPlanetClick(ship) {
        let planetClicked = false;
        
        // On récupère les sprites depuis la vue pour tester les bounding boxes
        const planetSprites = this._spriteset._planetSprites;
        if(!planetSprites) return false;

        for (let i = planetSprites.length - 1; i >= 0; i--) {
            const planetSprite = planetSprites[i];
            const planetData = this.planets[i];
            
            const x = planetSprite.x - (planetSprite.width * planetSprite.anchor.x * planetSprite.scale.x);
            const y = planetSprite.y - (planetSprite.height * planetSprite.anchor.y * planetSprite.scale.y);

            const rect = new Rectangle(
                x,
                y,
                planetSprite.width * planetSprite.scale.x,
                planetSprite.height * planetSprite.scale.y
            );

            if (rect.contains(TouchInput.x, TouchInput.y)) {
                if (this._selectedPlanet == i) {
                    if (ship.orbitPlanetId != i && ship) {
                        this.log('basicInfos', `The ${ship.name} going to ${planetData.name}.`);
                        ship.setOrbitingPlanet(i);
                    }
                } else {
                    this._selectedPlanet = i;
                }
                
                planetClicked = true;
                break;
            }
        }
        return planetClicked;
    }

    // Others
    updateTimer() {
        this._timer++;
        if(this._timer > 100){
            this._timer = 1;
            $storyManager.update();
        }
    }
    
    updateCalendar(){
        $gameDate.passTick();
    }
}
