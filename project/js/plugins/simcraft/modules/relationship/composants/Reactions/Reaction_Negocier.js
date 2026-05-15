// --- SUCCÈS : RABAIS OBTENU ---
class React_Negoce_Success extends ReactionBase {
    execute() {
        console.log("PNJ (Soupir) : 'Vous êtes dur en affaires... Très bien, je baisse mes prix.'");
        
        // Gain de réduction (entre 5% et 10%)
        const gain = 5 + Math.floor(Math.random() * 6);
        this._relation.negoce += gain;
        
        console.log(`Nouveau rabais acquis : +${gain}% (Total: ${this._relation.negoce}%)`);
        
        // XP
        $gamePlayer.interactExp(2, "orateur");
        
        super.execute();
    }
}

// --- ÉCHEC : LE PNJ SE BRAQUE ---
class React_Negoce_Fail extends ReactionBase {
    execute() {
        console.log("PNJ (Agacé) : 'Mes prix sont fixes. C'est à prendre ou à laisser.'");
        
        // Conséquences : Perte d'entente car on a insisté lourdement
        this._relation.changeEntente(-3);
        
        // Optionnel : On pourrait perdre un peu de bonus de négoce si on échoue lamentablement
        // this._relation.negoce = Math.max(0, this._relation.negoce - 2);

        super.execute();
    }
}