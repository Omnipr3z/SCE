// ==============================================================================
// CLASSES DE DONNÉES (Wrappers)
// ==============================================================================

/**
 * Gère les méthodes et propriétés d'une relation avec un PNJ
 */
class Game_ActorsRelation {
    constructor(data) {
        this._data = data;
        // Initialisation ou copie des propriétés
        this.id = data.id;
        this.factionKey = data.factionKey;
        this.encountered = data.encountered || false;
        this.entente = data.entente || 0;
        this.love = data.love || 0;
        this.sub = data.sub || 0;
        this.negoce = data.negoce || 0; // Bonus de négociation (en %)
    }

    // Exemple de méthode utilitaire
    changeEntente(amount) {
        this.entente += amount;
        // On pourrait ajouter des caps ici (ex: max 100, min -100)
        console.log(`Relation avec PNJ ${this.id} changée de ${amount}. Total: ${this.entente}`);
    }
    
    setMet() {
        this.encountered = true;
    }
}