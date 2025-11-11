

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
 * @plugindesc !SC [v1.0.0] Configuration pour les Actions de personnages.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * SC_CharacterActionConfig.js
 * 
 * Ce fichier de configuration permet de définir des "actions" personnalisées
 * pour les personnages, qui sont des séquences d'animation pouvant être
 * déclenchées par une commande de script.
 *
 * Chaque action est définie avec ses propres paramètres d'animation et de
 * comportement.
 *
 * @param actions
 * @text Liste des Actions
 * @desc Définit la liste des actions personnalisées disponibles pour les personnages.
 * @type struct<Action>[]
 * @default []
 */

/*~struct~Action:fr
 * @param actionName
 * @text Nom de l'Action
 * @desc L'identifiant unique de l'action (ex: mine_ore, salute).
 * @type string
 *
 * @param sheetIndex
 * @text Index de la Feuille de Sprite
 * @desc L'index de la ligne du spritesheet à utiliser pour cette animation (0-7).
 * @type number
 * @min 0
 *
 * @param frames
 * @text Séquence de Frames
 * @desc La séquence des patterns à jouer. Ex: [0, 1, 2, 1]
 * @type number[]
 * @default []
 *
 * @param speed
 * @text Vitesse d'Animation
 * @desc Le nombre de frames de jeu par frame d'animation (plus c'est élevé, plus c'est lent).
 * @type number
 * @min 1
 * @default 15
 *
 * @param loop
 * @text Boucler l'Animation
 * @desc Si activé, l'animation se jouera en boucle jusqu'à être arrêtée manuellement.
 * @type boolean
 * @default false
 *
 * @param blockMovement
 * @text Bloquer le Mouvement
 * @desc Si activé, le personnage ne pourra pas bouger pendant l'animation.
 * @type boolean
 * @default true
 *
 * @param returnToIdle
 * @text Retourner à l'Idle
 * @desc Si activé, le personnage passera à l'animation 'idle' à la fin de l'action. Sinon, il revient à 'walk'.
 * @type boolean
 * @default true
 */

SC.ActionConfigs = SC.ActionConfigs || {};

(() => {
    const script = "SC_CharacterActionConfig";
    const parameters = PluginManager.parameters(script);
    const rawActions = JSON.parse(parameters['actions'] || '[]');

    SC.ActionConfigs.actions = {};

    for (const rawAction of rawActions) {
        const action = JSON.parse(rawAction);
        // On s'assure que chaque frame est bien un nombre pour éviter les problèmes de concaténation.
        action.frames = JSON.parse(action.frames || '[]').map(Number);
        action.sheetIndex = Number(action.sheetIndex);
        action.speed = Number(action.speed);
        action.loop = action.loop === 'true';
        action.blockMovement = action.blockMovement === 'true';
        action.returnToIdle = action.returnToIdle === 'true';
        SC.ActionConfigs.actions[action.actionName] = action;
    }

})();

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_CharacterActionConfig",
    version: "1.0.0",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"]
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
