class Window_Dial extends Window_ScBase {
    constructor(rect) {
        super(rect);
    }
    
    loadSpaceshipBitmap(filename){
        return ImageManager.loadBitmap("img/GUI/ship/", filename);
    }
    _createBackSprite () {
        super._createBackSprite();
        this._hudBGSprite = new Sprite(this.loadSpaceshipBitmap("ui_BG"));
        this._hudBGSprite.x = 0;
        this._hudBGSprite.y = 0;
        this.addChild(this._hudBGSprite);


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
                "value":150,
                "max":1000,
                "order":["left", "right"],
                "colors":[
                    ColorManager.hpGaugeColor1(),
                    ColorManager.hpGaugeColor2(),
                    ColorManager.hpGaugeColor2()
                ]
            },
            {
                "txt":"Supplies",
                "value":150,
                "max":1000,
                "order":["left", "right"],
                "colors":[
                    ColorManager.mpGaugeColor1(),
                    ColorManager.mpGaugeColor2(),
                    ColorManager.mpCostColor()
                ]
            },
            {
                "txt":"Command pts",
                "value":150,
                "max":1000,
                "order":["right", "left"],
                "colors":[
                    ColorManager.tpGaugeColor1(),
                    ColorManager.tpGaugeColor2(),
                    ColorManager.tpCostColor()
                ]
            },
            {
                "txt":"Requisition",
                "value":150,
                "max":1000,
                "order":["right", "left"],
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
    }
    hasPlanet(){
        return this._planetId !== null
            && this._oldPlanetId != this._planetId
            && this._planetId >= 0;
    }
    updatePlanet(){
        if(this.hasPlanet()){
            const planet = $gameSector.currentSystem().planet(this._planetId);
            const rect = new Rectangle(490, 64, 140, 140);
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
                    const newScale = this.getScale(rect.width, bitmap.width);
                    this._planetSprite.scale.x = newScale;
                    this._planetSprite.scale.y = newScale;
    
                    this._planetSprite.anchor.x = 0.5;
                    this._planetSprite.anchor.y = 0.5;
                    
                    this._planetSprite.x = rect.x + rect.width/2 + 10;
                    this._planetSprite.y = rect.y + rect.height/2 +  10;
                }
                
                this.styleTitle();
                this.drawText(planet.name, rect.x, rect.y - 38, rect.width,"center")
            });

        }else if (this._planetSprite){
            this._planetSprite.visible = false;
        }
    }
    getScale(trgtW, oriWidth){
        if (trgtW == oriWidth){
            return 1;
        }
        return trgtW / oriWidth;
    }
    updateRsrces(){
         this.rsrcData.forEach((item, index) => {
            this.resetFontSettings();
            const rect = this.itemRect(index);
            let orderPad = 0;
            let reduceW = 0;
            let padX = 0;
            let padX2 = 0;


            if(item.order[0] == "left"){
                orderPad = 8;
                reduceW =  36;
                padX2 = 4;
            }else{
                orderPad = (rect.width / 2) + 16;
                padX =  24;
            }

            this.styleCaptainName();
            this.drawText(item.txt, rect.x, rect.y - 10, rect.width, item.order[0]);

            this.styleSubName();
            this.drawText(`/${item.max}`, rect.x + padX, rect.y + 8, rect.width, item.order[1]);

            this.contents.textColor     = item.colors[2];
            this.drawText(`${item.value}`, rect.x + padX2, rect.y + 8, rect.width - reduceW, item.order[1]);

            this.drawGauge(
                rect.x +  orderPad,
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
        const x1 = 80;
        const y1 = 36;
        const x2 = x1 + 140;
        const y2 = y1 + 44;
        const w = 120;
        const h = 48;

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