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
 * @url https://github.com/Omnipr3z/SCE
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

// --- Surcharge de TouchInput ---

const _TouchInput_initialize = TouchInput.initialize;
const _TouchInput_clear = TouchInput.clear;
const _TouchInput_onRightButtonDown = TouchInput._onRightButtonDown;
const _TouchInput_isCancelled = TouchInput.isCancelled;

class TouchInputManager {

    /**
     * Initialise le gestionnaire et surcharge les méthodes de TouchInput.
     * Cette méthode est appelée par le SystemLoader lors de la surcharge.
     */
    initialize() {
        _TouchInput_initialize.call(TouchInput, ...arguments);

        // On ne peut pas surcharger _onRightButtonDown directement dans la classe
        // car elle est définie dans le initialize original. On doit donc aliasser
        // la méthode clear() qui est appelée juste après.
        this.clear();
    }

    clear() {
        _TouchInput_clear.call(TouchInput, ...arguments);
        this._rightButtonPressed = false;
    }

    /**
     * [NOUVEAU] Vérifie si le bouton droit de la souris est actuellement maintenu enfoncé.
     * @returns {boolean}
     */
    isRightPressed() {
        return this._rightButtonPressed;
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
        return true; // Par défaut, le clic droit annule toujours.
    }

    /**
     * [SURCHARGE] Vérifie si l'action d'annulation a été déclenchée.
     * Le clic droit est maintenant une source d'annulation conditionnelle.
     */
    isCancelled() {
        return _TouchInput_isCancelled.call(TouchInput, ...arguments);
    }
}

// --- Application des patchs après l'enregistrement ---

// On ne peut pas surcharger _onRightButtonDown directement dans la classe
// car elle est définie dans le initialize original. On le fait donc ici.
TouchInput._onRightButtonDown = function(event) {
    if (this.isCancelOnRightClick()) {
        _TouchInput_onRightButtonDown.call(this, event);
    }
    this._rightButtonPressed = true;
};

// --- Enregistrement du plugin ---
// Doit être à la fin du fichier (avant les patchs) pour que la classe TouchInputManager soit définie.
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_TouchInputManager",
    version: "1.0.1",
    icon: "🖱️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false, classProto: TouchInputManager }, // Les classes de surcharge n'ont pas besoin d'être auto-créées globalement
    surchargeClass: "TouchInput",
    autoSave: false
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);