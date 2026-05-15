/**
 * Gère les méthodes et propriétés d'une relation avec une Faction
 */
class Game_FactionsRelation {
    constructor(data) {
        this._data = data;
        this.key = data.key;
        this.name = data.name;
        this.charism = data.charism;
        this.diplo = data.diplo;
        this.menace = data.menace;
        this.interact = data.interact;
    }

    // Exemple : Vérifier si la faction est hostile envers une autre
    isHostileTo(otherFactionKey) {
        // On vérifie si la clé existe dans la liste 'interact'
        if (this.interact.hasOwnProperty(otherFactionKey)) {
            return this.interact[otherFactionKey] < -50; // Seuil arbitraire d'hostilité
        }
        return false;
    }

    // Exemple : Augmenter la corruption
    addCorruption(amount) {
        this.menace.corrupt += amount;
    }
}