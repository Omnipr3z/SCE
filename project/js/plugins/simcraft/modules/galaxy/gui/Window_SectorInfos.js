class Window_SectorInfos extends Window_ScBase{
    constructor(rect){
        super(rect);
        this._sectorMapSprite = null;
        this._sectorFocusX = 75;
        this._sectorFocusY = 75;
        this._xTarget = 75;
        this._yTarget = 75;
        this.visible = false;

    }
    
    loadSpaceshipBitmap(filename){
        return ImageManager.loadBitmap("img/GUI/ship/", filename);
    }
    refresh(){
        this.contents.clear();
        this.updateSectorMapSprite();
        this.resetFontSettings();
        if(this._xTarget == this._sectorFocusX && this._yTarget == this._sectorFocusY){
            this.drawCurrentInfos();
            this.drawOthers();
        
        }

    }
    drawCurrentInfos(){
        const system = $gameSector.currentSystem();
        
        this.styleTitle();
        this.drawText(system.name + " System", 150, 150,150,"center");
    }
    drawOthers(){

        const systems = []; //$gameSector.systems();
        for(let i = 0; i < systems.length; i++){
            const system = systems[i];
            
            //this.drawText(system.name + " System", 150, 150,150,"center");
        }
    }
    updateSectorMapSprite(){
        const bitmap = this.loadSpaceshipBitmap("Sector");

       
        if(!this._sectorMapSprite){

            this._sectorMapSprite = new Sprite();
            this.addChildToBack(this._sectorMapSprite);
        }

        this._sectorMapSprite.bitmap = bitmap;
        this._sectorMapSprite.anchor.x = 0.5;
        this._sectorMapSprite.anchor.y = 0.5;

        this._sectorMapSprite.x = this.width /2;
        this._sectorMapSprite.y =  this.mapSize() / 2 + 16;

        //this._sectorMapSprite.zIndex = this.contents.zIndex - 1;
        const frame = this.mapRect();

        this._sectorMapSprite.setFrame(frame.x, frame.y, frame.width, frame.height);
    }
    mapSize(){
        return 400;
    }
    mapRect(){
        const size = this.mapSize();
        this._xTarget = $gameSector.currentSystem().position.x - size/2;
        this._yTarget = $gameSector.currentSystem().position.y - size/2;
        this._sectorFocusX = this._sectorFocusX.approach(this._xTarget, 10);
        this._sectorFocusY = this._sectorFocusY.approach(this._yTarget, 10);

        return new Rectangle(this._sectorFocusX, this._sectorFocusY, size, size);
    }
    centerMapRect(){
        const size = this.mapSize();
        const x = 512 - size / 2;
        const y = 512 - size / 2;

        return new Rectangle(x, y, size, size);
    }

}