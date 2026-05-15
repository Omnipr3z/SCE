// ==============================================================================
// ACTIVITÉ : DORMIR (Exemple)
// ==============================================================================

class SleepUpActivity extends ActivityBase {
    
    static canUse(actorId) {
        const main = $actorsMM.actor(actorId);
        if (!main || !main.health) return false;
        
        // Exemple de condition : On ne peut dormir que si la forme est < 90%
        // Ou si on force via une interaction (géré par l'event qui appelle startActivity)
        return main.health.getForm() < 100; 
    }

    onStart() {

        const character = this.mainManager.character;
        if (character) {
            // On lance l'animation de sommeil
            // Note: On pourrait aussi lancer une Sequence ici via animator.playSequence('goToBed')
            character.stopAction();
            character.playAction('sleepUp');
        }

        if(this._params.timeRate){
            $gameDate.setScrollSpeedMode(this._params.timeRate);
        }else{
            $gameDate.setScrollSpeedMode(3);
        }
        
        // Paramètres de régénération (peuvent venir de this._params si c'est un lit de luxe)
        // On reprend les noms de paramètres de l'ancien système pour compatibilité
        this._regenRate = this._params.formIncrease || 1;
        const alea = Math.round(Math.random() * 5);

        this._maxThreshold = this._params.formMaxThreshold + alea || 90 + alea;
        this._maxThreshold.clamp(1,100);

        this.setupHealthChanges();
    }

    setupHealthChanges(){
        const health = this.mainManager.health;
        health._healthChange = {};
        health._healthChange.alim = -0.01;
        health._healthChange.form = this._regenRate;
        health._healthChange.clean = -0.01;
        health._healthChange.hydra =  -0.01;
    }
    update() {
        const health = this.mainManager.health;
        
        // 1. Appliquer les effets
        // Note: Idéalement, ActorHealthManager devrait avoir une méthode addForm(value)
        // Pour l'instant on modifie directement (à adapter selon ton code final de Health)
        if (health) {
            health._form += this._regenRate;
            health._form = health._form.clamp(0, this._maxThreshold);
        }

        // 2. Vérifier les conditions d'arrêt
        // Condition A : Forme au max
        if (health && health.getForm() >= this._maxThreshold) {
            $debugTool.log("ACTION TERMINED");
            this.finish();
        }

        //Mettre un truc pour empecher la fin immédiate !
        // Condition B : Le joueur appuie sur une touche (si c'est le joueur)
        if (this._actorId === $gameParty.leader().actorId() && (Input.isTriggered('cancel') || Input.isTriggered('cancel'))) {
            this.finish();
        }
    }

    onStop() {
        $gameDate.setScrollSpeedMode(1);
    }
}
SC.Activities["sleepUp"] = SleepUpActivity;
SC.Activities["dormirHaut"] = SleepUpActivity;