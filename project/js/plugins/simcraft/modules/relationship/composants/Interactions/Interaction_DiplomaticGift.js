// ==============================================================================
// EXEMPLE CONCRET : OFFRIR UN CADEAU
// ==============================================================================
/**
 * Ce module représente une interaction où le joueur peut offrir un cadeau à une faction ou un acteur pour améliorer la relation.
 * 
 * La classe Interaction_DiplomaticGift hérite de Interaction_Rel, qui gère les aspects généraux des interactions relationnelles (coûts, vérifications, etc.).
 * 
 * Configuration de l'interaction (provenant peut-être d'un fichier JSON ou de l'UI)
 * const dataInteraction = {
 *     targetId: 'rebels',
 *     targetType: 'factions',
 *     cost: {
 *         gold: 500 // Ça coûte 500 crédits
 *     },
 *     params: {
 *         power: 10 // Ça rapporte 10 points
 *     }
 * };
 *
 * 1. Instanciation
 * const action = new Interaction_DiplomaticGift(dataInteraction);
 *
 * 2. Lancement
 * Le système va vérifier l'argent (.isEnable), payer (.payCost) 
 * et appliquer le bonus (.performAction) ou refuser (.performDisable).
 * action.start();
 *
 */

class Interaction_DiplomaticGift extends Interaction_Rel {
    
    performAction() {
        // 1. On paye (géré par le parent)
        super.performAction();

        // 2. On récupère la relation
        const rel = this.getRelation();
        
        // 3. Calcul de l'effet
        // La puissance du cadeau dépend des params envoyés
        const impact = this.params.power || 5; 

        // 4. On modifie les valeurs (selon qu'il s'agisse d'une Faction ou d'un Acteur)
        if (this.targetType === 'factions') {
            // Pour une faction, ça monte la loyauté
            rel.diplo.loyal += impact;
            console.log(`Cadeau envoyé à ${rel.name}. Loyauté +${impact} (Total: ${rel.diplo.loyal})`);
        } else {
            // Pour un acteur, ça monte l'entente
            rel.changeEntente(impact); // Supposant que la méthode existe dans Game_ActorsRelation
            console.log(`Cadeau offert à l'acteur ${rel.id}. Entente +${impact}`);
        }

        // 5. Feedback visuel (Optionnel)
        // $gameMessage.add("Ils ont apprécié votre présent.");
    }
}