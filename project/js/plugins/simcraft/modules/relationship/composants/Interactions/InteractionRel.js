class Interaction_Rel extends InteractionBase {
    
    initMembers(data) {
        super.initMembers(data);
        
        // La clé de l'action (ex: "presentation", "flatter", "insulter")
        this._key = data.key; 

        // Qui agit ? (Par défaut le leader de l'équipe/joueur)
        // Note: Dans RPG Maker, $gameParty.leader().actorId() est souvent plus sûr pour l'ID
        this._actorId = data.actorId || $gameParty.leader().actorId(); 

        // Avec qui ? (L'ID du PNJ cible)
        this._interloc = data.interloc; 
    }

    getTargetGameActor() {
        // Dans RPG Maker, les acteurs sont dans $gameActors
        if (typeof $gameActors !== 'undefined') {
            return $gameActors.actor(this._interloc);
        }
        return null;
    }

    /**
     * Récupère le niveau d'un talent du joueur
     * @param {string} talentKey - 'orateur', 'brigand', 'erudit', 'mystique'
     * @returns {number} Le niveau du talent (0 par défaut)
     */
    getTalent(talentKey) {
        if ($gamePlayer && $gamePlayer.talents && $gamePlayer.talents[talentKey]) {
            return $gamePlayer.talents[talentKey];
        }
        return 0;
    }

    /**
     * Récupère l'objet de relation stocké dans le Manager
     */
    getRelation() {
        if (typeof $relationManager === 'undefined') return null;
        // On cible spécifiquement les actors pour l'instant
        return $relationManager.actorRel(this._interloc);
    }

    /**
     * Méthode placeholder pour déterminer quelle classe de réaction utiliser.
     * C'est la méthode principale que les sous-classes doivent implémenter.
     */
    interlocGetReact() {
        // Pour l'instant, on retourne null ou une classe par défaut si tu veux tester
        return null; 
    }
}