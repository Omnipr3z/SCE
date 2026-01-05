class Window_ShipInfo extends Window_ScBase {
    constructor(rect) {
        super(rect);
        this._ship = null;
        this._shipSprite = new Sprite();
        this._shipSprite.anchor.x = 0.5;
        this._shipSprite.anchor.y = 0.5;
        this._shipSprite.scale.x = 0.1;
        this._shipSprite.scale.y = 0.1;
        this._shipOriginX = 140;
        this._moveTick =  0;
        this._move = this._shipOriginX;
        this.opacity = 0;
        this.visible = false;
        this._moveDirection = 0;
        
        this.addChild(this._shipSprite);

    }
    loadSpaceshipBitmap(filename){
        return ImageManager.loadBitmap("img/GUI/ship/", filename);
    }
    loadShipMotorBitmap(filename){
        return ImageManager.loadBitmap("img/GUI/ship/motors/", filename);
    }
    _createBackSprite () {
        super._createBackSprite();
        this._hudBGSprite = new Sprite(this.loadSpaceshipBitmap("ShipInfos_BG"));
        this._hudBGSprite.x = 0;
        this._hudBGSprite.y = 0;
        this.addChild(this._hudBGSprite);
        
        this._motorSprite = new Sprite(this.loadShipMotorBitmap("1"));
        this.addChild(this._motorSprite);

    }
    resetFontSettings() {
        this.contents.fontFace      = 'BaseFont';
        this.contents.fontSize      = 16;
        this.resetTextColor();
    }
    setShip(ship) {
        this._ship = ship;
        this.refresh();
    }

    refresh() {
        if (!this._ship) return;
        this.contents.clear();

        const ship = this._ship;
        
        this.drawShipName();
        this.drawShipImage();
        this.drawCaptain();
        this.drawShipData();
        this.drawShipData2();
        this.drawMotorData();
        

        
    }
    linePad(lines = 1) {
        return 24 * lines;
    }
    drawMotorData() {
        
        const rect = new Rectangle(16, 350, 187, 80);
        // this.drawRect(rect.x, rect.y, rect.width, rect.height);

        //motor Sprite
        this._motorSprite.anchor.x  = 0.5;
        this._motorSprite.anchor.y  = 0.5;
        this._motorSprite.x         = rect.x + rect.width /2 + 16;
        this._motorSprite.y         = rect.y + rect.height /2 + 16;

        const ship      = this._ship;
        const motor     = ship.motor;
        const fuel      = ship.fuel;
        const capacity  = motor.capacity;

        this.resetFontSettings();
        this.drawText("◈Engine:", rect.x, rect.y, rect.width, 'left');


        this.styleValues();
        // Motor Name
        this.drawText(motor.name, rect.x, rect.y, rect.width, 'right');

        // Fuel Gauge
        const gaugeH = 12
        const gaugeY = rect.y + rect.height - gaugeH;
        const gaugeRate = fuel / capacity;
        let fuelText = "∞"
        
        if (capacity > 0) {
            fuelText = `${Math.round(fuel)} /  ${capacity}`
            this.drawGauge(rect.x, gaugeY, rect.width, gaugeRate, ColorManager.hpGaugeColor1(), ColorManager.hpGaugeColor2(), gaugeH);
        }

        //Fuel Text
        this.styleGauge();
        this.drawText(`${motor.fuelname}: ${fuelText}`, rect.x + 10, gaugeY - gaugeH, rect.width - 20, 'center');
    }
    drawShipData() {
        const rect = new Rectangle(24, 218, Math.round(this.contents.width / 2) - 28, 80);
        //this.drawRect(rect.x, rect.y, rect.width, rect.height);
        
        const ship = this._ship;

        this.resetFontSettings();
        this.drawText("◈Category:",      rect.x,     rect.y,                     rect.width, 'left');
        this.drawText("◈Class:",         rect.x,     rect.y + this.linePad(),    rect.width, 'left');
        this.drawText("◈Faction:",       rect.x,     rect.y + this.linePad(2),   rect.width, 'left');

        this.styleValues();
        this.drawText(ship.category,    rect.x,     rect.y,                     rect.width, 'right');
        this.drawText(ship.shipClass,   rect.x,     rect.y + this.linePad(),    rect.width, 'right');

        this.drawText(ship.faction,     rect.x + 24,     rect.y + this.linePad(2),   rect.width -24, 'right');
    }
    drawShipData2() {
        const mid = Math.round(this.contents.width / 2);
        const rect = new Rectangle(mid + 20, 218, mid - 40, 80);
        //this.drawRect(rect.x, rect.y, rect.width, rect.height);

        const ship = this._ship;

        this.resetFontSettings();
        this.drawText("◈Position:",     rect.x,     rect.y,                     rect.width, 'left');

        this.styleValues();
        this.drawText(ship.positionTxt, rect.x,     rect.y,                     rect.width, 'right');
        this.drawText(ship.statusTxt,  rect.x,     rect.y + this.linePad(),    rect.width, 'right');
        this.drawText(ship.speedTxt,  rect.x,     rect.y + this.linePad(2),    rect.width, 'right');
    }
    drawShipImage() {
        this._shipSprite.bitmap = this.loadSpaceshipBitmap(this._ship.bitmapName);
         this.spaceshipMove();
    }
    drawShipName() {
        this.styleTitle();
        this.drawText(this._ship.name, 0, 6, 310, 'center');
    }
    drawCaptain(){
        const captain = this._ship.captain;

        //face
        const sizeFace = 80;
        const xFace = this.contentsWidth() - sizeFace - 40;
        const yFace = 70;

        this.drawFace(captain.faceName(), captain.faceIndex(), xFace, yFace, 144, 144, sizeFace, sizeFace);

        
        //name
        const captainClassname = captain.currentClass().name;
        const nameTxt = `${captain.nickname()} ${captain.name().toUpperCase()}`;
        
        this.styleClassname();
        this.drawText(captainClassname, xFace - 16, yFace - 30, sizeFace +32, "center" )
        
        this.styleCaptainName();
        this.drawText(nameTxt, xFace - 16, yFace + sizeFace - 6, sizeFace + 32, "center" )
    }
    spaceshipMove () {

        if(this._moveTick-- <= 0 && this._ship.isMoving()){
            this.updateShipMove();
            this._moveTick = 30;
        }

        return this._move;
    }
    updateShipMove(){
        if(this._move == this._shipOriginX){
            this._moveDirection = 1;
            this._move += Math.round(Math.random());
        }else if(this._move >= this._shipOriginX + 10){
            this._moveDirection = 0;
        }else if(this._moveDirection == 1){
            this._move += Math.round(Math.random());
        }else{
            this._move -= Math.round(Math.random());
        }
        this._shipSprite.x = this._move;
        this._shipSprite.y = 130 + Math.round(Math.random());
    }
    update() {
        super.update();
        if (this._ship) {
            this.refresh();
        }
    }
    drawFace(faceName, faceIndex, x, y, width, height, size = 144) {
        width = width || ImageManager.standardFaceWidth;
        height = height || ImageManager.standardFaceHeight;
        const bitmap = ImageManager.loadFace(faceName);
        const pw = ImageManager.faceWidth;
        const ph = ImageManager.faceHeight;
        const sw = Math.min(width, pw);
        const sh = Math.min(height, ph);
        const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
        const sx = Math.floor((faceIndex % 4) * pw + (pw - sw) / 2);
        const sy = Math.floor(Math.floor(faceIndex / 4) * ph + (ph - sh) / 2);
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy,size, size);
    };
}