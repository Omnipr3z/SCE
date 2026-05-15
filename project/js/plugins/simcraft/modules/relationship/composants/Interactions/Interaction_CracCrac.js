class InteractRel_CracCrac extends Interaction_Rel {
    
    constructor(data) {
        data.key = data.key || "craccrac"; // Nom de code interne
        super(data);
    }

    isEnable() {
        // On ne propose pas ça à un inconnu
        const rel = this.getRelation();
        return rel && rel.love > 10; // Il faut au moins un début d'intérêt
    }

    interlocGetReact() {
        const rel = this.getRelation(); 
        
        console.log(`--- PROPOSITION CRAC-CRAC sur ${rel.id} (Love actuel: ${rel.love}) ---`);

        // SEUIL DE RÉUSSITE
        const threshold = 60; // Valeur à ajuster selon la difficulté voulue

        if (rel.love >= threshold) {
            return React_CracCrac_Success;
        } else if (rel.love >= threshold / 2) {
            // Entre 30 et 60 : "Pas encore..."
            return React_CracCrac_Wait;
        } else {
            // En dessous de 30 : "Vous êtes malade ?"
            return React_CracCrac_Reject;
        }
    }
}