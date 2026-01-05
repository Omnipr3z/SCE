/**
 * ╔════════════════════════════════════════╗
 * ║     S I M C R A F T   E N G I N E      ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v1.0.5] Patch pour afficher le Ring Menu sur la carte (Test).
 * @author By '0mnipr3z'
 * @base Window_RingCommand
 * @orderAfter Window_RingCommand
 *
 * @help
 * Scene_Map_RingCommandPatch.js
 *
 * Ce patch ajoute le menu circulaire à la scène de la carte pour le tester.
 * Cliquez sur le personnage du joueur pour ouvrir le menu.
 */

(() => {
    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createRingCommandWindow();
    };

    Scene_Map.prototype.createRingCommandWindow = function() {
        const rect = this.ringCommandWindowRect();
        this._ringCommandWindow = new Window_RingCommand(rect);
        this._ringCommandWindow.setHandler('cancel', this.onRingCommandCancel.bind(this));
        
        // Définit un jeu de commandes par défaut pour que la fenêtre ne soit pas vide.
        const defaultCommands = [
            { name: "Attaquer", symbol: "attack", enabled: true, icon: "⚔️" },
            { name: "Magie", symbol: "magic", enabled: true, icon: "✨" },
            { name: "Objets", symbol: "item", enabled: true, icon: "🎒" },
            { name: "Fuir", symbol: "escape", enabled: true, icon: "🏃" }
        ];
        // Lie les handlers pour les commandes par défaut
        defaultCommands.forEach(command => {
            this._ringCommandWindow.setHandler(command.symbol, this.onRingCommandOk.bind(this, command.symbol));
        });
        // Charge les commandes par défaut dans la fenêtre
        this._ringCommandWindow.setCommands(defaultCommands);


        this.addWindow(this._ringCommandWindow);
        
        // On cache la fenêtre au départ
        this._ringCommandWindow.openness = 0;
        this._ringCommandWindow.close();
        this._ringCommandWindow.deactivate();
        this._ringCommandWindow.hide();
        this._ringMenuCooldown = 0;
    };

    Scene_Map.prototype.ringCommandWindowRect = function() {
        const x = 0;
        const y = 0;
        const w = Graphics.boxHeight;
        const h = Graphics.boxHeight;
        return new Rectangle(x, y, w, h);
    };

    Scene_Map.prototype.onRingCommandCancel = function() {
        this.closeRingMenu();
    };

    Scene_Map.prototype.onRingCommandOk = function(symbol) {
        console.log("Commande Ring Menu : " + symbol);
        SoundManager.playOk();
        this.closeRingMenu();
    };

    Scene_Map.prototype.openRingMenu = function() {
        this._ringCommandWindow.show();
        this._ringCommandWindow.open();
        this._ringCommandWindow.activate();
        // Réinitialise l'animation d'ouverture pour la voir à chaque fois
        if (this._ringCommandWindow._radius !== undefined) {
             this._ringCommandWindow._radius = 0;
        }
    };

    Scene_Map.prototype.closeRingMenu = function() {
        this._ringCommandWindow.close();
        this._ringCommandWindow.deactivate();
        TouchInput.clear();
    };

    // Update pour détecter le clic sur le joueur
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateRingCommandTrigger();
    };
    
    Scene_Map.prototype.updateRingCommandTrigger = function() {
        // On ne vérifie que si aucun événement ne tourne et si le menu n'est pas déjà actif
        if (!$gameMap.isEventRunning() && !this._ringCommandWindow.active && !this._ringCommandWindow.isClosing()) {
            

            // Clic Gauche (Triggered) sur le joueur (Hover)
            if (TouchInput.isTriggered() && TouchInput.isHover(this.playerRect())) {
                this.openRingMenuAtPlayer();
            }
        }
    };

    Scene_Map.prototype.playerRect = function() {
        // Définition de la zone de clic du joueur (48x48 centré au pied)
            const pX = $gamePlayer.screenX();
            const pY = $gamePlayer.screenY();
            const playerRect = new Rectangle(pX - 24, pY - 48, 48, 48);
            return playerRect;
    };

    Scene_Map.prototype.openRingMenuAtPlayer = function() {
        $debugTool.log("Opening Ring Menu at Player");
        const pX = $gamePlayer.screenX();
        const pY = $gamePlayer.screenY();
        
        // --- Définition des commandes et de leurs actions ---
        const dynamicCommands = [
            { name: "Inspecter", symbol: "inspect", enabled: true, icon: "🔍" },
            { name: "Parler", symbol: "talk", enabled: false, icon: "💬" },
            { name: "Inventaire", symbol: "item", enabled: true, icon: "🎒" },
            { name: "Options", symbol: "options", enabled: true, icon: "⚙️" },
        ];

        // 1. Met à jour la liste des commandes dans la fenêtre.
        this._ringCommandWindow.setCommands(dynamicCommands);

        // 2. Lie un handler (une action) à chaque symbole de commande.
        dynamicCommands.forEach(command => {
            this._ringCommandWindow.setHandler(command.symbol, this.onRingCommandOk.bind(this, command.symbol));
        });
        // --- Fin de la configuration dynamique ---

        // On centre la fenêtre sur le joueur
        const w = this._ringCommandWindow.width;
        const h = this._ringCommandWindow.height;
        this._ringCommandWindow.x = pX - w / 2;
        this._ringCommandWindow.y = (pY - 24) - h / 2;
        
        this.openRingMenu();
        $debugTool.log("Ring Menu opened at player position");
        TouchInput.clear(); // Consomme le clic pour éviter qu'il ne soit interprété par la fenêtre
    };

    // Surcharge pour désactiver le menu natif quand le Ring Menu est actif
    Scene_Map.prototype.isMenuCalled = function() {
        return Input.isTriggered("menu")
            || (TouchInput.isCancelled()
                && !TouchInput.isHover(this.playerRect()));
    };
})();

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Scene_Map_RingCommandPatch",
    version: "1.0.1",
    icon: "⭕",
    author: "0mnipr3z",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["SC_Window_RingCommand"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);