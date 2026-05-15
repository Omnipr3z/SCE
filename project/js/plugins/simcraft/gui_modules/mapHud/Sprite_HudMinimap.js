//=============================================================================
// Sprite_HudMinimap.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [SimCraft] Module du HUD pour l'affichage de la minimap.
 * @author PAHernandez
 *
 * @help
 * ============================================================================
 * Historique
 * ============================================================================
 * v1.0.0 - Version initiale. Extraction depuis le contrôleur principal.
 */

class Sprite_HudMinimap extends Sprite_HudModule {
    initialize() {
        super.initialize();
    }

    // --- GETTERS ---
    getMapId() { return $gameMap.mapId(); }
    getPlayerX() { return $gamePlayer.x; }
    getPlayerY() { return $gamePlayer.y; }

    getCurrentData() {
        return { 
            mapId: this.getMapId(), 
            x: this.getPlayerX(), 
            y: this.getPlayerY() 
        };
    }

    // --- RENDU ---
    drawContent() {
        // Hooks for minimap drawing
    }
}

if (typeof $simcraftLoader !== 'undefined') {
    $simcraftLoader.checkPlugin({
        name: "Sprite_HudMinimap",
        version: "1.0.0",
        description: "Module du HUD pour l'affichage de la minimap (ES6).",
        requires: ["Sprite_HudModule"]
    });
}
