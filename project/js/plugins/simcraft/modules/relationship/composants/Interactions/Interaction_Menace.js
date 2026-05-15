class InteractRel_Menacer extends Interaction_Rel {
    
    constructor(data) {
        data.key = data.key || "menacer";
        data.name = "Menacer";
        data.category = "Malice";
        super(data);
    }

    isEnable() {
        // On peut toujours menacer, sauf si le PNJ est déjà mort ou si on est déjà en combat
        return true; 
    }

    interlocGetReact() {
        const rel = this.getRelation(); 
        const factionRel = rel.factionKey !== "sans" ? 
                           $relationManager.factionRel(rel.factionKey) : 
                           $relationManager.defaultFactionData("sans");

        // Talents
        const brigandLv = this.getTalent('brigand');
        const mystiqueLv = this.getTalent('mystique');
        
        // Stats Cible
        const targetBrav = factionRel.charism.brav || 0; // Courage (-100 à 100)
        
        console.log(`--- MENACE sur ${rel.id} (Brigand: ${brigandLv}, Mystique: ${mystiqueLv}) ---`);

        // =========================================================
        // CALCUL DES SCORES
        // =========================================================

        // --- SCORE SOUMISSION (La cible prend peur) ---
        // Base : 30
        // + Talent Brigand (Intimidation physique)
        // + Talent Mystique (Aura effrayante)
        // - Courage de la cible (Bravoure)
        let scoreSub = 30;
        scoreSub += (brigandLv * 6); 
        scoreSub += (mystiqueLv * 3); // Le mystique aide un peu moins que le brigand pur ici
        scoreSub -= (targetBrav / 2); // Les courageux plient moins vite

        // Bonus : Si la faction est "lâche" (Brav < 0), le score monte
        if (targetBrav < 0) scoreSub += Math.abs(targetBrav);


        // --- SCORE COLÈRE / COMBAT (La cible riposte) ---
        // Base : 20
        // + Courage de la cible
        // + Haine déjà existante
        // - Talent Orateur (Une menace bien formulée peut paralyser au lieu d'énerver)
        let scoreFight = 20;
        scoreFight += (targetBrav / 1.5);
        if (rel.entente < 0) scoreFight += Math.abs(rel.entente);
        
        // Un échec critique en intimidation mène souvent au combat
        
        console.log(`Scores -> Soumission: ${scoreSub} | Combat: ${scoreFight}`);

        // =========================================================
        // SÉLECTION
        // =========================================================

        // Si Soumission > Combat, la cible cède
        if (scoreSub >= scoreFight) {
            return React_Menace_Submit;
        } else {
            return React_Menace_Fight;
        }
    }
}

