// =============================================================================
// Window_RelationshipInfo
// =============================================================================
/*:
 * @plugindesc !SC [v1.0.0] Fenêtre affichant les informations de relation.
 * @author SimCraft
 *
 * @help
 * Fenêtre qui affiche le nom, le visage et les jauges de relation
 * (Entente, Amour) pour un acteur donné.
 * Hérite de Window_ScBase pour un style cohérent.
 */

class Window_RelationshipInfo extends Window_ScBase {

    constructor(rect) {
        super(rect);
        this._relationship = null;
    }

    /**
     * Définit la relation à afficher et rafraîchit la fenêtre.
     * @param {Game_ActorsRelation} relationship - L'objet de relation.
     */
    setRelationship(relationship) {
        if (this._relationship === relationship) return;
        this._relationship = relationship;
        this.refresh();
        this.show();
        this.activate();
    }

    /**
     * Efface les données et cache la fenêtre.
     */
    clear() {
        this._relationship = null;
        this.contents.clear();
        this.hide();
        this.deactivate();
    }

    refresh() {
        this.contents.clear();
        if (!this._relationship) return;

        const actor = $gameActors.actor(this._relationship.id);
        if (!actor) return;

        const faceSize = ImageManager.faceWidth;
        const padding = 8;
        const w = (this.contentsWidth() - padding * 2);

        // 1. Dessiner le visage
        this.drawFace(actor.faceName(), actor.faceIndex(), 0, 0, w, w, 80,80);

        // 2. Dessiner le nom
        this.styleTitle();
        this.drawText(actor.name(), 0, 0, w, 'center');
        this.resetFontSettings();
        
        let y = 60; // Position de départ pour les jauges

        // 3. Jauge d'Entente
        this.drawRelationshipGauge("Entente", this._relationship.entente, y, "#ffbb00", "#fffd7a");

        y += 22;

        // 4. Jauge d'Amour
        const loveRate = this._relationship.love / 100;
        this.drawRelationshipGauge("Amour", this._relationship.love, y, "#ff0000", "#ff8282");
    }

    /**
     * Dessine une jauge de relation avec son libellé et sa valeur.
     * @param {string} name - Nom de la jauge.
     * @param {number} value - Valeur actuelle.
     * @param {number} y - Position Y.
     * @param {number} width - Largeur de la jauge.
     * @param {string} color1 - Couleur de début du dégradé.
     * @param {string} color2 - Couleur de fin du dégradé.
     * @param {number} rate - Taux de remplissage (0 à 1).
     */
    drawRelationshipGauge(name, value, y, color1, color2) {
        const x = 8;
        const w = (this.contentsWidth() - x * 2);
        const h =6;

        // Dessiner la jauge
        const rate = value / 100;
        this.drawTwoWaysGauge(x, y, w, rate, color1, color2, h, color1, color2);
        
        // Dessiner le nom et la valeur
        this.styleClassname();
        this.drawText(name + " - " + value, x, y, w, 'center');
        
        this.resetFontSettings();
    }
}
