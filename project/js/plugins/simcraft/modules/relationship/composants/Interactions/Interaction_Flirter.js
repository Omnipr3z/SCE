class InteractRel_Flirter extends Interaction_Rel {
    
    constructor(data) {
        data.key = data.key || "flirter";
        data.name = "Flirter";
        data.category = "amour";
        super(data);
    }

    isEnable() {
        // On ne peut pas flirter si on est en guerre ouverte (entente < -50)
        // Ou si c'est une espèce incompatible (ex: Vorace), mais gérons ça dans le score pour l'instant.
        const rel = this.getRelation();
        return rel && rel.entente > -50; 
    }

    interlocGetReact() {
        const rel = this.getRelation(); 
        const factionRel = rel.factionKey !== "sans" ? 
                           $relationManager.factionRel(rel.factionKey) : 
                           $relationManager.defaultFactionData("sans");

        // Talent
        const orateurLv = this.getTalent('orateur');
        
        // Bloquer les relations impossibles (Robots, Insectes géants...)
        if (['atronis', 'vorace'].includes(factionRel.key)) {
            return React_Flirt_Impossible;
        }

        console.log(`--- TENTATIVE DE FLIRT sur ${rel.id} (Orateur: ${orateurLv}) ---`);

        // =========================================================
        // CALCUL DES SCORES
        // =========================================================

        // --- SCORE SÉDUCTION (Succès) ---
        // Base : 20
        // + Talent Orateur (Le facteur clé)
        // + Entente existante (Plus facile de séduire un ami)
        // + Love existant (Effet boule de neige)
        let scoreSeduce = 20;
        scoreSeduce += (orateurLv * 6); 
        scoreSeduce += (rel.entente / 4); // 100 entente = +25 pts
        scoreSeduce += (rel.love * 2);    // L'amour appelle l'amour

        // --- SCORE FROIDEUR (Échec / Rejet) ---
        // Base : 40 (C'est dur de séduire à froid)
        // + Noblesse/Rang (Les hauts gradés sont plus distants)
        // - Entente (Si on est amis, la barrière tombe)
        let scoreCold = 40;
        
        // Les factions "Nobles" ou "Militaristes" (Imperium) ont la garde haute
        if (factionRel.charism.nob > 0) scoreCold += (factionRel.charism.nob / 4);
        if (factionRel.charism.rank > 5) scoreCold += 10;

        // Si l'entente est très basse, le rejet est presque assuré
        if (rel.entente < 0) scoreCold += Math.abs(rel.entente);


        console.log(`Scores -> Séduction: ${scoreSeduce} | Froideur: ${scoreCold}`);

        // =========================================================
        // SÉLECTION
        // =========================================================
        
        if (scoreSeduce >= scoreCold) {
            return React_Flirt_Success;
        } else {
            return React_Flirt_Fail; // Le râteau
        }
        }
        }
        
        // Enregistrement de la classe pour la rendre découvrable
        InteractionRegistry.register(InteractRel_Flirter);
        