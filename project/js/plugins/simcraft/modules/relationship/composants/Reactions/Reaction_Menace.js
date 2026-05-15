// --- RÉACTIONS ---

class React_Menace_Submit extends ReactionBase {
    execute() {
        console.log("PNJ (Tremblant) : 'D'accord, d'accord ! Ne me faites pas de mal !'");
        
        // Effets
        this._relation.sub += 10; // Gain de domination
        this._relation.entente -= 5; // Mais il nous aime moins
        this._relation.changeEntente(-5);
        
        // Possiblement donner de l'or ou un item ici ?
        // $gameParty.gainGold(10);
        
        super.execute();
    }
}

class React_Menace_Fight extends ReactionBase {
    execute() {
        console.log("PNJ : 'Tu crois me faire peur ? Viens te battre !'");
        
        this._relation.entente -= 20; // Grosse perte de relation
        this._relation.sub -= 5; // Perte de respect car la menace a échoué
        
        // Lancer le combat
        // BattleManager.setup(this._relation.id, true, true);
        // ou $gamePlayer.reserveBattle(...)
        
        super.execute();
    }
}