//=============================================================================
// Sprite_MapHudController.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [SimCraft] Contrôleur principal du HUD de la carte (gère le panneau et l'overlay).
 * @author PAHernandez
 *
 * @help
 * Remplace Window_MapHud et Window_MapHud2.
 * Gère l'animation de glissement du panneau et la commutation des modules.
 */

function Sprite_MapHudController() {
    this.initialize.apply(this, arguments);
}

Sprite_MapHudController.prototype = Object.create(Sprite.prototype);
Sprite_MapHudController.prototype.constructor = Sprite_MapHudController;

Sprite_MapHudController.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initDimensions();
    
    this._currentMode = 0; // 0 = caché
    this._moveSpeed = 50;
    
    this.createOverlay();
    this.createPanel();
    
    this.refreshMode();
};

Sprite_MapHudController.prototype.initDimensions = function() {
    // A remplacer idéalement par des variables scConfig
    this._outX = -300; // Position X cachée (à ajuster selon les vraies valeurs)
    this._outY = 0;
    this._inX = 0;     // Position X visible
    this._inY = 0;
    
    this._targetX = this._outX;
    this._targetY = this._outY;
};

Sprite_MapHudController.prototype.createOverlay = function() {
    // L'équivalent de Window_MapHud2 (masque, points d'action, radiation)
    // Sera implémenté dans un module séparé pour alléger ce fichier.
    // this._overlay = new Sprite_MapOverlay();
    // this.addChild(this._overlay);
};

Sprite_MapHudController.prototype.createPanel = function() {
    this._panel = new Sprite();
    this._panel.x = this._outX;
    this._panel.y = this._outY;
    this.addChild(this._panel);
    
    // Conteneur pour les modules
    this._modules = {};
    
    // Création des modules (on instanciera les vraies classes plus tard)
    // this._modules[1] = new Sprite_HudStats();
    // this._modules[2] = new Sprite_HudWeapons();
    // etc...
    
    // Ajout des modules au panneau (tous cachés par défaut)
    for (const key in this._modules) {
        this._modules[key].visible = false;
        this._panel.addChild(this._modules[key]);
    }
};

Sprite_MapHudController.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updatePosition();
    this.checkModeChange();
};

Sprite_MapHudController.prototype.updatePosition = function() {
    if (this._panel.x !== this._targetX) {
        const d = this._targetX - this._panel.x;
        this._panel.x += Math.sign(d) * Math.min(this._moveSpeed, Math.abs(d));
    }
    if (this._panel.y !== this._targetY) {
        const d = this._targetY - this._panel.y;
        this._panel.y += Math.sign(d) * Math.min(this._moveSpeed, Math.abs(d));
    }
};

Sprite_MapHudController.prototype.checkModeChange = function() {
    const forcedContent = $gameSystem.getMapHudForcedContent ? $gameSystem.getMapHudForcedContent() : 0;
    
    if (this._currentMode !== forcedContent) {
        if (this.isPanelOut()) {
            // Le panneau est rentré, on peut changer le mode et le faire sortir
            this.setMode(forcedContent);
            if (forcedContent > 0) {
                this.slideIn();
            }
        } else if (this.isPanelIn()) {
            // Le panneau est sorti, on le rentre avant de changer le mode
            this.slideOut();
        }
    }
};

Sprite_MapHudController.prototype.isPanelOut = function() {
    return this._panel.x === this._outX && this._panel.y === this._outY;
};

Sprite_MapHudController.prototype.isPanelIn = function() {
    return this._panel.x === this._inX && this._panel.y === this._inY;
};

Sprite_MapHudController.prototype.slideIn = function() {
    this._targetX = this._inX;
    this._targetY = this._inY;
};

Sprite_MapHudController.prototype.slideOut = function() {
    this._targetX = this._outX;
    this._targetY = this._outY;
};

Sprite_MapHudController.prototype.setMode = function(modeId) {
    this._currentMode = modeId;
    this.refreshMode();
};

Sprite_MapHudController.prototype.refreshMode = function() {
    for (const key in this._modules) {
        this._modules[key].visible = (Number(key) === this._currentMode);
        if (this._modules[key].visible) {
             this._modules[key].forceDirty(); // Force un rafraîchissement au prochain update
        }
    }
};


// Enregistrement SCE
if (typeof $simcraftLoader !== 'undefined') {
    $simcraftLoader.checkPlugin({
        name: "Sprite_MapHudController",
        version: "1.0.0",
        description: "Contrôleur principal du HUD de la carte.",
        requires: ["Sprite_HudModule"]
    });
}
