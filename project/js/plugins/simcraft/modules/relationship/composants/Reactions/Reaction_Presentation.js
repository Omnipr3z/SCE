// ==============================================================================
// RÉACTIONS SPÉCIFIQUES À LA PRÉSENTATION
// ==============================================================================

class React_Pres_Neutral extends ReactionBase {
    execute() {
        this._dialogManager.showDialogue(this._relation.id, "Salutations, voyageur. Je vous écoute.");
        
        // Petit gain d'entente car on est poli
        this._relation.changeEntente(5);
        super.execute();
    }
}

class React_Pres_Aggro extends ReactionBase {
    execute() {
        this._dialogManager.showDialogue(this._relation.id, "Dégage de ma vue avant que je ne m'énerve !");
        
        // Baisse d'entente
        this._relation.changeEntente(-10);
        
        // Peut déclencher un combat si score très haut ?
        super.execute();
    }
}

class React_Pres_Flirt extends ReactionBase {
    execute() {
        this._dialogManager.showDialogue(this._relation.id, "Tiens donc... Voilà une rencontre intéressante. (Clin d'œil)");
        
        // Gain de Love
        this._relation.love += 5;
        this._relation.changeEntente(5);
        super.execute();
    }
}