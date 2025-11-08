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
 * @plugindesc !SC [v1.0.1] Gestionnaire d'entrées tactiles et souris étendu.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @base SC_SystemLoader
 * @orderAfter SC_SystemLoader
 *
 * @help
 * TouchInputManager.js
 * 
 * Ce module étend la classe TouchInput de RMMZ pour ajouter des
 * fonctionnalités supplémentaires, notamment une gestion avancée du clic droit
 * et la détection du survol de la souris.
 *
 * ▸ Fonctionnalités :
 *   - Gestion avancée du clic droit (annulation conditionnelle, états `pressed`, `triggered`, `repeated`).
 *   - Détection du survol de la souris sur une zone rectangulaire (`isHover`).
 *
 * ▸ Historique :
 *   v1.0.1 - 2024-07-29 : Ajout de la détection de survol (isHover) et de l'annulation conditionnelle.
 *   v1.0.0 - 2024-07-29 : Création initiale et ajout de la gestion du clic droit.
 */

class TouchInputManager {

    /**
     * Initialise le gestionnaire et surcharge les méthodes de TouchInput.
     * Cette méthode est appelée par le SystemLoader lors de la surcharge.
     */
    initialize() {
        // Appelle la méthode d'initialisation originale de TouchInput
        // pour s'assurer que tous les listeners de base sont en place.
        super.initialize(...arguments);

        // Surcharge de la méthode _onRightButtonDown pour gérer notre propre état
        // et conditionner le comportement d'annulation.
        const _alias_onRightButtonDown = this._onRightButtonDown;
        this._onRightButtonDown = function(event) {
            // Si l'annulation par clic droit est active, on exécute le comportement natif.
            if (this.isCancelOnRightClick()) {
                _alias_onRightButtonDown.call(this, event);
            }
            // On met à jour notre propre état "pressé" dans tous les cas.
            this._rightButtonPressed = true;
        };

        // Surcharge de la méthode clear pour réinitialiser notre nouvel état.
        const _alias_clear = this.clear;
        this.clear = function() {
            _alias_clear.call(this);
            this._rightButtonPressed = false;
        };
    }

    /**
     * [NOUVEAU] Vérifie si le bouton droit de la souris est actuellement maintenu enfoncé.
     * @returns {boolean}
     */
    isRightPressed() {
        return this._rightButtonPressed;
    }

    /**
     * [NOUVEAU] Vérifie si le bouton droit de la souris vient d'être pressé (une seule frame).
     * @returns {boolean}
     */
    isRightTriggered() {
        // Le comportement standard de RMMZ pour le clic droit est de déclencher "isCancelled".
        // Nous nous lions à ce comportement pour garantir la cohérence.
        return this.isCancelled();
    }

    /**
     * [NOUVEAU] Vérifie si le bouton droit de la souris est pressé de manière répétée.
     * @returns {boolean}
     */
    isRightRepeated() {
        return (
            this.isRightPressed() &&
            (this._pressedTime === 0 || (this._pressedTime >= this.keyRepeatWait && this._pressedTime % this.keyRepeatInterval === 0))
        );
    }

    /**
     * [NOUVEAU] Vérifie si le curseur de la souris survole une zone rectangulaire.
     * @param {Rectangle} rect Le rectangle à vérifier (doit avoir x, y, width, height).
     * @returns {boolean}
     */
    isHover(rect) {
        const x = this._x;
        const y = this._y;
        return (
            rect && x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height
        );
    }

    /**
     * [NOUVEAU] Détermine si le clic droit doit déclencher une annulation.
     * Cette méthode est un placeholder destiné à être surchargé par d'autres plugins
     * pour créer des logiques conditionnelles (ex: dépendre d'un interrupteur).
     * @returns {boolean}
     */
    isCancelOnRightClick() {
        return false; // Par défaut, le clic droit n'annule plus avec ce plugin chargée.
    }

    /**
     * [SURCHARGE] La logique d'annulation est maintenant gérée dans _onRightButtonDown.
     * Cette méthode est conservée pour la cohérence de l'API.
     */
    isCancelled() {
        return super.isCancelled(...arguments);
    }
}

// --- Enregistrement du plugin auprès du SystemLoader ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_TouchInputManager",
    version: "1.0.0",
    icon: "🖱️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: true, classProto: TouchInputManager },
    surchargeClass: "TouchInput",
    autoSave: false
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);