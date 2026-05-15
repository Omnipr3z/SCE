// ==============================================================================
// INTERACTION REGISTRY
// ==============================================================================

class InteractionManager {
    constructor() {
        this._activeInteractions = [];
    }

    /**
     * Enregistre une classe d'interaction.
     * @param {class} interactionKey - La clef de l'interaction
     * @param {number} npcId - L'ID de l'acteur auquel l'interaction est associée.
     */
    register(interactionKey, npcId) {
        this._activeInteractions[npcId].push(interactionKey);
    }
    remove(interactionKey, npcId) {
        this._activeInteractions[npcId].remove(interactionKey);
    }

    /**
     * Récupère toutes les classes d'interaction enregistrées.
     * @returns {Array<class>}
     */
    static getRegisteredClasses(npcId) {
        if(!this._interactionClasses[npcId])
            this._interactionClasses[npcId] = ["Presentation"];

        return this._interactionClasses[npcId] || [];
    }
}

// Initialisation statique
InteractionRegistry.initialize();
