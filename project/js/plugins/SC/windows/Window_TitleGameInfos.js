class Window_TitleGameInfos extends Window_ScBase{
	constructor(rect, needed) {
		super(rect);
		this._needed = needed;
		this._text = '';
		this.opacity = 0;
		this.refresh();
	}
	styleCredits(){
		this.changeTextColor(ColorManager.normalColor());
		this.contents.fontFace = 'GameFont';
		this.contents.padding = 1;
		this.contents.paintOpacity = 200;
		this.contents.outlineWidth = 0;
		this.contents.outlineColor = ColorManager.textColor(12);
		this.contents.fontSize = 16;
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
		if(this._needed){
			this.contents.clear();
			this.resetFontSettings()
			this.styleCredits();
			this.updateTextGameInfos();
			this.drawText(this._text, 0, 6);
		}
	};
	textPadding(){
		return 0;
	};
	updateTextGameInfos() {
		const _rmVer = Utils.RPGMAKER_VERSION;
		const _title = $dataSystem.gameTitle;
		const _local = $dataSystem.locale.substr(0,2).firstToUpper();
		const _gameVer = $dataSystem.versionId;

		const copyright = ' \u00A9';
		const registrated = ' \u00AE';
		const gameInfosTxt = `${_title + copyright} ver.${_local}.1.${_gameVer}`;
		const rmmzInfosTxt = `RMMZ ver.${_rmVer +registrated}`;
		const sceInfosTxt = `${ENGINE_NAME +copyright} ver.${ENGINE_VERSION} ${AUTHOR + copyright}`
		this.setText(`${gameInfosTxt} / ${rmmzInfosTxt} / ${sceInfosTxt}  ------ ${OFFICIAL_SITE}`);
	}
}