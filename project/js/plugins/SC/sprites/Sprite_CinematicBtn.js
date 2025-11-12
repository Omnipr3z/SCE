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
 * @plugindesc !SC [v1.0.0] Sprite spécialisé pour les boutons de cinématiques.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_Sprite_CinematicLayer
 * @orderAfter SC_Sprite_CinematicLayer
 *
 * @help
 * Sprite_CinematicBtn.js
 * 
 * Ce composant hérite de Sprite_CinematicLayer et ajoute une logique de
 * clignotement spécifique pour les boutons "Press OK" et "Skip".
 *
 * ▸ Historique :
 *   v1.0.0 - 2024-08-04 : Création initiale du composant.
 */

class Sprite_CinematicBtn extends Sprite_CinematicLayer {
    initialize() {
        super.initialize();
        this._isBlinking = false;
    }

    /**
     * Active ou désactive le mode clignotement.
     * @param {boolean} value 
     */
    setBlinking(value) {
        this._isBlinking = value;
        if (!value) {
            // Si on arrête de clignoter, on s'assure que l'opacité cible est 0.
            this.applyProperties({ opacityGoal: 0 });
        }
    }

    update() {
        super.update();
        if (this._isBlinking) {
            // Logique de clignotement simple.
            this.opacity = (this.opacity > 150) ? 20 : 255;
        }
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Sprite_CinematicBtn",
    version: "1.0.0",
    icon: "🎬",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_Sprite_CinematicLayer"],
    createObj: { autoCreate: false } // C'est une classe, pas une instance globale.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);