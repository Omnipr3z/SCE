// Sauvegarde de la méthode originale de RMMZ qui préserve le ratio.
const _Scene_Base_scaleSprite = Scene_Base.prototype.scaleSprite;
Scene_Base.prototype.scaleSprite = function(sprite) {
    // Si l'option est activée, on étire le sprite pour remplir l'écran (peut déformer).
    if (SC.GraphicsConfig && SC.GraphicsConfig.fullSpriteScaling) {
        const ratioX = Graphics.width / sprite.bitmap.width;
        const ratioY = Graphics.height / sprite.bitmap.height;
        sprite.scale.x = ratioX;
        sprite.scale.y = ratioY;
    } else {
        // Sinon, on appelle la méthode originale qui préserve le ratio.
        _Scene_Base_scaleSprite.call(this, sprite);
    }
};
Scene_Base.prototype.createWindowLayer = function() {
    this._windowLayer = new WindowLayer();
    this._windowLayer.x = 0;
    this._windowLayer.y = 0;
    this.addChild(this._windowLayer);
};
