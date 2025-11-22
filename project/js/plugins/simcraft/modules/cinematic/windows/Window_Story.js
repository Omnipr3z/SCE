class Window_Story extends Window_ScBase{
    constructor(rect) {
        super(rect)
        this.clearTxt();
        this.opacity = 0;
        this._tick = 0;
        this._maxTick = 10;
        //this.opacity = 255;
    }
    setStyle(style){
        this._style = style;
    }
    setTxt(txt){
        this._txt = txt;
    }
    clearTxt(){
        this._txt = [];
        this.update()
    }
    update() {
        super.update();
        if(!this._txt){
            this.contents.clear();
            this._tick = 0;
            return;
        }
        if(this._txt.length > 0){
            if(this._tick > this._maxTick){
                this.contents.clear();
                this.contents.fontSize = 14;
                this.contents.textColor = ColorManager.getColorByNm("black");
                this.contents.outlineColor = ColorManager.getColorByNm("rgba(255,255,255,0)");
                this.contents.outlineWidth = 0;
                this.contents.fontFace = $gameSystem.numberFontFace();
                if(this._style)
                this[`style${this._style.firstToUpper()}`]();
                this._txt.forEach((line, lineIndex) => {
                    this.contents.drawText(line, 0, this.yLine(lineIndex), this.width - 18,this.lineHeight(), "center");
                });
                this._tick = 0;
            }else{
                this._tick++;
            }
        }else{
            this.contents.clear();
            this._tick = 0;
        }
    }
    yLine(i){
        return i * this.lineHeight() + 8;
    }
}