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
 * @plugindesc !SC [v0.1.0] Bitmap composite pour l'affichage d'acteurs
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help Bitmap_Composite.js
 * 
 *   ██████╗ ██╗████████╗██████╗ 
 *   ██╔══██╗██║╚══██╔══╝██╔══██╗
 *   ██████╔╝██║   ██║   ██████╔╝
 *   ██╔══██╗██║   ██║   ██╔══██╗
 *   ██████╔╝██║   ██║   ██║  ██║
 *   ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝
 * 
 * Cette classe est responsable de la création d'un bitmap unique en
 * superposant plusieurs couches d'images (layers).
 * 
 * ▸ Historique :
 *   v0.1.0 - Version initiale.
 */

class Bitmap_Composite extends Bitmap {
    /**
     * @param {number} width La largeur du bitmap final.
     * @param {number} height La hauteur du bitmap final.
     */
    constructor(width, height) {
        super(width, height);
        this._ready = false;
    }

    /**
     * Vérifie si le bitmap composite est entièrement chargé et assemblé.
     * @returns {boolean} True si le bitmap est prêt.
     */
    isReady() {
        return this._ready;
    }

    /**
     * Assemble les couches graphiques pour créer le bitmap final.
     * @param {Array<Object>} layers - Une liste d'objets décrivant chaque couche.
     * Chaque objet doit contenir { bitmapSrc, bitmapFilename }.
     * @returns {Promise} Une promesse qui se résout quand la composition est terminée.
     */
    compose(layers) {
        this._ready = false;
        const promises = layers.map(layer => {
            return ImageManager.loadBitmap(layer.bitmapSrc, layer.bitmapFilename);
        });

        return Promise.all(promises).then(bitmaps => {
            for (const bmp of bitmaps) {
                // On dessine chaque couche sur le bitmap composite lui-même.
                this.blt(bmp, 0, 0, bmp.width, bmp.height, 0, 0);
            }
            this._ready = true;
        });
    }
}

// --- Enregistrement du plugin ---
// Même si ce n'est pas un module actif, on l'enregistre pour la gestion des dépendances.
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_BitmapComposite",
    version: "0.1.0",
    icon: "🖼️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: [],
    createObj: { autoCreate: false },
    // Pas de surchargeClass, pas d'autoSave. C'est un composant passif.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);