// --- SUCCÈS : LE CHARME OPÈRE ---
class React_Flirt_Success extends ReactionBase {
    constructor(dialogManager, relation) {
        super(dialogManager, relation);
    }

    execute() {
        this._dialogManager.showDialogue(this._relation.id, "Vous avez une façon de parler très... persuasive.");
        this._dialogManager.showIconEffect(this._relation.id, 'love_up');

        // Gains
        let loveGain = 5;
        if (this._relation.entente > 50) loveGain += 3;
        
        this._relation.love += loveGain;
        this._relation.changeEntente(2);
        
        // XP Orateur (devrait être géré par le DialogManager ou l'Interaction)
        // $gamePlayer.interactExp(2, "orateur");

        super.execute();
    }
}

// --- ÉCHEC : LE RÂTEAU ---
class React_Flirt_Fail extends ReactionBase {
    constructor(dialogManager, relation) {
        super(dialogManager, relation);
    }

    execute() {
        this._dialogManager.showDialogue(this._relation.id, "Gardez vos flatteries pour quelqu'un d'autre.");
        this._dialogManager.showIconEffect(this._relation.id, 'entente_down');
        
        // Pertes
        this._relation.changeEntente(-5);
        
        super.execute();
    }
}

// --- IMPOSSIBLE (Robots/Monstres) ---
class React_Flirt_Impossible extends ReactionBase {
    constructor(dialogManager, relation) {
        super(dialogManager, relation);
    }

    execute() {
        this._dialogManager.showDialogue(this._relation.id, "*Ne semble pas comprendre le concept*");
        
        super.execute();
    }
}