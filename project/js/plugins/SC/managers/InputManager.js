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
/*:
 * @target MZ
 * @plugindesc !SC [v1.0.0] Gestionnaire d'entrées dynamique pour SimCraft Engine.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @orderAfter SC_InputConfig
 *
 * @help
 * InputManager.js
 * 
 * Ce module remplace la gestion des entrées de base de RPG Maker MZ pour permettre
 * une configuration dynamique des touches. Il est conçu pour être utilisé avec
 * un fichier de configuration externe (SC_InputConfig.js) qui définit les mappings
 * par défaut, et pour anticiper une future scène de configuration des touches en jeu.
 *
 * Historique:
 * V1.0.0 (2025-11-08): Implémentation initiale de la classe InputManager.
 *
 * Ce plugin ne nécessite pas de paramètres, il lit sa configuration depuis
 * SC_InputConfig.js.
 */

// --- Surcharge de Input ---

// Sauvegarde de la méthode originale
const _Input_initialize = Input.initialize;
class InputManager {
    /**
     * Initialise le gestionnaire d'entrées avec les mappages par défaut.
     * Cette méthode est appelée par le SystemLoader.
     */
    setupSurcharge() {
        $debugTool.log("▶️ Initializing SC_InputManager...", true);

        this._nameToCodeMap = {}; // Map pour optimiser la recherche nom -> code
        this._reservedActions = new Set(); // Pour les actions non modifiables par le joueur
        this._editableActions = new Set(); // Pour les actions modifiables par le joueur
        
        this.buildNameToCodeMap();
        this.loadDefaultKeyMappings();

        $debugTool.log("✅ SC_InputManager initialized. Final Input.keyMapper state:", true);
        $debugTool.log(Input.keyMapper, true);
    }

    /**
     * Construit une map inversée pour un accès rapide du nom de touche à son code.
     */
    buildNameToCodeMap() {
        for (const code in Input.keyboardMapper) {
            const name = Input.keyboardMapper[code];
            this._nameToCodeMap[name] = parseInt(code);
        }
        $debugTool.log("... 🗺️ _nameToCodeMap built.", true);
    }

    /**
     * Charge les mappages de touches par défaut depuis SC.InputConfig.
     */
    loadDefaultKeyMappings() {
        const mappings = SC.InputConfig.keyMappings;
        $debugTool.log("... ⚙️ Loading default key mappings...", true);
        const tempMap = {}; // Map temporaire pour vérifier les conflits internes à la config

        // La structure est maintenant { action: [key1, key2, ...] }
        for (const actionName in mappings) {
            const keyNames = mappings[actionName];
            // On assigne chaque touche du tableau à l'action
            keyNames.forEach(keyName => {
                // On vérifie les conflits dans notre propre config, puis on assigne.
                this.assignKey(actionName, keyName, tempMap);
                // On met à jour la map temporaire pour les prochaines vérifications.
                const keyCode = this._nameToCodeMap[keyName];
                if (keyCode) {
                    tempMap[keyCode] = actionName;
                }
            });
        }
    }

    /**
     * Assigne un code de touche à un code d'entrée.
     * Gère les conflits et les erreurs.
     * @param {string} actionName - Le nom de l'action (ex: 'ok', 'cancel').
     * @param {string} keyName - Le nom de la touche.
     * @param {object} [mapToCheck=Input.keyMapper] - La map dans laquelle vérifier les conflits.
     */
    assignKey(actionName, keyName, mapToCheck = Input.keyMapper) {
        const normalizedKeyName = keyName.toLowerCase();
        $debugTool.log(`... ... Assigning '${keyName}' (as '${normalizedKeyName}') to action '${actionName}'`, true);
        const keyCode = this._nameToCodeMap[normalizedKeyName];

        if (keyCode === undefined) {
            $debugTool.warnUnknowKey(normalizedKeyName, actionName);
            return;
        }

        // Vérifie si la touche est déjà assignée à une autre action
        const existingAction = mapToCheck[keyCode];
        if (existingAction && existingAction !== actionName) {
            $debugTool.errorKeyConflict(keyName, existingAction, actionName);
            return;
        }

        // Assigne la nouvelle touche dans le bon sens : [keyCode] = actionName
        Input.keyMapper[keyCode] = actionName;
        $debugTool.log(`... ... ... ✨ Assigned action '${actionName}' to key code ${keyCode} ('${normalizedKeyName}').`, true);
    }

    /**
     * Récupère le nom de l'action à partir du keyCode.
     * @param {number} keyCode Le code numérique de la touche.
     * @returns {string|null} Le nom de l'action ou null si non trouvé.
     */
    getActionFromKeyCode(keyCode) {
        return Input.keyMapper[keyCode] || null;
    }

    /**
     * Récupère le nom de la touche à partir de son code numérique.
     * @param {number} keyCode Le code numérique de la touche.
     * @returns {string|null} Le nom de la touche ou null si non trouvé.
     */
    getKeyNameFromCode(keyCode) {
        return Input.keyboardMapper[keyCode] || null;
    }

    /**
     * Marque une touche comme réservée (non modifiable par le joueur).
     * @param {string} actionName Le nom de l'action à réserver.
     */
    reserveAction(actionName) {
        this._reservedActions.add(actionName);
        this._editableActions.delete(actionName); // S'assurer qu'elle n'est pas aussi éditable
    }

    /**
     * Marque une touche comme éditable (modifiable par le joueur).
     * @param {string} actionName Le nom de l'action à rendre éditable.
     */
    makeActionEditable(actionName) {
        this._editableActions.add(actionName);
        this._reservedActions.delete(actionName); // S'assurer qu'elle n'est pas aussi réservée
    }

    /**
     * Vérifie si un code d'entrée est réservé.
     * @param {string} actionName Le nom de l'action à vérifier.
     * @returns {boolean} True si la touche est réservée, false sinon.
     */
    isActionReserved(actionName) {
        return this._reservedActions.has(actionName);
    }

    /**
     * Vérifie si un code d'entrée est éditable.
     * @param {string} actionName Le nom de l'action à vérifier.
     * @returns {boolean} True si la touche est éditable, false sinon.
     */
    isActionEditable(actionName) {
        return this._editableActions.has(actionName);
    }
}



// --- Enregistrement du plugin ---
// Doit être à la fin du fichier pour que la classe InputManager soit définie.
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_InputManager",
    version: "1.0.0",
    icon: "🔠",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_InputConfig"],
    createObj: {
        autoCreate: false, // Les classes de surcharge n'ont pas besoin d'être auto-créées globalement
        classProto: InputManager
    },
    surchargeClass: "Input",
    autoSave: false // La configuration des touches sera gérée par un système de config joueur plus tard
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
