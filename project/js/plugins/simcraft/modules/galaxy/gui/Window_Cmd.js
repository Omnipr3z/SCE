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
        const bitmap = this.loadSpaceshipBitmap("ui2_BG");
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
    refresh() {
        this.contents.clear();
        this.resetFontSettings();
        if (this._hudBGSprite && this._hudBGSprite.bitmap && this._hudBGSprite.bitmap.isReady()) {
            this._hudBGSprite.scale.x = this.width / this._hudBGSprite.bitmap.width;
            this._hudBGSprite.scale.y = this.height / this._hudBGSprite.bitmap.height;
        }
    }

}
