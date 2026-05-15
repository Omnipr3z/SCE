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

// Sauvegarde de la méthode originale
const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
    _Game_Actor_initMembers.call(this);
    this._visualIndex = null; // Notre nouvel index dynamique
};

Game_Actor.prototype.isVisual = function() {
    const actorData = this.actor();
    if(!actorData.meta)
        DataManager.extractMetadata(actorData);
    // Vérifie si les données de l'acteur existent et si le notetag est présent.
    return !!(actorData && actorData.meta.visual);
};

/**
 * [NOUVEAU] Définit un index de sprite visuel dynamique pour cet acteur.
 * @param {number | null} index Le nouvel index (de 0 à 7), ou null pour revenir à la valeur par défaut.
 */
Game_Actor.prototype.setVisualIndex = function(index) {
    this._visualIndex = index;
};

// Sauvegarde de la méthode originale
const _Game_Actor_characterIndex = Game_Actor.prototype.characterIndex;
Game_Actor.prototype.characterIndex = function() {
    // Si un index visuel dynamique est défini, on le retourne en priorité.
    if (this._visualIndex !== null && this._visualIndex >= 0) {
        return this._visualIndex;
    }
    return 1
    // Sinon, on retourne le comportement par défaut.
    //return _Game_Actor_characterIndex.call(this);
};
Game_CharacterBase.prototype.pattern = function() {
    if(this.actor && this.actor() !== null && this.actor() !== undefined){
        if(this.actor().isVisual()){
            return this._pattern;
        }
    }
    if(this instanceof Game_Player){
        const actor = $gameParty.leader();
        if(actor && actor.isVisual()){
            return this._pattern;
        }
    }
    return this._pattern < 3 ? this._pattern : 1;
};

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