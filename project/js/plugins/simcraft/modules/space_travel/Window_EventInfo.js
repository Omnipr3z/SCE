
class Window_EventInfo extends Window_ScBase {
    constructor(rect) {
        super(rect);
        this._news = [];
        this._news.push({txt:"..."}); 
        this._out =  [];
        this._outTimer = 0;
        this.refresh();
    }

    loadWindowskin() {
        this.windowskin = ImageManager.loadSystem("Prompt");
    }
    addNews(text) {
        this._news.push(text);
        this.refresh();
        // if(!this._dotPrepared){
        //     setTimeout(()=>{
        //         this._news.push({txt:"..."}); 
        //         this._dotPrepared = false;
        //         this.refresh()
        //     }, 20000);
        //     this._dotPrepared = true;
        
        // }
        
    }    
    lineHeight(){
        return 20;
    }
    resetFontSettings() {
        this.contents.fontFace      = 'PromptFont';
        this.contents.fontSize      = 18;
        this.contents.textColor     = "rgb(90,175,90)";
        this.contents.outlineColor  = "rgb(90,175,90)";
        this.contents.outlineWidth  = Math.round(Math.random());
        this.contents.outlineOpacity = 0.1;
    }
    updateOut() {
        if(this._outTimer <= 0  && this._news.length > 0){
            const newsItem = this._news.shift();
            if (newsItem)
                this._out.push(newsItem);
            this._outTimer = 300;
        }else{
            this._outTimer--;
        }

    }
    refresh() {
        this.contents.clear();
        this.updateOut()

        const lineHeight = this.lineHeight();
        const maxLines = Math.floor(this.contents.height / lineHeight);
        
        let i = 0
        this._out.clone().reverse().forEach((actu)=>{

            if(i <= maxLines) {
                this.resetFontSettings();
                let y = this.contents.height - (i * lineHeight)- lineHeight;
                let entete = ">";
                this.updateStyle(actu.style);
                if(i == 0){
                    entete = this.updateEntete();
                    this.updateStyle("first");
                    y -= 4;
                    
                } else{
                    y -= 10;
                }
                if(actu.style == "imperium"){
                    this.drawIcon(4, this.contents.width / 2, y);
                }else{
                    this.drawText(entete + actu.txt, 0, y, this.contentsWidth(), 'left');
                }
                i++;
            }
        })
    }
    updateEntete() {
        this._blinkTimer = (this._blinkTimer || 0) + 1;
        if(this._blinkTimer % 30 == 0) this.blink = !this.blink;
        return (this.blink)? "▷ " : "▹ ";
    }
    updateStyle(style) {
        switch(style) {
            case "first":
                this.contents.outlineWidth  += 1;
                this.contents.fontSize      = 24;
                break;
            case "info":
                this.contents.textColor     = "rgb(180,190,80)";
                this.contents.outlineColor  = "rgb(180,190,80)";
                break;
            case "alert":
                this.contents.textColor     = "rgb(175,145,110)";
                this.contents.outlineColor  = "rgb(175,145,110)";
                break;
            default:
                this.resetFontSettings();
                break;
        }
    }
}
