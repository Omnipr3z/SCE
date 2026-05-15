// --- SUCCÈS : BIENVENUE DANS L'ÉQUIPE ---
class React_Recruit_Success extends ReactionBase {
    execute() {
        // On récupère l'offre depuis les data de l'interaction parente
        const offer = this._triggerData.offer;
        const actorId = this._relation.id;

        console.log(`PNJ : 'Marché conclu. Je suis à vos ordres.'`);
        
        // 1. Paiement
        $gameParty.loseGold(offer);
        
        // 2. Intégration à l'équipe
        $gameParty.addActor(actorId);
        
        // 3. Feedback visuel
        // $gameMessage.add(this._relation.name + " a rejoint l'équipe !");
        
        // 4. Boost de relation (On est content d'être payé)
        this._relation.changeEntente(10);
        
        // Optionnel : Si c'est un mercenaire, on note son salaire pour plus tard
        // this._relation.salary = offer; 

        super.execute();
    }
}

// --- HÉSITATION / MARCHANDAGE ---
class React_Recruit_Haggle extends ReactionBase {
    execute() {
        console.log("PNJ : 'C'est une offre intéressante, mais je vaux plus que ça. Revenez avec un peu plus.'");
        
        // Pas de pénalité, juste un refus poli.
        // Le joueur sait qu'il est proche du but.
        
        super.execute();
    }
}

// --- ÉCHEC / INSULTE ---
class React_Recruit_Fail extends ReactionBase {
    execute() {
        console.log("PNJ (Offusqué) : 'Vous plaisantez ? Je ne bougerai pas le petit doigt pour cette somme dérisoire !'");
        
        // Baisse d'entente car l'offre est jugée insultante
        this._relation.changeEntente(-5);
        
        super.execute();
    }
}

// --- PAS ASSEZ D'ARGENT (Check technique) ---
class React_Recruit_NoMoney extends ReactionBase {
    execute() {
        console.log("Système : Vous n'avez pas assez d'or pour faire cette offre.");
        super.execute();
    }
}