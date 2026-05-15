//=============================================================================
// Sprite_HudWeapons.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [SimCraft] Module du HUD pour l'affichage des armes.
 * @author PAHernandez
 *
 * @help
 * ============================================================================
 * Historique
 * ============================================================================
 * v1.1.0 - Migration vers la syntaxe ES6 (Classes) et intégration des hooks
 *          GFS_drawWeapon, GFS_drawMunits, GFS_drawPack.
 * v1.0.0 - Version initiale.
 */

class Sprite_HudWeapons extends Sprite_HudModule {
    initialize() {
        super.initialize();
    }

    // --- GETTERS ---
    getPrimaryWeaponId() {
        return $gamePlayer.GFS_getPlayerArme ? $gamePlayer.GFS_getPlayerArme().id : 0;
    }

    getSecondaryWeaponAId() {
        const leader = $gameParty.leader();
        return (leader && leader.equips()[1] != null) ? leader.equips()[1].id : 1;
    }

    getSecondaryWeaponBId() {
        const leader = $gameParty.leader();
        return (leader && leader.equips()[2] != null) ? leader.equips()[2].id : 1;
    }

    getHp() {
        return $gameParty.leader() ? $gameParty.leader().hp : 0;
    }

    // --- DIRTY CHECKING ---
    getCurrentData() {
        return {
            primaryId: this.getPrimaryWeaponId(),
            secAId: this.getSecondaryWeaponAId(),
            secBId: this.getSecondaryWeaponBId(),
            hp: this.getHp()
        };
    }

    // --- RENDU ---
    drawContent() {
        const primaryId = this.getPrimaryWeaponId();
        
        if (typeof this.GFS_drawWeapon === 'function') {
            this.GFS_drawWeapon(primaryId, 4, 10);
        }
        
        if (primaryId > 5) {
            if (typeof this.GFS_drawMunits === 'function') this.GFS_drawMunits(primaryId, 4, 48);
            if (typeof this.GFS_drawPack === 'function') this.GFS_drawPack(primaryId, 4, 84);
        }

        this.drawText("J", 16, 125, 34, 'center');
        this.drawText("K", 46, 125, 34, 'center');
        
        if (typeof this.drawMapHudLife === 'function') {
            this.drawMapHudLife(64);
        }
    }

    // Méthodes de compatibilité temporaires (hooks)
    GFS_drawWeapon(armeId, x, y) {
        
    }
    GFS_drawMunits(armeId, x, y) {}
    GFS_drawPack(armeId, x, y) {}
    drawMapHudLife(yOffset) {}
}

if (typeof $simcraftLoader !== 'undefined') {
    $simcraftLoader.checkPlugin({
        name: "Sprite_HudWeapons",
        version: "1.1.0",
        description: "Module du HUD pour l'affichage des armes (ES6).",
        requires: ["Sprite_HudModule"]
    });
}
