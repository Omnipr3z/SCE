





Scene_Title.prototype.createBackground = function() {
    const faction = this.titleFaction();
    this._backSprite1 = new Sprite(ImageManager.loadBitmap("img/titles1/", faction));
    this.addChild(this._backSprite1);
};

Scene_Title.prototype.titleFaction = function(){
    if(!this._titleFaction)
        this._titleFaction = Math.floor(Math.random()*2) +1;
    return String(this._titleFaction)
}

Scene_Title.prototype.createForeground = function() {
    const faction = this.titleFaction();
    this._backSprite2 = new Sprite(ImageManager.loadBitmap("img/titles2/", faction));
    this.addChild(this._backSprite2);
    
    this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    this.addChild(this._gameTitleSprite);

    if ($dataSystem.optDrawTitle) {
        this.drawGameTitle();
    }
};
/**
 * Calcule la position et la taille d'un rectangle pour la résolution actuelle
 * en se basant sur une résolution de référence.
 *
 * @param {number} refX La coordonnée X sur la résolution de référence.
 * @param {number} refY La coordonnée Y sur la résolution de référence.
 * @param {number} refWidth La largeur sur la résolution de référence.
 * @param {number} refHeight La hauteur sur la résolution de référence.
 * @param {number} [refResWidth=1280] La largeur de la résolution de référence.
 * @param {number} [refResHeight=720] La hauteur de la résolution de référence.
 * @returns {Rectangle} Un rectangle avec les valeurs x, y, width, height calculées.
 */

Scene_Title.prototype.commandWindowRect = function() {
    return new Rectangle(952, 425, 291, 270);
};


