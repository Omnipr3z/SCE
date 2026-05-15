//=============================================================================
// Window_MapHud.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [SimCraft] Refonte du HUD de la carte avec Sprites et Listener (Cache Tampon).
 * @author PAHernandez
 *
 * @help
 * ============================================================================
 * Historique
 * ============================================================================
 * v1.3.0 - Séparation des classes de modules dans des fichiers distincts.
 * v1.2.0 - Migration vers la syntaxe ES6 (Classes, extends, super).
 * v1.1.0 - Refonte complète. Remplacement de Window_Base par Sprite.
 *          Séparation des blocs logiques (Stats, Weapons, Package, Minimap).
 *          Utilisation de getters pour l'abstraction des données RMMV.
 *          Implémentation d'un système de rafraîchissement basé sur un cache
 *          (dirty checking) au lieu du tick continu pour optimiser les perfs.
 * v1.0.0 - Version initiale.
 */

//=============================================================================
// Window_MapHud (Main Controller Sprite)
//=============================================================================
class Window_MapHud extends Sprite {
    initialize() {
        super.initialize();
        this.initDimensions();
        this.hud_content = -1;
        
        // Instanciation des modules (chargés via leurs propres fichiers)
        this._modules = {
            1: new Sprite_HudStats(),
            2: new Sprite_HudWeapons(),
            3: new Sprite_HudPackage(),
            4: new Sprite_HudMinimap()
        };
        
        for (const key in this._modules) {
            this._modules[key].visible = false;
            this.addChild(this._modules[key]);
        }
    }

    initDimensions() {
        this.hud_x = this.getOutHudPosX();
        this.hud_y = this.getOutHudPosY();
        this.hud_xDest = this.getInHudPosX();
        this.hud_yDest = this.getInHudPosY();
        this.x = this.hud_x;
        this.y = this.hud_y;
    }

    // API Getters
    getMapHudMoveSpeed() { return 50; }
    getInHudPosX() { return 0; }
    getInHudPosY() { return 0; }
    getOutHudPosX() { return -300; }
    getOutHudPosY() { return 0; }
    getForcedContent() { return $gameSystem.getMapHudForcedContent ? $gameSystem.getMapHudForcedContent() : 0; }

    isHudOut() { return this.x === this.getOutHudPosX() && this.y === this.getOutHudPosY(); }
    isHudIn() { return this.x === this.getInHudPosX() && this.y === this.getInHudPosY(); }

    setMoveOutHud() {
        this.hud_xDest = this.getOutHudPosX();
        this.hud_yDest = this.getOutHudPosY();
    }
    
    setMoveInHud() {
        this.hud_xDest = this.getInHudPosX();
        this.hud_yDest = this.getInHudPosY();
    }

    update() {
        super.update();
        this.refreshPosition();
        this.refreshHudChange();
    }

    refreshHudChange() {
        const targetContent = this.getForcedContent();
        if (this.hud_content !== targetContent) {
            if (this.isHudOut()) {
                this.hud_content = targetContent;
                this.visible = true;
                this.setMoveInHud();
                this.updateModulesVisibility();
            } else if (this.isHudIn()) {
                this.setMoveOutHud();
            }
        }
    }

    updateModulesVisibility() {
        for (const key in this._modules) {
            this._modules[key].visible = (Number(key) === this.hud_content);
            if (this._modules[key].visible) {
                this._modules[key].forceDirty();
            }
        }
    }

    refreshPosition() {
        const spd = this.getMapHudMoveSpeed();
        if (this.x !== this.hud_xDest) {
            const d = this.hud_xDest - this.x;
            this.x += Math.sign(d) * Math.min(spd, Math.abs(d));
        }
        if (this.y !== this.hud_yDest) {
            const d = this.hud_yDest - this.y;
            this.y += Math.sign(d) * Math.min(spd, Math.abs(d));
        }
    }
}

//=============================================================================
// Window_MapHud2 (Overlay Mask & Rad Gauges)
//=============================================================================
class Window_MapHud2 extends Sprite {
    initialize() {
        super.initialize();
        this.bitmap = new Bitmap(1280, 720); // Fullscreen overlay
        this.radTimer = 0;
        this._cache = {};
    }

    // Getters
    getMenuVisible() { return $gameSystem.mapHudMenuVisible ? $gameSystem.mapHudMenuVisible() : 0; }
    getActionPoints() { return $gamePlayer.ptsAction || 0; }
    getRadZone() { return $gameSystem._radZone || 0; }

    update() {
        super.update();
        const vis = this.getMenuVisible();
        if (vis > 0 && vis < 5) {
            this.visible = true;
            this.checkCacheAndRefresh();
        } else {
            this.visible = false;
        }
    }

    checkCacheAndRefresh() {
        if (this.radTimer > 0) {
            this.radTimer--;
        } else {
            this.radTimer = 18;
            this.radIndex = this.getRadZone() + Math.round(Math.random());
            this._cache.radIndex = -1; // Force dirty for rad
        }

        const currentPts = this.getActionPoints();
        if (this._cache.ptsAction !== currentPts || this._cache.radIndex !== this.radIndex) {
            this._cache.ptsAction = currentPts;
            this._cache.radIndex = this.radIndex;
            this.refreshHud();
        }
    }

    refreshHud() {
        this.bitmap.clear();
        this.refreshHudMask();
        this.refreshRadGauges();
    }

    refreshHudMask() {
        const layout = ImageManager.loadMapHud("layout");
        if(layout) this.bitmap.blt(layout, 0, 0, layout.width, layout.height, 0, 0);
        
        const actionLed = ImageManager.loadMapHud("actionLed");
        const pts = this.getActionPoints();
        if(actionLed) {
            for (let i = 1; i < pts; i++) {
                this.bitmap.blt(actionLed, 0, 0, actionLed.width, actionLed.height, 233 - i * 8, 193);
            }
        }
    }

    refreshRadGauges() {
        const width = 6, height = 12, nbrLine = 3;
        const rad = ImageManager.loadMapHud('radiation');
        if(!rad) return;
        const sx = (this.radIndex % nbrLine) * width;
        const sy = Math.floor(this.radIndex / nbrLine) * height;
        this.bitmap.blt(rad, sx, sy, width / 2, height, 13, 134);
    }
}

// SimCraft Module registration
if (typeof $simcraftLoader !== 'undefined') {
    $simcraftLoader.checkPlugin({
        name: "Window_MapHud",
        version: "1.3.0",
        description: "Contrôleur principal du HUD de la carte (ES6).",
        requires: [
            "Sprite_HudModule",
            "Sprite_HudStats",
            "Sprite_HudWeapons",
            "Sprite_HudPackage",
            "Sprite_HudMinimap"
        ]
    });
}
