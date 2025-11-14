/**
 * ╔════════════════════════════════════════╗
 * ║                                        ║
 * ║        ███████╗ ██████╗███████╗        ║
 * ║        ██╔════╝██╔════╝██╔════╝        ║
 * ║        ███████╗██║     █████╗          ║
 * ║        ╚════██║██║     ██╔══╝          ║
 * ║        ███████║╚██████╗███████╗        ║
 * ║        ╚══════╝ ╚═════╝╚══════╝        ║
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v1.0.0] Patch pour ajouter des commandes d'action à Game_Interpreter.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_Game_Character_ActionPatch
 * @orderAfter SC_Game_Character_ActionPatch
 *
 * @help
 * Game_Interpreter_ActionPatch.js
 * 
 * Ce patch ajoute des méthodes de commodité à Game_Interpreter pour permettre
 * de lancer des animations d'action directement depuis une commande d'événement
 * "Script".
 *
 * ▸ Commandes de Script :
 *
 *   this.playAnim(characterId, animName);
 *   Lance une animation sur un personnage.
 *
 *   this.playAnim(characterId, animName, wait);
 *   Lance une animation et attend sa fin si wait est true.
 *   - characterId : 0 pour cet événement, -1 pour le joueur, ou l'ID d'un autre événement.
 *   - animName : Le nom de l'animation (ex: 'cast').
 *   - wait : (Optionnel) Mettre à `true` pour que l'événement attende la fin de l'animation.
 *
 *   Exemple : this.playAnim(0, 'cast');
 *   Exemple avec attente : this.playAnim(-1, 'slash', true);
 */

Game_Interpreter.prototype.playAnim = function(characterId, animName, wait = false) {
    const character = this.character(characterId);
    if (character) {
        character.anim(animName, waitCallback);
    } else {
        $debugTool.warn(`[playAnim] Personnage avec l'ID ${characterId} non trouvé.`, true);
    }
};

// --- Enregistrement du plugin ---
SC._temp.pluginRegister = {
    name: "SC_Game_Interpreter_ActionPatch",
    version: "1.0.0",
    icon: "📜",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_Game_Character_ActionPatch"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);