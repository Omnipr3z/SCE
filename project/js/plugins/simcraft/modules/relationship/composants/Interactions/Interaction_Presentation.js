class InteractRel_Presentation extends Interaction_Rel {
    
    constructor(data) {
        data.key = data.key || "presentation";
        data.name = "Se présenter";
        data.category = "entente";
        super(data);
    }

    isEnable() {
        // On vérifie juste qu'on ne s'est pas encore rencontré "physiquement"
        // Même si le PNJ a des stats (réputation), encountered doit être false dans le JSON pour jouer la scène.
        const rel = this.getRelation();
        console.log("presentation");
            console.log(rel);
        return rel && rel.encountered === false;
    }

    interlocGetReact() {
        const rel = this.getRelation(); 
        
        // Récupération de la faction (ou défaut neutre)
        const factionRel = rel.factionKey !== "sans" ? 
                           $relationManager.factionRel(rel.factionKey) : 
                           { charism: { brav: 0, nob: 0 }, diplo: { loyal: 0 } };

        // Récupération du niveau du talent ORATEUR du joueur
        // On suppose une méthode standard, sinon remplace par ta variable
        const oratorLevel = $gamePlayer.talents ? $gamePlayer.talents.orateur : 0; 
        
        console.log(`--- Calcul réaction pour ${rel.id} (Orateur: ${oratorLevel}) ---`);

        // =========================================================
        // 1. CALCUL DES SCORES
        // =========================================================

        // --- SCORE NEUTRE (La voix de la raison) ---
        // Base : 50
        // + Noblesse de la faction (les gens nobles respectent le protocole)
        // + Talent Orateur (Un bon orateur sait se présenter correctement)
        let scoreNeutral = 50; 
        scoreNeutral += (factionRel.charism.nob || 0) / 2;
        scoreNeutral += (oratorLevel * 5); // Ex: Niveau 4 = +20 points


        // --- SCORE HOSTILE (L'agression) ---
        // Augmente avec : Haine personnelle préexistante, Haine de faction, Brutalité faction
        // Diminue avec : Talent Orateur (On calme le jeu)
        let scoreAggro = 0;
        
        // 1. Passif personnel (Le plus important)
        if (rel.entente < 0) scoreAggro += Math.abs(rel.entente) * 2; // La haine compte double
        
        // 2. Passif de Faction
        if (factionRel.diplo.loyal < 0) scoreAggro += Math.abs(factionRel.diplo.loyal);
        if (factionRel.charism.brav > 50) scoreAggro += 20; // Les brutes frappent d'abord
        if (factionRel.charism.nob < 0) scoreAggro += 20;   // Les fourbes aussi

        // 3. Mitigation par l'Orateur (Calmer les esprits)
        // Un bon orateur réduit les chances d'agression
        scoreAggro -= (oratorLevel * 3); 
        if (scoreAggro < 0) scoreAggro = 0;


        // --- SCORE FLIRT / POSITIF ---
        // Augmente avec : Amour préexistant, Talent Orateur (Charme)
        let scoreFlirt = 0;
        
        // 1. Passif personnel (Coup de foudre ou histoire passée)
        if (rel.love > 0) scoreFlirt += rel.love * 4; // L'amour compte quadruple
        
        // 2. Talent Orateur (Le beau parleur)
        // Seulement si le PNJ n'est pas hostile de base (entente >= 0)
        if (rel.entente >= 0) {
            scoreFlirt += (oratorLevel * 4); 
        }

        console.log(`Scores -> Neutre: ${scoreNeutral} | Aggro: ${scoreAggro} | Flirt: ${scoreFlirt}`);

        // =========================================================
        // 2. SÉLECTION
        // =========================================================
        
        const candidates = [
            { type: 'neutral', score: scoreNeutral, classRef: React_Pres_Neutral },
            { type: 'hostile', score: scoreAggro,   classRef: React_Pres_Aggro },
            { type: 'flirt',   score: scoreFlirt,   classRef: React_Pres_Flirt }
        ];

        candidates.sort((a, b) => b.score - a.score);
        return candidates[0].classRef;
    }
}

InteractionRegistry.register(InteractRel_Presentation);