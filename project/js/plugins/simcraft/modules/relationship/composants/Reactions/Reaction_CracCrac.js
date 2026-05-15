// --- SUCCÈS : ACTION ! ---
class React_CracCrac_Success extends ReactionBase {
    execute() {
        console.log("PNJ : 'Je pensais que vous ne le demanderiez jamais... Allons dans un endroit discret.'");
        
        // Lancer une Scène (Fade out, Musique, Ellipse...)
        if (typeof $gameTemp !== 'undefined') {
            // $gameTemp.reserveCommonEvent(ID_EVENT_CRACCRAC); 
            // On peut passer l'ID du PNJ via une variable pour personnaliser la scène
            // $gameVariables.setValue(VAR_PARTNER_ID, this._relation.id);
        }

        // Effets post-acte
        this._relation.love += 10; 
        this._relation.changeEntente(10);
        
        // On pourrait mettre un flag "Lover"
        // this._relation.isLover = true; 

        super.execute();
    }
}

// --- ATTENTE : TROP TÔT ---
class React_CracCrac_Wait extends ReactionBase {
    execute() {
        console.log("PNJ : 'C'est tentant... mais ne brûlons pas les étapes. Apprenons à nous connaître encore un peu.'");
        
        // Pas de pénalité, c'est un refus doux
        // Petit gain de flirt car l'intention est validée mais reportée
        this._relation.love += 2;
        
        super.execute();
    }
}

// --- REJET : LA CLAQUE ---
class React_CracCrac_Reject extends ReactionBase {
    execute() {
        console.log("PNJ (Choqué) : 'Pour qui me prenez-vous ?! C'est absolument déplacé !'");
        
        // Grosse pénalité
        this._relation.love = 0; // Tue la romance naissante
        this._relation.changeEntente(-20);
        
        super.execute();
    }
}