class InteractRel_Sympathiser extends Interaction_Rel {
    
    constructor(data) {
        data.key = data.key || "sympathiser";
        super(data);
    }

    isEnable() {
        // Il faut être neutre ou positif. On ne sympathise pas avec un ennemi.
        const rel = this.getRelation();
        return rel && rel.entente >= 0; 
    }

    interlocGetReact() {
        const rel = this.getRelation(); 
        const factionRel = rel.factionKey !== "sans" ? 
                           $relationManager.factionRel(rel.factionKey) : 
                           $relationManager.defaultFactionData("sans");
        
        // On récupère la faction du joueur pour comparer
        const playerFactionKey = $relationManager.getPlayerFactionKey(); 

        // Talents
        const orateurLv = this.getTalent('orateur');
        const mystiqueLv = this.getTalent('mystique');
        
        console.log(`--- SYMPATHISER avec ${rel.id} ---`);

        // =========================================================
        // CALCUL DES SCORES
        // =========================================================

        // --- SCORE AMITIÉ ---
        // Base : 30
        let scoreFriend = 30;
        
        // Talents
        scoreFriend += (orateurLv * 3); // Bon raconteur d'histoires
        scoreFriend += (mystiqueLv * 4); // Empathie : on écoute bien
        
        // Affinité de Faction (Géopolitique)
        if (factionRel.key !== playerFactionKey) {
            // Regarder si la faction du PNJ aime la faction du joueur
            // On accède à la matrice 'interact' de la faction du PNJ
            if (factionRel.interact && factionRel.interact[playerFactionKey]) {
                const geopoliticFeeling = factionRel.interact[playerFactionKey];
                // Si géopolitique = 100 -> +25 points
                // Si géopolitique = -100 -> -25 points
                scoreFriend += (geopoliticFeeling / 4);
            }
        } else {
            // Même faction : Bonus automatique
            scoreFriend += 20;
        }

        // Personnalité du PNJ (Convivialité)
        scoreFriend += (factionRel.charism.conv / 2);

        // --- RÉSULTAT ---
        
        if (scoreFriend >= 50) {
            return React_Symp_BestFriends; // "On devrait faire ça plus souvent !"
        } else if (scoreFriend >= 10) {
            return React_Symp_Polite; // "C'était sympa."
        } else {
            return React_Symp_Awkward; // "J'ai du travail..."
        }
    }
}