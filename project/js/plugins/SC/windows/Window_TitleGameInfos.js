class Window_TitleGameInfos extends Window_Base{
	constructor() {
		const width = Graphics.boxWidth;
		const height = 64;
		super({x:0, y:Graphics.boxHeight - 38, width:width, height:height});
		this._text = '';
		this.refresh();
	}
	setText(text) {
		if (this._text !== text) {
			this._text = text;
			this.refresh();
		}
	};
	clear() {
		this.setText('');
	};
	refresh() {
		this.contents.clear();
		this.updateTextGameInfos();
		this.changeTextColor(ColorManager.gaugeBackColor());
		this.contents.padding = 1;
		this.opacity = 0;
		this.contents.paintOpacity = 200;
		this.contents.outlineWidth = 0;
		this.contents.fontSize = 14;
		
		this.drawText(this._text, 0, 6);
	};
	textPadding(){
		return 0;
	};
	updateTextGameInfos() {
		var _rmVer = Utils.RPGMAKER_VERSION;
		var _title = $dataSystem.gameTitle;
		var _local = $dataSystem.locale;
		var _gameVer = $dataSystem.versionId;
		this.setText(_title + " ver."+ _local.substr(0,2).toUpperCase() + ".1." + _gameVer + " RMMZ Ver." + _rmVer);
	}
}