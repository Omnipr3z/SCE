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
    }

    initMembers() {
        this.imgName = '';
        this.scale.x = 1;
        this.scale.y = 1;
        this.opacity = 0;
        this.rotation = 0;

        this._currentFrame = 0;
        this._lastFrame = 0;
        this._frameTick = 0;

        this._opacityGoal = 0;
        this._zoomGoal = 1;
        this._rotationGoal = 0;
        this._duration = 0;

        this._fadeSpeed = 3;
        this._moveSpeed = 0.05;
        this._rotationSpeed = 0.6;
        this._zoomSpeed = 0.005;
        this._frameDuration = 4;
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

    updateOpacity(){
        if (this._isBlinking) {
            this.opacity = (this.opacity > 150) ? 20 : 255;
        }else{
            this.opacity = this.opacity.approach(0, 3);
        }
    }
    updateMovement() {
        // Les boutons restent fixes, pas de mouvement.
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