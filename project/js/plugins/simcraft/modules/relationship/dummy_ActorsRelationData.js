var $dataActorsRel = {
    // CAS 1 : L'Inconnu total (Se base sur la faction et Orateur)
    1: {
        id: 1,
        factionKey: "grok", // Faction brutale
        encountered: false,
        entente: 0,
        love: 0,
        sub: 0
    },
    
    // CAS 2 : L'Ennemie jurée (Pré-défini dans l'histoire)
    // Elle nous déteste (-50) mais on ne l'a jamais vue en face (encountered: false)
    // Même avec un bon niveau d'orateur, le score Aggro sera très haut (50*2 = 100 de base)
    2: {
        id: 2,
        factionKey: "imper",
        encountered: false,
        entente: 0, 
        love: 0,
        sub: 0
    },

    // CAS 3 : L'Admiratrice secrète
    // Elle nous aime déjà (+20 love), la rencontre devrait déclencher le Flirt direct
    3: {
        id: 3,
        factionKey: "elions",
        encountered: false,
        entente: 10,
        love: 20,
        sub: 0
    }
};