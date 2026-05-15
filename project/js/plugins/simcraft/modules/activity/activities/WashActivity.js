// ==============================================================================
// ACTIVITÉ : SE LAVER
// ==============================================================================

class WashActivity extends ActivityBase {
    
    static canUse(actorId) {
        const main = $actorsMM.actor(actorId);
        if (!main || !main.health) return false;
        return main.health.getClean() < 100;
    }

    onStart() {
        const animator = this.mainManager.animator;
        if (animator) {
            animator.playAction('wash');
        }
        
        this._regenRate = this._params.cleanIncrease || 0.5;
        this._maxThreshold = this._params.cleanMaxThreshold || 100;
    }

    update() {
        const health = this.mainManager.health;
        
        if (health) {
            health._clean += this._regenRate;
            health._clean = health._clean.clamp(0, 100);
        }

        if (health && health.getClean() >= this._maxThreshold) {
            this.finish();
        }

        if (this._actorId === $gameParty.leader().actorId() && (Input.isTriggered('ok') || Input.isTriggered('cancel'))) {
            this.finish();
        }
    }

    onStop() {
        const animator = this.mainManager.animator;
        if (animator) {
            animator.stopAction();
        }
    }
}


SC.Activities["wash"] = WashActivity;