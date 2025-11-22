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
 * @plugindesc !SC [v1.0.0] Patch pour Scene_Map pour mettre à jour Game_Date.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_Game_Date
 * @orderAfter SC_Game_Date
 *
 * @help
 * SceneMap_GameDatePatch.js
 * 
 * Ce patch surcharge la méthode `update` de `Scene_Map` pour y intégrer
 * l'appel à `$gameDate.passTick()`.
 * 
 * Cela permet au temps de s'écouler automatiquement lorsque le joueur est
 * sur la carte, ce qui est la base du système de temps dynamique.
 */

(() => {
    'use strict';

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if ($gameDate) {
            $gameDate.passTick();
        }
    };

})();

// Ce patch modifie une classe du cœur de RMMZ et n'a pas besoin d'enregistrement complexe.
// Sa présence et son ordre de chargement (géré par le nom de fichier) suffisent.