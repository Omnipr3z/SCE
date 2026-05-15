class InteractRel_Discuter extends Interaction_Rel {
    
    constructor(data) {
        data.key = data.key || "discuter";
        super(data);
    }

    isEnable() {
        // On ne discute pas avec quelqu'un qui nous déteste vraiment
        const rel = this.getRelation();
        return rel && rel.entente > -20; 
    }

    interlocGetReact() {
        const rel = this.getRelation(); 
        const factionRel = rel.factionKey !== "sans" ? 
                           $relationManager.factionRel(rel.factionKey) : 
                           $relationManager.defaultFactionData("sans");

        // Talents
        const eruditLv = this.getTalent('erudit');
        
        console.log(`--- DISCUSSION avec ${rel.id} (Érudit: ${eruditLv}) ---`);

        // =========================================================
        // CALCUL DES SCORES
        // =========================================================

        // --- SCORE INTÉRÊT (Qualité de la conversation) ---
        // Base : 30
        // + Talent Érudit (On pose des questions pertinentes)
        // + Convivialité de la faction (conv)
        let scoreInterest = 30;
        scoreInterest += (eruditLv * 5); 
        scoreInterest += (factionRel.charism.conv / 4); // Si < 0 (colérique), ça baisse le score

        // Bonus : Si la faction est "Intelligente" (Eleris, Elions, Atronis)
        // Le talent Érudit compte double car ils aiment le savoir
        if (['eleris', 'elions', 'atronis'].includes(factionRel.key)) {
            scoreInterest += (eruditLv * 3);
        }

        // --- SEUILS DE QUALITÉ ---
        // Contrairement aux autres, ici on mesure la PROFONDEUR de la discussion
        
        if (scoreInterest >= 60) {
            return React_Discuss_Deep; // Révélation / Lore
        } else if (scoreInterest >= 20) {
            return React_Discuss_Casual; // Discussion normale
        } else {
            return React_Discuss_Bored; // Ennui
        }
    }
}