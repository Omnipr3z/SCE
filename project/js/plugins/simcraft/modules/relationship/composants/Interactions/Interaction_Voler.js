class InteractRel_Voler extends Interaction_Rel {
    
    constructor(data) {
        data.key = data.key || "voler";
        super(data);
    }

    isEnable() {
        const target = this.getTargetGameActor();
        // On ne peut voler que si l'acteur existe et qu'il a du butin
        // (On suppose que butin() renvoie null ou un objet vide s'il n'a rien)
        return target && typeof target.butin === 'function';
    }

    interlocGetReact() {
        const rel = this.getRelation(); 
        const factionRel = rel.factionKey !== "sans" ? 
                           $relationManager.factionRel(rel.factionKey) : 
                           $relationManager.defaultFactionData("sans");

        // Talents du Joueur
        const brigandLv = this.getTalent('brigand'); // Dextérité
        const mystiqueLv = this.getTalent('mystique'); // Dissimulation / Ombre

        // Stats Cible (Vigilance)
        // On utilise le Rang (hiérarchie) et la Bravoure (combativité/éveil) pour estimer la vigilance
        const targetRank = factionRel.charism.rank || 0;
        const targetBrav = factionRel.charism.brav || 0;

        console.log(`--- TENTATIVE DE VOL sur ${rel.id} ---`);

        // =========================================================
        // CALCUL DES SCORES
        // =========================================================

        // --- SCORE DISCRÉTION (Réussite) ---
        // Base : 40
        // + Talent Brigand (C'est le facteur principal)
        // + Talent Mystique (Aide un peu pour l'invisibilité)
        let scoreSteal = 40;
        scoreSteal += (brigandLv * 8); 
        scoreSteal += (mystiqueLv * 2);


        // --- SCORE VIGILANCE (Échec) ---
        // Base : 30
        // + Rang de la cible (Un chef est mieux gardé/plus attentif)
        // + Bravoure (Les guerriers sont sur le qui-vive)
        let scoreCatch = 30;
        scoreCatch += (targetRank * 5); // Le rang compte beaucoup
        if (targetBrav > 0) scoreCatch += (targetBrav / 4);

        console.log(`Scores -> Vol: ${scoreSteal} | Vigilance: ${scoreCatch}`);

        // =========================================================
        // SÉLECTION
        // =========================================================

        // Si Discrétion >= Vigilance, on vole
        if (scoreSteal >= scoreCatch) {
            return React_Voler_Success;
        } else {
            return React_Voler_Fail;
        }
    }
}