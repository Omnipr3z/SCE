class InteractRel_Recruter extends Interaction_Rel {
    
    constructor(data) {
        data.key = data.key || "recruter";
        // data.offer doit contenir le montant proposé par le joueur
        this.offer = data.offer || 0; 
        super(data);
    }

    isEnable() {
        const rel = this.getRelation();
        // Conditions :
        // 1. PNJ pas hostile
        // 2. PNJ pas déjà dans l'équipe
        // 3. Équipe pas pleine (Optionnel, dépend de ton jeu)
        const isInParty = $gameParty.members().some(actor => actor.actorId() === rel.id);
        
        return rel && rel.entente > -10 && !isInParty;
    }

    /**
     * Calcule le "Prix du Marché" (Combien le PNJ estime valoir)
     */
    calculateMarketPrice() {
        const rel = this.getRelation();
        const factionRel = rel.factionKey !== "sans" ? 
                           $relationManager.factionRel(rel.factionKey) : 
                           $relationManager.defaultFactionData("sans");
        
        // Récupération des stats RPG Maker de l'acteur
        const gameActor = $gameActors.actor(rel.id);
        const level = gameActor ? gameActor.level : 1;
        const rank = factionRel.charism.rank || 0; // 0 à 10

        // --- 1. PRIX DE BASE ---
        // Ex: Niveau 10 * 200 = 2000 golds
        // Ex: Rang 5 * 500 = 2500 golds
        let basePrice = (level * 200) + (rank * 500);

        // --- 2. MODIFICATEURS DE RELATION (Rabais) ---
        // Entente : Si entente 100 -> -20%
        const ententeDiscount = Math.max(0, rel.entente) / 500;
        
        // Négoce : Si négoce 20 -> -20%
        const negoceDiscount = rel.negoce / 100;
        
        // Love : Si amour > 50 -> Gros rabais supplémentaire (-20%)
        const loveDiscount = (rel.love > 50) ? 0.2 : 0;

        // Calcul du prix final demandé par le PNJ
        let marketPrice = basePrice * (1.0 - ententeDiscount - negoceDiscount - loveDiscount);
        
        // Prix minimum symbolique (ex: 100 gold pour manger)
        return Math.max(100, Math.floor(marketPrice));
    }

    interlocGetReact() {
        const rel = this.getRelation(); 
        const marketPrice = this.calculateMarketPrice();
        
        // Le joueur a-t-il les moyens ?
        if ($gameParty.gold() < this.offer) {
            return React_Recruit_NoMoney; // "Vous n'avez pas cet argent..."
        }

        console.log(`--- RECRUTEMENT ${rel.id} ---`);
        console.log(`Valeur estimée: ${marketPrice} | Offre Joueur: ${this.offer}`);

        // =========================================================
        // CALCUL DU SCORE D'ACCEPTATION
        // =========================================================
        
        // Ratio de l'offre (Ex: Offre 1500 / Prix 1000 = 1.5 -> 150%)
        let ratio = this.offer / marketPrice;

        // Score de Motivation (Base 0)
        // Si ratio = 1.0 (Prix juste), score = 50
        // Si ratio = 0.5 (Radin), score = 0
        // Si ratio = 2.0 (Généreux), score = 100
        let scoreMotivation = ratio * 50; 

        // Bonus relationnels (Pour compenser une offre basse)
        if (rel.entente > 0) scoreMotivation += (rel.entente / 2); // Amitié
        if (rel.love > 0) scoreMotivation += rel.love; // Amour
        
        // Bonus Faction (Si sa faction est loyale au joueur)
        const factionRel = rel.factionKey !== "sans" ? $relationManager.factionRel(rel.factionKey) : null;
        if (factionRel && factionRel.diplo.loyal > 0) {
            scoreMotivation += (factionRel.diplo.loyal / 2);
        }

        console.log(`Score Motivation: ${scoreMotivation} (Seuil requis: 50)`);

        // =========================================================
        // SÉLECTION
        // =========================================================

        if (scoreMotivation >= 50) {
            return React_Recruit_Success;
        } else if (scoreMotivation >= 30) {
            return React_Recruit_Haggle; // "C'est un peu juste..."
        } else {
            return React_Recruit_Fail; // "C'est une insulte ?"
        }
    }
}