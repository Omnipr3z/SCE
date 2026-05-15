Game_Player.prototype.actor = function() {
    return $gameParty.leader();
};
const _Game_Player_canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function() {
    const manager = this.getAnimManager();
    if (manager && manager._isActionPlaying && manager._currentAction.blockMovement) {
        return false; // Ne peut pas bouger si une action bloquante est en cours.
    }
    return _Game_Player_canMove.call(this);
};

 const _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        // Call original method first to handle standard movement
        _Game_Player_moveByInput.call(this);

        // Then, check for our custom jump input
        if (this.canMove() && Input.isTriggered('jump')) {
            this.triggerDynamicJump();
        }
    };

    /**
     * [NEW] Triggers the dynamic jump sequence.
     */
    Game_Player.prototype.triggerDynamicJump = function() {
        $debugTool.log("[Jump] Attempting dynamic jump.", true);

        if (this.isJumping()) {
            $debugTool.log("[Jump] Failed: Already jumping.", true);
            return;
        }

        const actor = this.actor();
        if (!actor) {
            $debugTool.log("[Jump] Failed: No player actor found.", true);
            return;
        }

        const healthManager = $actorHealthManagers.manager(actor.actorId(), true);
        if (!healthManager) {
            $debugTool.log(`[Jump] Failed: No health manager for actor ${actor.actorId()}.`, true);
            return;
        }
        
        if (!healthManager.canJump()) {
            $debugTool.log(`[Jump] Failed: Actor ${actor.actorId()} cannot jump (not enough breath: ${healthManager.getBreath()}).`, true);
            return;
        }

        // All checks passed, proceed with the jump
        const distance = healthManager.calculateJumpDistance();
        const direction = this.direction();
        $debugTool.log(`[Jump] Checks passed. Impulse: ${healthManager._impulse}, Calculated distance: ${distance}`, true);

        // The jump method takes deltaX and deltaY as arguments
        const dx = direction === 6 ? distance : direction === 4 ? -distance : 0;
        const dy = direction === 2 ? distance : direction === 8 ? -distance : 0;
        $debugTool.log(`[Jump] Executing jump with dx: ${dx}, dy: ${dy}`);

        // The core jump method handles impassable tiles.
        this.jump(dx, dy);

        // Notify the health manager that the jump occurred to update stats
        healthManager.onJump();
        $debugTool.log(`[Jump] onJump() called. New breath: ${healthManager.getBreath()}`, true);
    };