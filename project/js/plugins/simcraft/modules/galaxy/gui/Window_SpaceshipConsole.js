
class Window_SpaceshipConsole extends Window_HorzCommand {
    constructor(rect) {     
        super(rect);
        this.openness = 0;
        this.opacity = 0;
    }

    loadSpaceshipBitmap(filename){
        return ImageManager.loadBitmap("img/GUI/ship/", filename);
    }
    update(){
        super.update();
        if (this._windowCursorSprite) {
            this._windowCursorSprite.rotation += 0.01; 
        }
    }

    makeCommandList() {
        this.addCommand('Pont de Commandement',     'bridge');
        this.addCommand('Quartier des Officiers',   'officers');
        this.addCommand('Cogitarium Auspex',        'auspex');
        this.addCommand('Centre Stratégique',       'command');
        this.addCommand('Sanctum Imperialis',       'command');
        this.addCommand('Machinarium',              'command');
        this.addCommand('Quartier de l\'équipage',  'command');
        this.addCommand('Centre de détention',      'command');
        this.addCommand('Arsenal',                  'command');
        this.addCommand('Armurerie',                'command');
        this.addCommand('Navigator Sanctum',        'command');
        this.addCommand('Hangar',                   'command');
        this.addCommand('Omnissiah Laboratorium',   'command');
    }

    maxCols() {
        return 13;
    }

    drawItem(index) {
        const rect = this.itemRect(index);
        const iconSize = 80;
        const iconX = rect.x + (rect.width - iconSize) / 2;
        const iconY = rect.y + (rect.height - iconSize) / 2;
        this.drawCmdIcon(index, iconX, iconY);
    }

    drawCmdIcon(iconIndex, x, y) {
        const bitmap = this.loadSpaceshipBitmap('cmdBtns');
        const iconSize = 80;
        const sx = iconIndex * iconSize;
        let sy = 0;
        if (!this.isCommandEnabled(iconIndex)) {
            sy += iconSize;
        }
        this.contents.blt(bitmap, sx, sy, iconSize, iconSize, x, y);
    }

    _refreshCursor() {
        //super._refreshCursor();
        const size = Graphics.boxWidth /  this.maxCols();
        const rect = new Rectangle(this._index * size, 8, size, 100);
        if (this._windowCursorSprite && rect) {
            this._windowCursorSprite.bitmap = this.loadSpaceshipBitmap("spaceshipCmdCursor");
            this._windowCursorSprite.anchor.x = 0.5;
            this._windowCursorSprite.anchor.y = 0.5;
            this._windowCursorSprite.setFrame(0, 0, 96, 96);
            this._windowCursorSprite.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
        }
    }

    _updateCursor() {
        if (this._windowCursorSprite) {
            var blinkCount = this._animationCount % 40;
            var cursorOpacity = this.contentsOpacity;
            if (this.active) {
                if (blinkCount < 20) {
                    cursorOpacity -= blinkCount * 8;
                } else {
                    cursorOpacity -= (40 - blinkCount) * 8;
                }
            }
            this._windowCursorSprite.alpha = cursorOpacity / 255;
            this._windowCursorSprite.visible = this.isOpen();
        }
    }

    isCancelEnabled() {
        return true;
    }
};