// --- DISCUSSION PROFONDE (Lore / Secrets) ---
class React_Discuss_Deep extends ReactionBase {
    execute() {
        // On récupère le nom de la faction pour personnaliser le texte
        const factionName = this._relation.factionKey;
        
        console.log(`PNJ : 'Peu de gens s'intéressent à notre histoire... Savez-vous que les ${factionName}...'`);
        console.log("(Le PNJ vous partage des détails fascinants sur sa culture)");
        
        // Gains
        this._relation.changeEntente(8); // Ils apprécient l'écoute
        
        // Gain XP Joueur important en connaissance
        $gamePlayer.interactExp(5, "erudit");
        
        // On pourrait débloquer une entrée de Codex ici
        // $gameSystem.unlockCodex(factionName);
        
        super.execute();
    }
}

// --- DISCUSSION CASUELLE ---
class React_Discuss_Casual extends ReactionBase {
    execute() {
        console.log("PNJ : 'Il fait beau cycle sur cette planète, n'est-ce pas ?'");
        
        this._relation.changeEntente(3);
        $gamePlayer.interactExp(1, "erudit");
        
        super.execute();
    }
}

// --- ENNUI (Le joueur manque de culture ou PNJ fermé) ---
class React_Discuss_Bored extends ReactionBase {
    execute() {
        console.log("PNJ (Bâille) : 'Tout cela est bien fascinant... j'imagine.'");
        
        // Pas de gain, petite perte si on insiste trop
        // Pas d'XP
        console.log("La conversation tourne court.");
        
        super.execute();
    }
}