class Window_ShipInfo extends Window_ScBase {
    constructor(rect) {
        super(rect);
        this._ship = null;
        this._shipSprite = new Sprite();

        this._shipSprite.anchor.x = 0.5;
        this._shipSprite.anchor.y = 0.5;
        this._shipSprite.scale.x = this.scaleRateW * 0.1;
        this._shipSprite.scale.y = this.scaleRateH * 0.1;
        this._shipOriginX = this.spaceShipX();

        this._moveTick =  0;
        this._move = this._shipOriginX;
        this.opacity = 0;
        //this.visible = false;
        this._moveDirection = 0;
        
        this.addChild(this._shipSprite);
    }
    get scaleRateW() {
        return Graphics.width / 1280;
    }
    get scaleRateH() {
        return Graphics.height / 720;
    }
    spaceShipX(){
        return 92  * this.scaleRateW;
    }
    spaceShipY(){
        return 100 * this.scaleRateH;
    }
    loadSpaceshipBitmap(filename){
        return ImageManager.loadBitmap("img/GUI/ship/", filename);
    }
    loadShipMotorBitmap(filename){
        return ImageManager.loadBitmap("img/GUI/ship/motors/", filename);
    }
    _createBackSprite () {
        super._createBackSprite();
        this._hudBGSprite = new Sprite();
        this.addChild(this._hudBGSprite);

        const bitmap = this.loadSpaceshipBitmap("ShipInfos_BG");
        bitmap.addLoadListener(() => {
            this._hudBGSprite.bitmap = bitmap;
            this._hudBGSprite.x = 0;
            this._hudBGSprite.y = 0;
            this._hudBGSprite.scale.x = this.width  / this._hudBGSprite.bitmap.width;
            this._hudBGSprite.scale.y = this._hudBGSprite.scale.x;
        });

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
    linePad(lines = 1) {
        return 24 * lines;
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
    drawShipName() {
        this.styleTitle();
        this.drawText(this._ship.name, 0, 6, this.contents.width, 'left');
    }
    drawShipImage() {
        this._shipSprite.bitmap = this.loadSpaceshipBitmap(this._ship.bitmapName);
         this.spaceshipMove();
    }
    captainFaceRect(){
        const size = 80 * this.scaleRateW;
        const x = this.contentsWidth() - size - (12 * this.scaleRateW);
        const y = 38 * this.scaleRateH;

        return new Rectangle(x, y, size, size);
    }
    captainFrameRect(){
        const faceRect = this.captainFaceRect();

        const x = faceRect.x - (13 * this.scaleRateW);
        const y = faceRect.y - (28 * this.scaleRateW);

        const width = faceRect.width + (25 * this.scaleRateW);
        const height = faceRect.height + (45 * this.scaleRateW);


        return new Rectangle(x, y, width, height);
    }
    drawCaptainFace(captain){
        const faceRect = this.captainFaceRect();

        this.drawFace(
            captain.faceName(),
            captain.faceIndex(),
            faceRect.x,
            faceRect.y,
            144, 144,
            faceRect.width, faceRect.height
        );
        this.drawCaptainFrame();
    }
    drawCaptainFrame(){
        const bitmaphud = ImageManager.loadBitmap("img/faces/", "hud");
        const frameRect = this.captainFrameRect();

        this.contents.blt(bitmaphud,
            0, 0,
            bitmaphud.width, bitmaphud.height,
            frameRect.x,
            frameRect.y,
            frameRect.width,
            frameRect.height
        );
    }
    drawCaptain(){
        const captain = this._ship.captain;


        //face
        this.drawCaptainFace(captain);

        //name
        this.drawCaptainName(captain);
    }
    drawCaptainName(captain){
        const captainClassname = captain.currentClass().name;
        const nameTxt = `${captain.nickname()} ${captain.name().toUpperCase()}`;
        const faceRect = this.captainFaceRect();
        
        this.styleClassname();
        this.drawText(captainClassname, faceRect.x - 16, faceRect.y - 30, faceRect.width +32, "center")
        
        this.styleCaptainName();
        this.drawText(nameTxt, faceRect.x - 16, faceRect.y + faceRect.height - 6, faceRect.width + 32, "center")
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
        this._shipSprite.y = this.spaceShipY() + Math.round(Math.random());
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