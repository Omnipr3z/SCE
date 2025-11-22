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
 * @plugindesc !SC [v1.0.1] Patch pour intégrer le gestionnaire d'animations à Scene_Map.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_ActorsAnimsManagers
 * @orderAfter SC_ActorsAnimsManagers
 *
 * @help
 * Scene_Map_AnimPatch.js
 * 
 * Ce patch s'assure que le gestionnaire global d'animations ($gameActorsAnims)
 * est mis à jour à chaque frame de la carte et réinitialisé lors des changements de scène.
 *
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *   - SC_ActorsAnimsManagers.js
 *
 * ▸ Historique :
 *   v1.0.1 - Correction pour inclure la mise à jour des événements d'acteurs.
 *   v1.0.0 - 2024-08-03 : Création initiale du patch.
 */

// Sauvegarde des méthodes originales
const _Scene_Map_update = Scene_Map.prototype.update;
const _Scene_Map_start = Scene_Map.prototype.start;
const _Scene_Map_stop = Scene_Map.prototype.stop;

Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    if ($gameActorsAnims) {
        $gameActorsAnims.update();
    }
};

Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);
    if ($gameActorsAnims) {
        $gameActorsAnims.clear(); // Réinitialise les managers d'acteurs lors du démarrage de la scène
    }
};

Scene_Map.prototype.stop = function() {
    _Scene_Map_stop.call(this);
    // Pas besoin de clear ici, car start() le fera au prochain chargement de carte.
};

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Scene_Map_AnimPatch",
    version: "1.0.1",
    icon: "🗺️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_ActorsAnimsManagers"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);