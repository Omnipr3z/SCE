// ==============================================================================
// INTERACTION BASE (Interface Logique)
// ==============================================================================

class InteractionBase {
    /**
     * @param {Object} data - Les données de configuration de l'interaction
     */
    constructor(data) {
        this.initMembers(data);
    }

    /**
     * Initialise les propriétés. À surcharger (override) par les enfants.
     */
    initMembers(data) {
        this._data = data || {};
        this.name = data.name || "Interaction";
        this.category = data.category || "divers";
        this._success = false;
    }

    /**
     * Lance l'interaction. C'est la méthode à appeler de l'extérieur.
     */
    start() {
        // On vérifie les conditions (coût, état, prérequis)
        if (this.isEnable()) {
            this.performAction();
        } else {
            this.performDisable();
        }
    }

    /**
     * Vérifie si l'interaction est possible.
     * @returns {boolean}
     */
    isEnable() {
        return true; // Par défaut, c'est toujours possible
    }

    /**
     * Logique principale si l'interaction réussit/se lance.
     */
    performAction() {
        console.log("Action générique exécutée.");
        this._success = true;
    }

    /**
     * Logique si l'interaction est bloquée (feedback utilisateur, son d'erreur, etc.)
     */
    performDisable() {
        console.log("Action impossible.");
        this._success = false;
    }
}