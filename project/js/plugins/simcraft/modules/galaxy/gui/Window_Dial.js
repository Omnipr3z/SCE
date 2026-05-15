class Window_Dial extends Window_ScBase {
    constructor(rect) {
        super(rect);
    }
    
    loadSpaceshipBitmap(filename){
        return ImageManager.loadBitmap("img/GUI/ship/", filename);
    }
    _createBackSprite () {
        super._createBackSprite();
        const bitmap = this.loadSpaceshipBitmap("ui_BG");
        this._hudBGSprite = new Sprite(bitmap);
        this._hudBGSprite.x = 0;
        this._hudBGSprite.y = 0;
        this.addChild(this._hudBGSprite);
        bitmap.addLoadListener(() => {
            if (this.width > 0 && this.height > 0) {
                this._hudBGSprite.scale.x = this.width / bitmap.width;
                this._hudBGSprite.scale.y = this.height / bitmap.height;
            }
        });

    }
    resetFontSettings() {
        this.contents.fontFace      = 'BaseFont';
        this.contents.fontSize      = 16;
        this.resetTextColor();
    }
    setPlanet(index){
        if(index >= 0)
            this._planetId = index;
        else
            this._planetId = null;
        this.refresh();
        
    }
    get rsrcData() {
        return [
            {
                "txt":"ArcheoTech",
                "value":15,
                "max":100,
                "order":"right",
                "colors":[
                    ColorManager.hpGaugeColor1(),
                    ColorManager.hpGaugeColor2(),
                    ColorManager.hpGaugeColor2()
                ]
            },
            {
                "txt":"Supplies",
                "value":45,
                "max":100,
                "order":"right",
                "colors":[
                    ColorManager.mpGaugeColor1(),
                    ColorManager.mpGaugeColor2(),
                    ColorManager.mpCostColor()
                ]
            },
            {
                "txt":"Command pts",
                "value":100,
                "max":100,
                "order":"left",
                "colors":[
                    ColorManager.tpGaugeColor1(),
                    ColorManager.tpGaugeColor2(),
                    ColorManager.tpCostColor()
                ]
            },
            {
                "txt":"Requisition",
                "value":10,
                "max":100,
                "order":"left",
                "colors":[
                    ColorManager.ctGaugeColor1(),
                    ColorManager.ctGaugeColor2(),
                    ColorManager.ctGaugeColor2()
                ]
            }
        ];
    }
    refresh() {
        this.contents.clear();
        this.updateRsrces();
        this.updatePlanet();
        if (this._hudBGSprite && this._hudBGSprite.bitmap && this._hudBGSprite.bitmap.isReady()) {
            this._hudBGSprite.scale.x = this.width / this._hudBGSprite.bitmap.width;
            this._hudBGSprite.scale.y = this.height / this._hudBGSprite.bitmap.height;
        }
    }
    hasPlanet(){
        return this._planetId !== null
            && this._oldPlanetId != this._planetId
            && this._planetId >= 0;
    }
    planetRect(){
        const x = this.width * 0.55;
        const y = this.height * 0.12;
        const w = this.width * 0.32;
        const h = this.height * 0.8;

        return  new Rectangle(x, y, w, h);
    }
    updatePlanet(){
        if(this.hasPlanet()){
            const planet = $gameSector.currentSystem().planet(this._planetId);
            const rect = this.planetRect();
            const bitmap = this.loadSpaceshipBitmap(planet.bitmapName);            
            
            if(!this._planetSprite) {
                this._planetSprite = new Sprite();
                this.addChild(this._planetSprite);
            }
            
            this._planetSprite.bitmap = bitmap; // Assigner le bitmap
            
            // Attendre que le bitmap soit chargé avant de calculer l'échelle
            bitmap.addLoadListener(() => {
                if (this._planetSprite) {
                    this._planetSprite.visible = true;
                    const newScale = this.getScale(rect.width, bitmap.width, 0.6);
                    this._planetSprite.scale.x = newScale;
                    this._planetSprite.scale.y = newScale;
    
                    this._planetSprite.anchor.x = 0.5;
                    this._planetSprite.anchor.y = 0.5;
                    
                    this._planetSprite.x = rect.x + rect.width/2 + 8;
                    this._planetSprite.y = rect.y + rect.height/2 + 8;
                }
                
                this.styleTitle();
                this.drawText(planet.name, rect.x, rect.y, rect.width,"center")
            });

        }else if (this._planetSprite){
            this._planetSprite.visible = false;
        }
    }
    getScale(trgtW, oriWidth, scale=1){

        if (trgtW * scale == oriWidth){
            return 1;
        }
        return (trgtW * scale) / oriWidth;
    }
    updateRsrces(){
         this.rsrcData.forEach((item, index) => {
            this.resetFontSettings();

            const rect = this.itemRect(index);
            
            let orderPad = 0;
            let reduceW = 0;
            let padX = 0;
            let padX2 = 4;


            if(item.order == "right"){
                orderPad = -8;
                reduceW =  36;
                padX2 = 8;
            }else{
                orderPad = 16;
                padX =  24;
            }

            this.styleRsrcesName();
            this.drawText(item.txt, rect.x, rect.y - 10, rect.width, "center");

            this.styleSubName();
            this.drawText(`/${item.max}`, rect.x + padX, rect.y + 8, rect.width, item.order);

            this.contents.textColor     = item.colors[2];
            this.drawText(`${item.value.toString().padZero(3)}`, rect.x + padX2, rect.y + 8, rect.width - reduceW, item.order);

            this.drawGauge(
                rect.x +  (rect.width/3) + orderPad,
                rect.y + 20,
                rect.width/3,
                item.value / item.max,
                item.colors[0],
                item.colors[1],
                10
            );
            
        })
    }
    itemRect(index) {
        const x1 = 0.048 * this.width;
        const y1 = 0.124 * this.height;
        const x2 = x1 + 0.23 * this.width;
        const y2 = y1 + 0.164 * this.height;
        const w = 0.20 * this.width;
        const h = 0.088 * this.height;

        switch(index){
            case 0:
                return new Rectangle(x1, y1, w, h);
            case 1:
                return new Rectangle(x1, y2, w, h);
            case 2:
                return new Rectangle(x2, y1, w, h);
            case 3:
                return new Rectangle(x2, y2, w, h);
            default:
                return new Rectangle(80, 36, 124, 48);
        }
    }

}