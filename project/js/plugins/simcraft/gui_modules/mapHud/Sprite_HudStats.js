//=============================================================================
// Sprite_HudStats.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [SimCraft] Module du HUD pour l'affichage des statistiques et de l'XP.
 * @author PAHernandez
 *
 * @help
 * ============================================================================
 * Historique
 * ============================================================================
 * v1.1.0 - Migration vers la syntaxe ES6 (Classes) et intégration des hooks
 *          drawStatsTab, drawHealthTab, drawMapHudLife.
 * v1.0.0 - Version initiale.
 */

class Sprite_HudStats extends Sprite_HudModule {
    initialize() {
        super.initialize();
        this.expVisu = 0;
    }

    // --- GETTERS ---
    getHp() {
        return $gameParty.leader() ? $gameParty.leader().hp : 0;
    }

    getLevel() {
        return $gameParty.leader() ? $gameParty.leader()._level : 0;
    }

    getCurrentExp() {
        return $gameParty.leader() ? $gameParty.leader().currentExp() : 0;
    }

    getNextExp() {
        return $gameParty.leader() ? $gameParty.leader().nextRequiredExp() : 1;
    }

    // --- DIRTY CHECKING ---
    getCurrentData() {
        return {
            hp: this.getHp(),
            level: this.getLevel(),
            currentExp: this.getCurrentExp(),
            nextExp: this.getNextExp(),
            expVisu: this.expVisu
        };
    }

    update() {
        if (this.visible) {
            this.updateExpAnimation();
        }
        super.update();
    }

    updateExpAnimation() {
        const realExp = this.getCurrentExp();
        if (this.expVisu > realExp) {
            this.expVisu = 0;
        } else if (this.expVisu < realExp) {
            this.expVisu += 1;
        }
    }

    // --- RENDU ---
    drawContent() {
        if (typeof this.drawStatsTab === 'function') this.drawStatsTab(-7, 7);
        if (typeof this.drawHealthTab === 'function') this.drawHealthTab(-7, 2);
        if (typeof this.drawMapHudLife === 'function') this.drawMapHudLife(0);
        
        const lvl = this.getLevel();
        const current = this.expVisu;
        const nextLvl = this.getNextExp();
        const txt = " Lvl:" + lvl + "   Exp:" + current + "   Next lvl at:" + nextLvl;
        
        const width = 180;
        const fillW = width * (current / (nextLvl + current));
        
        this.bitmap.fillRect(15, 143, width + 2, 4, this.gaugeBackColor());
        this.bitmap.fillRect(16, 144, fillW, 2, this.systemColor());
        
        this.bitmap.textColor = this.systemColor();
        this.drawText(txt, 16, 138, width, 'left');
    }

    // Méthodes de compatibilité temporaires (hooks)
    drawStatsTab(x, y) {}
    drawHealthTab(x, y) {}
    drawMapHudLife(yOffset) {}
}

if (typeof $simcraftLoader !== 'undefined') {
    $simcraftLoader.checkPlugin({
        name: "Sprite_HudStats",
        version: "1.1.0",
        description: "Module du HUD pour les stats (ES6).",
        requires: ["Sprite_HudModule"]
    });
}
