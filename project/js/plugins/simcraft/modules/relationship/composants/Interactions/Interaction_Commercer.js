class InteractRel_Commercer extends Interaction_Rel {
    
    constructor(data) {
        data.key = data.key || "commercer";
        // data.shopGoods doit contenir la liste des items à vendre
        // ex: [[0, 1, 0, 0], [0, 2, 0, 0]] (Format RPG Maker standard pour les shops)
        this.shopGoods = data.shopGoods || []; 
        super(data);
    }

    isEnable() {
        // Le commerce est fermé si entente < -20 (Hostile)
        const rel = this.getRelation();
        return rel && rel.entente > -20;
    }

    /**
     * Surcharge directe de performAction car on n'attend pas vraiment de "Réaction" sociale,
     * on ouvre une interface système.
     */
    performAction() {
        // 1. Animation de base
        this.playerTalk();

        const rel = this.getRelation();
        
        // 2. Calcul du Multiplicateur d'Achat (Buy Rate)
        // 1.0 = 100% du prix. 0.8 = 80% du prix.
        
        // Facteur Entente : Max 20% de reduc pour 100 d'entente
        let ententeBonus = Math.max(0, rel.entente) / 500; 
        
        // Facteur Négoce : Directement le pourcentage stocké
        let negoceBonus = rel.negoce / 100;
        
        // Facteur Malus (Si on est détesté mais pas encore banni du shop)
        let hateMalus = 0;
        if (rel.entente < 0) {
            hateMalus = Math.abs(rel.entente) / 100; // +1% prix par point de colère
        }

        let purchaseRatio = 1.0 - ententeBonus - negoceBonus + hateMalus;
        
        // Cap de sécurité : Prix minimum 50%, Prix max 200%
        purchaseRatio = Math.max(0.5, Math.min(2.0, purchaseRatio));

        console.log(`Ouverture du Shop avec PNJ ${rel.id}. Ratio Prix: ${purchaseRatio.toFixed(2)}`);

        // 3. Ouverture du Shop (Code spécifique moteur de jeu)
        this.openShopInterface(purchaseRatio);

        // 4. Marquer l'interaction comme réussie
        super.performAction(); // Met _success à true
    }

    openShopInterface(ratio) {
        // LOGIQUE MOTEUR (Exemple conceptuel pour RPG Maker)
        // Il faut un plugin ou un script pour appliquer le ratio au Scene_Shop
        // Ici on simule :
        
        if (typeof SceneManager !== 'undefined' && typeof Scene_Shop !== 'undefined') {
            // Préparation des biens
            // Note: Dans une vraie implémentation, on passerait le ratio à une variable globale
            // que le Scene_Shop lirait pour modifier les prix.
            $gameVariables.setValue(15, ratio); // Imaginons que VAR 15 est le ratio shop
            
            SceneManager.push(Scene_Shop);
            // On injecte les biens (goods) dans la scène
            SceneManager.prepareNextScene(this.shopGoods, true); 
        } else {
            console.log("Simulation : Interface Shop ouverte.");
            console.log("Liste des objets : ", this.shopGoods);
        }
    }
    
    // Pas besoin de interlocGetReact() ici
    interlocReact() { return; }
}