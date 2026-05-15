class Window_Calendar extends Window_ScBase {
    constructor(rect) {
        super(rect);
        this.opacity = 0;
        this.refresh();
    
    }
    resetFontSettings() {
        this.contents.fontFace      = 'GameFont';
        this.contents.fontSize      = 24;
        this.contents.textColor     = "rgb(150,150,150)";
        this.contents.outlineColor  = "rgb(0,0,0)";
        this.contents.outlineWidth  = 0;
    }
    loadWindowskin() {
        this.windowskin = ImageManager.loadSystem("Prompt");
    }
    refresh() {
        this.contents.clear();
        let demi = this.contentsWidth()/2
        this.resetFontSettings()
        //this.drawText($gameDate.date40K, 0, 0, demi, 'left');
        this.drawText(`ULTIMA-SEGMENTUM ▷ Ankaros Sector ▹ ${$gameSector.currentSystem().name} System`, demi, 0, demi, 'right');
    }

}