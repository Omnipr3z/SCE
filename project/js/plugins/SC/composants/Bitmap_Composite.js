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
 * @plugindesc !SC [v1.0.0] Composant pour la création de bitmaps composites (Paper-doll).
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * 
 * @help
 * Bitmap_Composite.js
 * 
 * Ce composant fournit une classe, Bitmap_Composite, pour faciliter la création
 * de sprites dynamiques en superposant plusieurs images (couches). C'est la
 * base du système "paper-doll" du SimCraft Engine.
 *
 * Il est conçu pour être utilisé par d'autres modules (comme le futur
 * CharacterVisualManager) pour générer des apparences de personnages.
 *
 * ▸ Principe de fonctionnement :
 *   1. Créez une instance de Bitmap_Composite.
 *   2. Ajoutez des couches (layers) avec `addLayer()`.
 *   3. Appelez `loadLayers()` pour commencer le chargement des images.
 *   4. Vérifiez avec `isReady()` si le chargement est terminé.
 *   5. Une fois prêt, appelez `bltComposite()` sur un bitmap de destination
 *      pour y dessiner le sprite assemblé.
 *
 * ▸ Exemple d'utilisation :
 *   const composer = new Bitmap_Composite();
 *   composer.addLayer('body/male_base', 0);
 *   composer.addLayer('armor/leather_chest', 10);
 *   composer.loadLayers();
 *   // ... dans une boucle update ...
 *   if (composer.isReady() && !destinationBitmap.isComposed) {
 *       composer.bltComposite(destinationBitmap);
 *       destinationBitmap.isComposed = true; // Flag pour ne le faire qu'une fois
 *   }
 *
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 * 
 * ▸ Historique :
 *   v1.0.0 - 2024-08-02 : Refactorisation pour une gestion asynchrone non-bloquante.
 *   v0.1.0 - 2024-08-01 : Version initiale héritant de Bitmap.
 */

class Bitmap_Composite {
    /**
     * Crée une nouvelle instance de Bitmap_Composite.
     */
    constructor() {
        this._layers = [];
        this._bitmaps = [];
    }

    /**
     * Ajoute une couche d'image à composer.
     * @param {string} filename Le nom du fichier image dans `img/characters/`.
     * @param {number} [z=0] L'ordre de superposition (les plus grands sont au-dessus).
     */
    addLayer(filename, z = 0) {
        if (!filename) return;
        this._layers.push({ filename, z });
        // Trie les couches pour assurer le bon ordre de dessin.
        this._layers.sort((a, b) => a.z - b.z);
    }

    /**
     * Efface toutes les couches ajoutées.
     */
    clearLayers() {
        this._layers = [];
        this._bitmaps = [];
    }

    /**
     * Lance le chargement de toutes les couches via ImageManager.
     */
    loadLayers() {
        this._bitmaps = this._layers.map(layer =>
            ImageManager.loadCharacter(layer.filename)
        );
    }

    /**
     * Vérifie si toutes les couches ont été chargées par ImageManager.
     * @returns {boolean} True si toutes les couches sont prêtes à être dessinées.
     */
    isReady() {
        if (this._bitmaps.length === 0 && this._layers.length > 0) {
            // Les couches ont été ajoutées mais loadLayers() n'a pas été appelé.
            return false;
        }
        return this._bitmaps.every(bitmap => bitmap.isReady());
    }

    /**
     * Dessine (blits) les couches chargées sur un bitmap de destination.
     * Doit être appelé uniquement après que isReady() retourne true.
     * @param {Bitmap} destinationBitmap Le bitmap sur lequel dessiner le composite.
     */
    bltComposite(destinationBitmap) {
        if (!this.isReady() || !destinationBitmap) {
            return;
        }
        // Efface la destination pour être sûr de ne pas avoir d'artefacts
        destinationBitmap.clear();

        for (const bitmap of this._bitmaps) {
            destinationBitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0);
        }
    }
}

// --- Enregistrement du plugin ---
// Ce plugin ne crée pas d'objet global, mais il doit être enregistré
// pour que d'autres plugins puissent déclarer une dépendance envers lui.
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Bitmap_Composite",
    version: "1.0.0",
    icon: "🎨",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    
    // Pas de createObj car c'est une classe utilitaire à instancier au besoin.
    createObj: {
        autoCreate: false,
        classProto: Bitmap_Composite
    },

    // Pas de surcharge ni de sauvegarde automatique pour ce composant.
    surchargeClass: null,
    autoSave: false
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);