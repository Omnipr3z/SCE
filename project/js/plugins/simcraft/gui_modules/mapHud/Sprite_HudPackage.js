//=============================================================================
// Sprite_HudPackage.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [SimCraft] Module du HUD pour l'affichage du sac.
 * @author PAHernandez
 *
 * @help
 * ============================================================================
 * Historique
 * ============================================================================
 * v1.0.0 - Version initiale. Extraction depuis le contrôleur principal.
 */

class Sprite_HudPackage extends Sprite_HudModule {
    initialize() {
        super.initialize();
    }

    // --- GETTERS ---
    getSlotCap() { return $gameParty.GFS_getSlotCapacity ? $gameParty.GFS_getSlotCapacity() : 0; }
    getSlotUsed() { return $gameParty.GFS_getSlotUsed ? $gameParty.GFS_getSlotUsed() : 0; }
    getWeightCap() { return $gameParty.GFS_getWeightCapacity ? $gameParty.GFS_getWeightCapacity() : 0; }
    getWeightUsed() { return $gameParty.GFS_getWeightUsed ? $gameParty.GFS_getWeightUsed() : 0; }
    getItemsCount() { return $gameParty.items().length; }

    getCurrentData() {
        return {
            scap: this.getSlotCap(), sused: this.getSlotUsed(),
            wcap: this.getWeightCap(), wused: this.getWeightUsed(),
            icnt: this.getItemsCount()
        };
    }

    // --- RENDU ---
    drawContent() {
        const numCase = this.getSlotCap();
        const caseWidth = 4;
        const lines = 2; // placeholder for lines calculated by GFS_drawItemsGrid
        const txt = "Weight: " + this.getWeightUsed() + "/" + this.getWeightCap() + "   -   Slots:" + this.getSlotUsed() + "/" + numCase;
        this.drawText(txt, 0, 24 + lines * 32 + 60, caseWidth * 32, 'center');
    }
}

if (typeof $simcraftLoader !== 'undefined') {
    $simcraftLoader.checkPlugin({
        name: "Sprite_HudPackage",
        version: "1.0.0",
        description: "Module du HUD pour l'affichage du sac (ES6).",
        requires: ["Sprite_HudModule"]
    });
}
