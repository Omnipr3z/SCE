/**
 * ╔════════════════════════════════════════╗
 * ║                                        ║
 * ║        ███████╗ ██████╗ ███████╗        ║
 * ║        ██╔════╝██╔════╝ ██╔════╝        ║
 * ║        ███████╗██║     █████╗          ║
 * ║        ╚════██║██║     ██╔══╝          ║
 * ║        ███████║╚██████╗███████╗        ║
 * ║        ╚══════╝ ╚═════╝╚══════╝        ║
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v0.1.0] Sprite pour le 'light layer'.
 * @author By '0mnipr3z' ©2024-2026 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @help Sprite_LightLayer.js
 * 
 * Ce fichier définit la classe Sprite_LightLayer, utilisée par le
 * plugin SC_LightLayer pour afficher une image en superposition sur la carte.
 *
 * --- HISTORIQUE ---
 * v0.1.0 - 2026-01-30 : Version initiale avec effet de pulsation.
 * 
 */

//=============================================================================
// Sprite_LightLayer
//=============================================================================

class Sprite_LightLayer extends Sprite {
    constructor() {
        super();
        this.initialize();
    }
    initialize() {
        super.initialize();
        this._initialX = 0;
        this._initialY = 0;
        this._fadeCounter = 0;
        this.loadBitmap();
    }
    loadBitmap() {
        const lightLayerName = $dataMap.meta.lightLayer;
        if (lightLayerName && typeof lightLayerName === 'string' && lightLayerName !== 'true') {
            this.bitmap = ImageManager.loadParallax(lightLayerName);
            this.bitmap.addLoadListener(() => {
                this.reposition();
            });
        }
    }

    reposition() {
        let x = 0;
        let y = 0;
        const pos = $dataMap.meta.posLightLayer;
        if (pos) {
            const coords = pos.split(',').map(Number);
            x = coords[0] || 0;
            y = coords[1] || 0;
        }
        this._initialX = x * $gameMap.tileWidth();
        this._initialY = y * $gameMap.tileHeight();
    }
    update() {
        super.update();
        if (this.bitmap) {
            this.x = Math.floor(this._initialX - $gameMap.displayX() * $gameMap.tileWidth());
            this.y = Math.floor(this._initialY - $gameMap.displayY() * $gameMap.tileHeight());
            
            this._fadeCounter++;
            const speed = 0.015;
            const amplitude = (this.highOpa - this.lowOpa) / 2;
            const baseOpacity = this.lowOpa + amplitude;
            this.opacity = baseOpacity + amplitude * Math.sin(this._fadeCounter * speed);
        }
    }
    get lowOpa() {
        return 80;
    }
    get highOpa() {
        return 185;
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Sprite_LightLayer",
    version: "0.1.0",
    icon: "✨",
    author: "0mnipr3z",
    license: "CC BY-NC-SA 4.0",
    dependencies: [],
    createObj: {
        autoCreate: false
    }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);