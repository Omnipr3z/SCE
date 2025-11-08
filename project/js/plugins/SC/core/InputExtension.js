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
 * @plugindesc !SC [v1.0.0] Extension du mapping de clavier de RMMZ.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @base SC_SystemLoader
 * @orderAfter JsExtension
 *
 * @help
 * InputExtension.js
 * 
 * Ce module remplace le `Input.keyboardMapper` de base de RMMZ pour
 * inclure un mapping de touches beaucoup plus complet (lettres, pavé
 * numérique, touches de fonction, etc.).
 *
 * Il est essentiel pour que l'InputManager puisse reconnaître une plus
 * grande variété de noms de touches dans les fichiers de configuration.
 *
 * ▸ Historique :
 *   v1.0.0 - 2024-07-29 : Création initiale.
 */

Input.keyboardMapper = {
    // --- Touches de base ---
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'control',
    18: 'alt',
    19: 'pause',
    20: 'capslock',
    27: 'escape',
    32: 'space',
    33: 'pageup',
    34: 'pagedown',
    35: 'end',
    36: 'home',
    45: 'insert',
    46: 'delete',

    // --- Flèches ---
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',

    // --- Lettres ---
    65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z',

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
    112: 'f1', 113: 'f2', 114: 'f3', 115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8', 120: 'f9', 121: 'f10', 122: 'f11', 123: 'f12',

    // --- Autres touches ---
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
    name: "SC_InputExtension",
    version: "1.0.0",
    icon: "⌨️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: [],
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);