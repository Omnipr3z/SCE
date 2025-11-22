class Window_ScBase extends Window_Base {
    constructor(rect) {
        super(rect);
    }
    
    styleValues() {
        this.contents.textColor     = ColorManager.textColor(1);
    }
    styleTitle() { 
        this.contents.fontFace      = 'GameFont';
        this.contents.fontSize      = 28;
        this.contents.textColor     = ColorManager.textColor(0);
        this.contents.outlineColor  = ColorManager.textColor(15);
        this.contents.outlineWidth  = 4;
    }
    styleCaptainName() { 
        this.contents.fontFace      = 'GameFont';
        this.contents.fontSize      = 20;
        this.contents.textColor     = ColorManager.textColor(0);
        this.contents.outlineColor  = ColorManager.textColor(15);
        this.contents.outlineWidth  = 4;
    }
    
    styleSubName() { 
        this.contents.fontFace      = 'BaseFont';
        this.contents.fontSize      = 12;
        this.contents.textColor     = ColorManager.textColor(0);
        this.contents.outlineColor  = ColorManager.textColor(15);
        this.contents.outlineWidth  = 1;
    }
    
    styleClassname() { 
        this.contents.fontFace      = 'BaseFont';
        this.contents.fontSize      = 18;
        this.contents.textColor     = ColorManager.textColor(0);
        this.contents.outlineColor  = ColorManager.textColor(15);
        this.contents.outlineWidth  = 4;
    }
    styleGauge() { 
        this.contents.fontFace      = 'BoldFont';
        this.contents.fontSize      = 14;
        this.contents.textColor     = ColorManager.gaugeBackColor();
        this.contents.outlineColor  = ColorManager.hpGaugeColor1();
        this.contents.outlineWidth  = 4;
    }
    resetFontSettings() {
        this.contents.fontFace      = 'BaseFont';
        this.contents.fontSize      = 16;
        this.resetTextColor();
    }
    
    resetTextColor() {
        this.contents.textColor     = ColorManager.textColor(15);
        this.contents.outlineColor  = ColorManager.textColor(0);
        this.contents.outlineWidth  = 1;
        this.contents.outlineOpacity = 0.5;
        
    }
    drawGauge(x, y, width, rate, color1, color2, height = 6,) {
		const fillW = Math.floor(width * rate);

		this.contents.fillRect(x, y, width, height, ColorManager.gaugeBackColor());
		if (rate > 0)
			this.contents.gradientFillRect(x, y, fillW, height, color1, color2);
	}
    
}