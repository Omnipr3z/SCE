//=============================================================================
// Sprite_HudModule.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [SimCraft] Classe de base pour les modules du HUD de la carte.
 * @author PAHernandez
 *
 * @help
 * ============================================================================
 * Historique
 * ============================================================================
 * v1.1.0 - Migration vers la syntaxe ES6 (Classes).
 * v1.0.0 - Version initiale. Fournit la logique de "Dirty Checking" via 
 *          un cache pour éviter de redessiner à chaque frame.
 */

class Sprite_HudModule extends Sprite {
    initialize() {
        super.initialize();
        this._cache = {};
        this.bitmap = new Bitmap(228, 226); // Taille de base
        this.initGetters();
        this.setupSprites();
        this.fullRefresh();
    }

    setupSprites() {}

    initGetters() {}

    getCurrentData() {
        return {};
    }

    update() {
        super.update();
        if (this.visible && this.bitmap) {
            this.checkCacheAndRefresh();
        }
    }

    checkCacheAndRefresh() {
        const currentData = this.getCurrentData();
        let isDirty = false;

        for (const key in currentData) {
            if (this._cache[key] !== currentData[key]) {
                isDirty = true;
                this._cache[key] = currentData[key];
            }
        }

        if (isDirty) {
            this.fullRefresh();
        }
    }

    forceDirty() {
        this._cache = {};
    }

    fullRefresh() {
        if (this.bitmap) {
            this.bitmap.clear();
            this.drawContent();
        }
    }

    drawContent() {}

    drawText(text, x, y, maxWidth, align) {
        this.bitmap.drawText(text, x, y, maxWidth, this.bitmap.fontSize || 32, align);
    }
    
    systemColor() { 
        return '#ffcc00'; 
    }
    
    gaugeBackColor() { 
        return '#000000'; 
    }
}

if (typeof $simcraftLoader !== 'undefined') {
    $simcraftLoader.checkPlugin({
        name: "Sprite_HudModule",
        version: "1.1.0",
        description: "Classe de base pour les modules du HUD de la carte (ES6).",
        requires: []
    });
}
