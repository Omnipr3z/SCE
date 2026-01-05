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
 * @plugindesc !SC [v1.0.2] Gestionnaire d'entrées tactiles et souris étendu.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_TouchInputConfig
 * @orderAfter SC_TouchInputConfig
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
 *   v1.0.2 - 2024-07-31 : Correction de la gestion du contexte 'this' pour une stabilité accrue.
 *   v1.0.1 - 2024-07-29 : Ajout de la détection de survol (isHover) et de l'annulation conditionnelle.
 *   v1.0.0 - 2024-07-29 : Création initiale et ajout de la gestion du clic droit.
 */

// --- Surcharge de TouchInput ---

const _TouchInput_initialize = TouchInput.initialize;
const _TouchInput_clear = TouchInput.clear;
const _TouchInput_onRightButtonDown = TouchInput._onRightButtonDown;
const _TouchInput_update = TouchInput.update; // Alias manquant pour la méthode update
const _TouchInput_onMouseUp = TouchInput._onMouseUp; // Alias pour la gestion du relâchement
const _TouchInput_isCancelled = TouchInput.isCancelled;

class TouchInputManager {

    /**
     * Initialise le gestionnaire et surcharge les méthodes de TouchInput.
     * Cette méthode est appelée par le SystemLoader lors de la surcharge.
     */
    setupSurcharge() {
        $debugTool.log("▶️ Initializing SC_TouchInputManager...", true);
        // Ajoute les nouvelles propriétés directement à l'objet TouchInput
        TouchInput._rightButtonPressed = false;
        TouchInput._rightPressedTime = 0;
        TouchInput._rightTriggered = false;
        TouchInput._rightEvents = { triggered: false };
    }

    /**
     * [SURCHARGE] Met à jour l'état des entrées tactiles et souris.
     * Gère le timing pour les boutons personnalisés.
     */
    update() {
        _TouchInput_update.call(TouchInput, ...arguments); // Appel de la méthode update originale de TouchInput

        // Mise à jour de l'état triggered pour le clic droit (bufferisé comme le clic gauche)
        TouchInput._rightTriggered = !!TouchInput._rightEvents.triggered;
        TouchInput._rightEvents.triggered = false;

        // Gestion du timing pour le bouton droit
        if (TouchInput.isRightPressed()) {
            TouchInput._rightPressedTime++;
        } else {
            TouchInput._rightPressedTime = 0;
        }
    }

    /**
     * [SURCHARGE] Réinitialise l'état des entrées tactiles et souris.
     */
    clear() {
        _TouchInput_clear.call(TouchInput, ...arguments); // Appel original
        // Réinitialise nos propriétés personnalisées sur l'objet TouchInput
        TouchInput._rightButtonPressed = false;
        TouchInput._rightPressedTime = 0;
        TouchInput._rightTriggered = false;
        TouchInput._rightEvents = { triggered: false };
    }

    /**
     * [NOUVEAU] Vérifie si le bouton droit de la souris vient d'être pressé.
     * @returns {boolean}
     */
    isRightTriggered() {
        return TouchInput._rightTriggered;
    }

    /**
     * [NOUVEAU] Vérifie si le bouton droit de la souris est actuellement maintenu enfoncé.
     * @returns {boolean}
     */
    isRightPressed() {
        return TouchInput._rightButtonPressed;
    }

    /**
     * [NOUVEAU] Vérifie si le bouton droit de la souris est pressé de manière répétée.
     * @returns {boolean}
     */
    isRightRepeated() {
        return (
            TouchInput.isRightPressed() && // Vérifie si le bouton est actuellement maintenu
            (TouchInput._rightPressedTime === TouchInput.keyRepeatWait || (TouchInput._rightPressedTime > TouchInput.keyRepeatWait && TouchInput._rightPressedTime % TouchInput.keyRepeatInterval === 0))
        );
    }

    /**
     * [NOUVEAU] Vérifie si le curseur de la souris survole une zone rectangulaire.
     * @param {Rectangle} rect Le rectangle à vérifier (doit avoir x, y, width, height).
     * @returns {boolean}
     */
    isHover(rect) {
        const x = TouchInput._x;
        const y = TouchInput._y;
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
        return SC.TouchInputConfig.cancelOnRightClick;
    }

    /**
     * [SURCHARGE] Vérifie si l'action d'annulation a été déclenchée.
     * Le clic droit est maintenant une source d'annulation conditionnelle.
     */
    isCancelled() {
        const originalResult = _TouchInput_isCancelled.call(TouchInput, ...arguments);
        // Si l'annulation originale est déjà vraie (ex: 2 doigts sur mobile), on la retourne.
        if (originalResult) {
            return true;
        }
        // Sinon, on vérifie si un clic droit a été déclenché et si notre condition le permet.
        if (TouchInput.isRightTriggered() && TouchInput.isCancelOnRightClick()) {
            return true;
        }
        return false;
    }
}

// --- Application des patchs après l'enregistrement ---

TouchInput._onRightButtonDown = function(event) {
    // On met toujours à jour nos propres états pour que isRightPressed/Triggered fonctionnent
    this._rightButtonPressed = true;
    this._rightEvents = this._rightEvents || { triggered: false };
    this._rightEvents.triggered = true;
    // On appelle la méthode originale (qui gère l'annulation) uniquement si notre condition est remplie.
    if (this.isCancelOnRightClick()) {
        _TouchInput_onRightButtonDown.call(this, event);
    }
};

TouchInput._onMouseUp = function(event) {
    _TouchInput_onMouseUp.call(this, event);
    if (event.button === 2) { // Bouton droit
        this._rightButtonPressed = false;
    }
};

// --- Enregistrement du plugin ---
// Doit être à la fin du fichier (avant les patchs) pour que la classe TouchInputManager soit définie.
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_TouchInputManager",
    version: "1.0.2",
    icon: "🖱️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_TouchInputConfig"],
    createObj: { autoCreate: false, classProto: TouchInputManager }, // Les classes de surcharge n'ont pas besoin d'être auto-créées globalement
    surchargeClass: "TouchInput",
    autoSave: false
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);