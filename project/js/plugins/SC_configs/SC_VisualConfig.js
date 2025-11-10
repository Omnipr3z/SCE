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
 * @plugindesc !SC [v1.0.0] Configuration pour le système visuel des personnages.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * SC_VisualConfig.js
 * 
 * Ce fichier de configuration définit les dimensions standard pour les
 * spritesheets de personnages utilisés par le système de "paper-doll".
 * 
 * Il expose un objet global `SC.VisualConfig` que les autres modules
 * (comme CharacterVisualManager) peuvent utiliser.
 *
 * @param frameWidth
 * @text Largeur d'une case (frame)
 * @desc La largeur en pixels d'une seule case d'animation.
 * @type number
 * @default 48
 *
 * @param frameHeight
 * @text Hauteur d'une case (frame)
 * @desc La hauteur en pixels d'une seule case d'animation.
 * @type number
 * @default 48
 *
 * @param numColumns
 * @text Nombre de colonnes
 * @desc Le nombre de cases d'animation par ligne (généralement 3 pour la marche).
 * @type number
 * @default 3
 *
 * @param numLines
 * @text Nombre de lignes
 * @desc Le nombre de lignes dans le spritesheet (4 pour les directions, plus pour d'autres animations).
 * @type number
 * @default 4
 */

SC.VisualConfig = SC.VisualConfig || {};

(() => {
    const params = PluginManager.parameters("SC_VisualConfig");
    SC.VisualConfig.frameSize = {
        width: parseInt(params.frameWidth) || 48,
        height: parseInt(params.frameHeight) || 48
    };
    SC.VisualConfig.numColumns = parseInt(params.numColumns) || 3;
    SC.VisualConfig.numLines = parseInt(params.numLines) || 4;

    SC.VisualConfig.bitmapSize = {
        width: SC.VisualConfig.frameSize.width * SC.VisualConfig.numColumns * 3,
        height: SC.VisualConfig.frameSize.height * SC.VisualConfig.numLines * 4
    };
})();