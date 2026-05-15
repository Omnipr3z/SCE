// --- AMITIÉ FORTE ---
class React_Symp_BestFriends extends ReactionBase {
    execute() {
        console.log("PNJ (Rire) : 'Hahaha ! Vous êtes quelqu'un de bien. À la vôtre !'");
        
        // Gros gain d'entente
        this._relation.changeEntente(10);
        
        // Si l'entente dépasse un seuil (ex: 80), on peut gagner un statut "Ami"
        if (this._relation.entente > 80) {
            // this._relation.status = "FRIEND";
            console.log("Vous devenez proches.");
        }
        
        super.execute();
    }
}

// --- SYMPATHIQUE ---
class React_Symp_Polite extends ReactionBase {
    execute() {
        console.log("PNJ : 'C'est agréable de discuter un peu.'");
        
        this._relation.changeEntente(4);
        super.execute();
    }
}

// --- MALAISANT (Différences culturelles ou échec) ---
class React_Symp_Awkward extends ReactionBase {
    execute() {
        console.log("PNJ : 'Hmm... oui. Bon, je dois y aller.'");
        console.log("(Un silence pesant s'installe)");
        
        // Légère baisse car c'est gênant
        this._relation.changeEntente(-2);
        
        super.execute();
    }
}