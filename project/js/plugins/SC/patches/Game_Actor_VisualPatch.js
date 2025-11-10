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
 * @plugindesc !SC [v1.0.0] Patch pour la gestion des sprites visuels sur Game_Actor.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * Game_Actor_VisualPatch.js
 * 
 * Ce patch ajoute une méthode `isVisual()` à la classe Game_Actor.
 * Cette méthode permet de déterminer si un acteur doit utiliser le système
 * de sprites dynamiques (paper-doll) en vérifiant la présence du notetag
 * `<visual>` dans sa fiche de la base de données.
 *
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *
 * ▸ Historique :
 *   v1.0.0 - 2024-08-02 : Création initiale du patch.
 */

Game_Actor.prototype.isVisual = function() {

    const actorData = this.actor();
    
        DataManager.extractMetadata(actorData);
    // Vérifie si les données de l'acteur existent et si le notetag est présent.
    return !!(actorData && actorData.meta.visual);
};
Game_Player.prototype.actor = function() {
    return $gameParty.leader();
}
// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Game_Actor_VisualPatch",
    version: "1.0.0",
    icon: "🏷️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"]
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);