/**
 * ╔════════════════════════════════════════╗
 * ║                                        ║
 * ║        ███████╗ ██████╗ ███████╗        ║
 * ║        ██╔════╝██╔════╝ ██╔════╝        ║
 * ║        ███████╗██║     █████╗          ║
 * ║        ╚════██║██║     ██╔══╝          ║
 * ║        ███████║╚██████╗███████╗        ║
 * ║        ╚══════╝ ╚═════╝╚══════╝        ║
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v0.1.0] Affiche une surcouche graphique sur la carte (light layer).
 * @author By '0mnipr3z' ©2024-2026 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @help LightLayer.js
 * 
 * Ce plugin permet d'afficher une image en superposition sur la carte,
 * qui défile avec elle.
 *
 * --- UTILISATION ---
 * 
 * Ajoutez les notetags suivantes dans les métadonnées de votre carte :
 * 
 * <lightLayer: filename>
 * Remplacez "filename" par le nom du fichier image (sans extension)
 * que vous souhaitez afficher. L'image doit se trouver dans le
 * dossier `img/parallaxes/`.
 * 
 * <posLightLayer: x,y>
 * (Optionnel) Spécifie la position de départ de l'image en coordonnées
 * de cases (tiles). Par défaut, la position est 0,0.
 *
 * --- HISTORIQUE ---
 * v0.1.0 - 2026-01-30 : Version initiale.
 * 
 */

// --- Surcharge de Spriteset_Map ---

const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
    _Spriteset_Map_createLowerLayer.call(this);
    this.createLightLayer();
};

Spriteset_Map.prototype.createLightLayer = function() {
    // La logique de vérification est dans le sprite lui-même,
    // mais on vérifie ici pour ne pas créer d'objet inutilement.
    if(!$dataMap.meta) DataManager.extractMetadata($dataMap);
    if ($dataMap.meta.lightLayer) {
        this._lightLayer = new Sprite_LightLayer();
        this._lightLayer.z = 5; // Au-dessus des tuiles de la carte
        this._tilemap.addChild(this._lightLayer);
    }
};

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_LightLayer",
    version: "0.1.0",
    icon: "💡",
    author: "0mnipr3z",
    license: "CC BY-NC-SA 4.0",
    dependencies: [], // On suppose que Sprite_LightLayer.js est chargé avant via plugins.js
    surchargeClass: "Spriteset_Map",
    autoSave: false
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
