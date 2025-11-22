/**
 * ╔════════════════════════════════════════╗
 * ║                                        ║
 * ║ ███████╗ ██████╗███████╗ ║
 * ║ ██╔════╝██╔════╝██╔════╝ ║
 * ║ ███████╗██║     █████╗ ║
 * ║ ╚════██║██║     ██╔══╝ ║
 * ║ ███████║╚██████╗███████╗ ║
 * ║ ╚══════╝ ╚═════╝╚══════╝ ║
 * ║ S I M C R A F T   E N G I N E ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v1.0.0] Patch pour gérer le saut dynamique du joueur.
 * @author SimCraft
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base ActorsHealthManagers
 * @orderAfter ActorsHealthManagers
 *
 * @help
 * GamePlayer_JumpPatch.js
 * 
 * Ce patch étend Game_Player pour permettre un saut dynamique dont la
 * distance dépend de l'élan accumulé.
 * 
 * Il écoute l'input 'jump' (à configurer dans le gestionnaire d'inputs)
 * et interagit avec l'ActorHealthManager pour valider et exécuter le saut.
 *
 */

(() => {

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

    // --- Plugin Registration ---
    SC._temp = SC._temp || {};
    SC._temp.pluginRegister = {
        name: "SC_GamePlayer_JumpPatch",
        version: "1.0.0",
        icon: "🏃",
        author: "SimCraft",
        license: "CC BY-NC-SA 4.0",
        dependencies: ["SC_SystemLoader", "SC_ActorsHealthManagers"],
        createObj: null,
        save: null
    };
    $simcraftLoader.checkPlugin(SC._temp.pluginRegister);

})();