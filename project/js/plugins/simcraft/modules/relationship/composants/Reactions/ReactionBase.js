// ==============================================================================
// BASE DE RÉACTION
// ==============================================================================
class ReactionBase {
    /**
     * @param {DialogManager} dialogManager - L'orchestrateur de dialogue.
     * @param {Game_ActorsRelation} relation - La relation avec le PNJ.
     */
    constructor(dialogManager, relation) {
        this._dialogManager = dialogManager;
        this._relation = relation;
        this.execute();
    }

    execute() {
        // Logique spécifique (Message, changement de variable, animation)
        // C'est maintenant la responsabilité des sous-classes d'appeler le dialogManager.
        
        // IMPORTANT : Une fois la présentation faite, on change l'état "encountered"
        if (this._relation && !this._relation.encountered) {
            this._relation.setMet(); 
        }

        // La logique de base se termine ici.
        // On pourrait imaginer un this._dialogManager.continue() pour gérer le flux.
    }
}

