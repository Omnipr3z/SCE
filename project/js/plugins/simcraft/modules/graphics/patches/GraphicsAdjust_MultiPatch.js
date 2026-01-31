/**
 * ╔════════════════════════════════════════╗
 * ║                                        ║
 * ║        ███████╗ ██████╗███████╗        ║
 * ║        ██╔════╝██╔════╝██╔════╝        ║
 * ║        ███████╗██║     █████╗          ║
 * ║        ╚════██║██║     ██╔══╝          ║
 * ║        ███████║╚██████╗███████╗        ║
 * ║        ╚══════╝ ╚═════╝╚══════╝        ║
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v1.0.1] Patch pour l'ajustement dynamique des éléments graphiques.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_GraphicsManager
 * @base SC_GraphicsConfig
 * @orderAfter SC_GraphicsManager
 * @orderAfter SC_GraphicsConfig
 *
 * @help
 * GraphicsAdjust_MultiPatch.js
 * 
 * Ce patch fournit un système d'ajustement dynamique pour les éléments
 * graphiques (fenêtres, sprites) en fonction de la résolution actuelle du jeu.
 * Il permet de scaler et positionner les éléments de manière proportionnelle
 * à une résolution de référence.
 *
 * ▸ Fonctions principales :
 *   - `SC.calculateScaledRect`: Calcule les dimensions et positions d'un
 *     rectangle à l'échelle en fonction de la résolution actuelle.
 *   - Surcharge `Window.prototype.move`: Applique la mise à l'échelle
 *     automatiquement à toutes les fenêtres du jeu.
 *   - `Scene_Base.prototype.scaleSprite`: Utilitaire pour scaler des sprites
 *     en plein écran.
 *
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *   - SC_GraphicsManager.js
 *   - SC_GraphicsConfig.js
 *
 * ▸ Historique :
 *   v1.0.1 - 2024-08-04 : Découplage de la résolution de référence de l'UI de la résolution par défaut.
 *   v1.0.0 - 2024-08-03 : Création initiale du patch.
 */

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

SC.calculateScaledRect = function(refX, refY, refWidth, refHeight, refResWidth = SC.GraphicsConfig.uiReferenceResolution.width, refResHeight = SC.GraphicsConfig.uiReferenceResolution.height) {
    // Résolution actuelle du jeu
    const currentWidth  = Graphics.width;
    const currentHeight = Graphics.height;
    

    // Calcul des ratios par rapport à la résolution de référence
    const xRatio = refX / refResWidth;
    const yRatio = refY / refResHeight;
    const widthRatio = refWidth / refResWidth;
    const heightRatio = refHeight / refResHeight;

    // Application des ratios à la résolution actuelle
    let scaledWidth   = Math.round(currentWidth * widthRatio);
    let scaledHeight  = Math.round(currentHeight * heightRatio);
    let scaledX       = Math.round(currentWidth * xRatio);
    let scaledY       = Math.round(currentHeight * yRatio);
    
    const rect = new Rectangle(scaledX, scaledY, scaledWidth, scaledHeight);

    return rect;
};
Scene_Title.prototype.adjustBackground = function() {
    this.scaleSprite(this._backSprite1);
    this.scaleSprite(this._backSprite2);
};
Scene_Base.prototype.createWindowLayer = function() {
    this._windowLayer = new WindowLayer();
    this._windowLayer.x = 0;
    this._windowLayer.y = 0;
    this.addChild(this._windowLayer);
};
const _window_move = Window.prototype.move;
Window.prototype.move = function(x, y, width, height) {
    const rect = SC.calculateScaledRect (x,y,width,height);
    // if(!(SceneManager._scene instanceof Scene_SpaceTravelz))
        _window_move.call(this, rect.x, rect.y, rect.width, rect.height);
    // else
    //     _window_move.call(this, x, y, width, height);
};

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_GraphicsAdjust_MultiPatch",
    version: "1.0.1",
    icon: "📏",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_GraphicsManager", "SC_GraphicsConfig"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);