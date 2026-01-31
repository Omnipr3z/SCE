// ==============================================================================
// ACTIVITÉ : DORMIR (Exemple)
// ==============================================================================

class SleepActivity extends ActivityBase {
    
    static canUse(actorId) {
        const main = $actorsMainManagers.actor(actorId);
        if (!main || !main.health) return false;
        
        // Exemple de condition : On ne peut dormir que si la forme est < 90%
        // Ou si on force via une interaction (géré par l'event qui appelle startActivity)
        return main.health.getForm() < 100; 
    }

    onStart() {
        const animator = this.mainManager.animator;
        if (animator) {
            // On lance l'animation de sommeil
            // Note: On pourrait aussi lancer une Sequence ici via animator.playSequence('goToBed')
            animator.playAction('sleep');
        }
        
        // Paramètres de régénération (peuvent venir de this._params si c'est un lit de luxe)
        // On reprend les noms de paramètres de l'ancien système pour compatibilité
        this._regenRate = this._params.formIncrease || 0.1;
        this._maxThreshold = this._params.formMaxThreshold || 100;
    }

    update() {
        const health = this.mainManager.health;
        
        // 1. Appliquer les effets
        // Note: Idéalement, ActorHealthManager devrait avoir une méthode addForm(value)
        // Pour l'instant on modifie directement (à adapter selon ton code final de Health)
        if (health) {
            health._form += this._regenRate;
            health._form = health._form.clamp(0, 100);
        }

        // 2. Vérifier les conditions d'arrêt
        // Condition A : Forme au max
        if (health && health.getForm() >= this._maxThreshold) {
            this.finish();
        }

        // Condition B : Le joueur appuie sur une touche (si c'est le joueur)
        if (this._actorId === $gameParty.leader().actorId() && (Input.isTriggered('ok') || Input.isTriggered('cancel'))) {
            this.finish();
        }
    }

    onStop() {
        const animator = this.mainManager.animator;
        if (animator) {
            animator.stopAction(); // Retour à l'idle/walk
        }
    }
}
SC.Activities["sleep"] = SleepActivity;
SC.Activities["dormir"] = SleepActivity; // Alias