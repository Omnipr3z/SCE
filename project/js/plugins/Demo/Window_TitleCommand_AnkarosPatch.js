Window_TitleCommand.prototype.itemTextAlign = function() {
    return 'center';
};
Window_TitleCommand.prototype.spacing = function() {
    return 40;
};
Window_TitleCommand.prototype.lineHeight = function(){
    return 48;
}


Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.newGame,   'newGame');
    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());

    this.addCommand(TextManager.title_battle,   'newGame');
    this.addCommand(TextManager.title_lore,   'newGame');
    this.addCommand(TextManager.title_credit,   'newGame');


    this.addCommand(TextManager.options,   'options');
};


// Surcharge pour personnaliser le curseur
const _Window_TitleCommand_updateCursor = Window_TitleCommand.prototype._updateCursor;
Window_TitleCommand.prototype._updateCursor = function() {
    _Window_TitleCommand_updateCursor.call(this);
    if (!this._cursorSprite.bitmap || this._cursorSprite.bitmap.url.indexOf("cursor_0") === -1) {
        this._cursorSprite.bitmap = ImageManager.loadBitmap("img/titles2/", "cursor_0");
    }
    // Ajuster la position du curseur si nécessaire
    // this._cursorSprite.x = ...
    // this._cursorSprite.y = ...
};

// Le constructeur en MZ attend un Rectangle
const _Window_TitleCommand_initialize = Window_TitleCommand.prototype.initialize;
Window_TitleCommand.prototype.initialize = function(rect) {
    _Window_TitleCommand_initialize.call(this, rect);
    this.openness = 0;
    this.selectLast();
    this.opacity = 0; // Cache la fenêtre (fond, cadre, etc.)
};