class Window_Cmd extends Window_ScBase {
    constructor(rect) {
        super(rect);
        this.refresh();
    
    }
    
    loadSpaceshipBitmap(filename){
        return ImageManager.loadBitmap("img/GUI/ship/", filename);
    }
    _createBackSprite () {
        super._createBackSprite();
        this._hudBGSprite = new Sprite(this.loadSpaceshipBitmap("ui2_BG"));
        this._hudBGSprite.x = 0;
        this._hudBGSprite.y = 0;
        this.addChild(this._hudBGSprite);

    }
    refresh() {
        this.contents.clear();
        this.resetFontSettings()
    }

}
