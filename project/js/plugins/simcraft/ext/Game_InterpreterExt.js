const _alias_Game_Interpreter_command236 = Game_Interpreter.prototype.command236;
Game_Interpreter.prototype.command236 = function(params) {
    if ($gameWeather) {

        const typeId = params[0];
        const power = params[1];
        const duration = params[2]; // Not directly used by our system in the same way

        let type = "clear";
        switch (typeId) {
            case 1:
                type = "rain";
                break;
            case 2:
                type = "storm";
                break;
            case 3:
                type = "snow";
                break;
        }

        if (type === "clear") {
            $gameWeather.release(60); // Transition back to auto in 60 frames
        } else {
            // Map power (0-9) to intensity (0-255).
            // A simple linear mapping. (power + 1) * 25
            const intensity = Math.min((power + 1) * 25, 255);
            $gameWeather.force(type, intensity, 60); // Force the weather with a 60 frame transition
        }
        
        // We don't call the original function because we are replacing it.
        // We also don't handle the "wait for completion" as our transitions are visual.
        return true;
    } else {
        // If our system is not available, fall back to the original command.
        return _alias_Game_Interpreter_command236.call(this, params);
    }
};
Game_Interpreter.prototype.playAnim = function(characterId, animName, wait = false) {
    const character = this.character(characterId);
    if (character) {
        character.anim(animName, waitCallback);
    } else {
        $debugTool.warn(`[playAnim] Personnage avec l'ID ${characterId} non trouvé.`, true);
    }
};
