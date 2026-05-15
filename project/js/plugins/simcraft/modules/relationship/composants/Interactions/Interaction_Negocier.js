class InteractRel_Negocier extends Interaction_Rel {
    
    constructor(data) {
        data.key = data.key || "negocier";
        super(data);
    }

    isEnable() {
        // On ne négocie pas avec un ennemi ou quelqu'un qu'on n'a pas rencontré
        const rel = this.getRelation();
        // On limite la négoce max à 50% pour ne pas casser le jeu
        return rel && rel.entente > -20 && rel.negoce < 50; 
    }

    interlocGetReact() {
        const rel = this.getRelation(); 
        const factionRel = rel.factionKey !== "sans" ? 
                           $relationManager.factionRel(rel.factionKey) : 
                           $relationManager.defaultFactionData("sans");

        // Talents
        const orateurLv = this.getTalent('orateur');
        const eruditLv = this.getTalent('erudit'); // Connaître les prix du marché aide

        console.log(`--- NÉGOCIATION avec ${rel.id} (Négoce actuel: ${rel.negoce}%) ---`);

        // =========================================================
        // CALCUL DES SCORES
        // =========================================================

        // --- SCORE PERSUASION (Le joueur) ---
        // Base : 30
        let scorePersuade = 30;
        scorePersuade += (orateurLv * 5); 
        scorePersuade += (eruditLv * 2); // Bonus mineur
        scorePersuade += (rel.entente / 5); // Les amis font des prix d'amis

        // --- SCORE AVARICE (Le PNJ) ---
        // Base : 40 + le niveau actuel de négoce (plus on a déjà gratté, plus c'est dur de gratter plus)
        let scoreGreed = 40 + rel.negoce;
        
        // Faction : La Ligue Marchande est très dure en affaires
        if (factionRel.key === 'league') scoreGreed += 30;
        
        // Faction : Les factions nobles (Imperium, Eleris) n'aiment pas les marchands de tapis
        if (factionRel.charism.nob > 50) scoreGreed += 10;

        // Faction : Convivialité (Si < 0, ils lâchent rien)
        if (factionRel.charism.conv < 0) scoreGreed += Math.abs(factionRel.charism.conv);

        console.log(`Scores -> Persuasion: ${scorePersuade} | Avarice: ${scoreGreed}`);

        // =========================================================
        // SÉLECTION
        // =========================================================

        if (scorePersuade >= scoreGreed) {
            return React_Negoce_Success;
        } else {
            return React_Negoce_Fail;
        }
    }
}