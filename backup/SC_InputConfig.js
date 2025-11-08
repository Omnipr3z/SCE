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
 * @plugindesc !SC [v1.0.0] Configuration des entrées pour SimCraft Engine
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @base SC_SystemLoader
 * @orderAfter SC_SystemLoader
 * 
 * @help
 * SC_InputConfig.js
 * 
 * Ce plugin sert à définir les configurations de touches par défaut pour
 * le SimCraft Engine. Il ne contient aucune logique de jeu mais expose
 * les paramètres du plugin sous forme de constantes globales pour que
 * d'autres modules, comme InputManager, puissent les utiliser.
 * 
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *
 * ▸ Historique :
 *   v1.0.0 - 2024-07-28 : Création initiale du fichier de configuration.
 *
 * @param ok
 * @text Touche OK
 * @desc La touche principale pour l'action 'OK'.
 * @type text
 * @default enter
 *
 * @param cancel
 * @text Touche Annuler
 * @desc La touche principale pour l'action 'Annuler'.
 * @type text
 * @default escape
 *
 * @param shift
 * @text Touche Courir
 * @desc La touche principale pour l'action 'Courir'.
 * @type text
 * @default shift
 *
 * @param menu
 * @text Touche Menu
 * @desc La touche principale pour l'action 'Menu'.
 * @type text
 * @default x
 *
 * @param pageup
 * @text Touche Page Précédente
 * @desc La touche principale pour l'action 'Page Précédente'.
 * @type text
 * @default pageup
 *
 * @param pagedown
 * @text Touche Page Suivante
 * @desc La touche principale pour l'action 'Page Suivante'.
 * @type text
 * @default pagedown
 *
 * @param up
 * @text Touche Haut
 * @desc La touche principale pour le mouvement 'Haut'.
 * @type text
 * @default up
 *
 * @param down
 * @text Touche Bas
 * @desc La touche principale pour le mouvement 'Bas'.
 * @type text
 * @default down
 *
 * @param left
 * @text Touche Gauche
 * @desc La touche principale pour le mouvement 'Gauche'.
 * @type text
 * @default left
 *
 * @param right
 * @text Touche Droite
 * @desc La touche principale pour le mouvement 'Droite'.
 * @type text
 * @default right
 */

var Imported = Imported || {};
Imported.SC_InputConfig = true;

var SC = SC || {};
SC.InputConfig = SC.InputConfig || {};

SC.InputConfig.pluginName = "SC_InputConfig";
SC.InputeConfig.params = PluginManager.parameters(SC.InputConfig.pluginName);

SC.InputConfig.KEY_OK       = SC.InputeConfig.params['ok']       || 'enter';
SC.InputConfig.KEY_CANCEL   = SC.InputeConfig.params['cancel']   || 'escape';
SC.InputConfig.KEY_SHIFT    = SC.InputeConfig.params['shift']    || 'shift';
SC.InputConfig.KEY_MENU     = SC.InputeConfig.params['menu']     || 'x';
SC.InputConfig.KEY_PAGEUP   = SC.InputeConfig.params['pageup']   || 'pageup';
SC.InputConfig.KEY_PAGEDOWN = SC.InputeConfig.params['pagedown'] || 'pagedown';
SC.InputConfig.KEY_UP       = SC.InputeConfig.params['up']       || 'up';
SC.InputConfig.KEY_DOWN     = SC.InputeConfig.params['down']     || 'down';
SC.InputConfig.KEY_LEFT     = SC.InputeConfig.params['left']     || 'left';
SC.InputConfig.KEY_RIGHT    = SC.InputeConfig.params['right']    || 'right';