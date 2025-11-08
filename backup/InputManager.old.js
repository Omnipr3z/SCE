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
 * @plugindesc !SC [v0.1.1] Gestionnaire d'entrées étendu de SimCraft Engine
 * @author By '0mnipr3z' ©2025 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/simcraft/sce
 * @help InputManager.js
 * 
 *    ██╗███╗   ██╗██████╗ ██╗   ██╗████████╗
 *    ██║████╗  ██║██╔══██╗██║   ██║╚══██╔══╝
 *    ██║██╔██╗ ██║██████╔╝██║   ██║   ██║   
 *    ██║██║╚██╗██║██╔══██╗██║   ██║   ██║   
 *    ██║██║ ╚████║██║  ██║╚██████╔╝   ██║   
 *    ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   
 * 
 * Ce plugin remplace le `keyMapper` de l'objet `Input` natif de RMMZ
 * pour inclure un mapping de touches plus complet (lettres, chiffres, etc.).
 * Il fait partie du SimCraft Engine.
 *
 * ▸ Fonctionnalités Clés :
 *   - Remplace `Input.keyMapper` avec un ensemble de touches étendu.
 *   - Permet d'utiliser des noms de touches (ex: 'a', 'b', 'space') dans
 *     les autres plugins et scripts.
 *
 * ▸ Nécessite :
 *   - SC_SystemLoader.js pour l'objet $simcraftLoader.
 *
 * ▸ Historique :
 *   v0.1.1 - 2025-11-08 : Nettoyage et extension du keyMapper (numpad, flèches, etc.).
 *          - Transformation du keyMapper en nouvelle entité de remappage keyboardMapper.
 *   v0.1.0 - 2025-11-08 : Création initiale et remplacement du keyMapper.
 */

Input.keyboardMapper = {
    // --- Touches de base ---
    9: "tab",               // tab
    13: "enter",            // enter
    16: "shft",             // shift
    17: "ctrl",             // control
    18: "alt",              // alt
    27: "esc",              // escape
    32: "space",            // space
    33: "page_up",          // pageup
    34: "page_down",        // pagedown
    35: "end",  
    36: "home",
    45: "insert",           // insert
    46: "delete",

    // --- Flèches ---
    37: "left_arrow",    // left arrow
    38: "up_arrow",      // up arrow
    39: "right_arrow",   // right arrow
    40: "down_arrow",    // down arrow

    // --- Lettres ---
    65: 'A', 66: 'B', 67: 'C', 68: 'D', 69: 'E', 70: 'F', 71: 'G', 72: 'H', 73: 'I', 74: 'J', 75: 'K', 76: 'L', 77: 'M', 78: 'N', 79: 'O', 80: 'P', 81: 'Q', 82: 'R', 83: 'S', 84: 'T', 85: 'U', 86: 'V', 87: 'W', 88: 'X', 89: 'Y', 90: 'Z',

    // --- Chiffres (ligne supérieure) ---
    48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',

    // --- Pavé numérique ---
    96: 'numpad_0',
    97: 'numpad_1',
    98: 'numpad_2',
    99: 'numpad_3',
    100: 'numpad_4',
    101: 'numpad_5',
    102: 'numpad_6',
    103: 'numpad_7',
    104: 'numpad_8',
    105: 'numpad_9',
    106: 'numpad_multiply',
    107: 'numpad_add',
    109: 'numpad_subtract',
    110: 'numpad_decimal',
    111: 'numpad_divide',

    // --- Touches de fonction ---
    112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6', 118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
    
    // --- Autres touches ---
    8: 'backspace',
    19: 'pause',
    20: 'capslock',
    186: 'semicolon',
    187: 'equals',
    188: 'comma',
    189: 'minus',
    190: 'period',
    191: 'slash',
    192: 'grave',
    219: 'openbracket',
    220: 'backslash',
    221: 'closebracket',
    222: 'apostrophe'
};

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_InputManager",
    version: "0.1.1",
    icon: "🔠",
    author: "0mnipr3z",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["SC_SystemLoader"],
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
