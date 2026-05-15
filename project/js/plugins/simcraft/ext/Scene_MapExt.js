const _alias_Scene_Map_update                   = Scene_Map.prototype.update;
const _alias_Scene_Map_onMapLoaded              = Scene_Map.prototype.onMapLoaded;
const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
const _alias_Scene_Map_createDisplayObjects     = Scene_Map.prototype.createDisplayObjects;
const _alias_Scene_Map_start                    = Scene_Map.prototype.start;
const _alias_Scene_Map_stop                     = Scene_Map.prototype.stop;
const _alias_Scene_Map_terminate                = Scene_Map.prototype.terminate;
const _alias_Scene_Map_createMessageWindow = Scene_Map.prototype.createMessageWindow;

Scene_Map.prototype.update                  = function() {
    _alias_Scene_Map_update.call(this);
    if ($gameDate) {
        $gameDate.passTick();
    }
    if ($gameDayLight) {
        $gameDayLight.update();
    }
    if ($gameWeather) {
        $gameWeather.update();
        this.updateWeatherOverlay();
    }  
    if ($gameActorsAnims) {
        $gameActorsAnims.update();
    }
    if ($actorHealthManagers) {
        this.updateActorsHealth();
    }
    if ($actorsActivitiesManagers){
        this._activityTimer = this._activityTimer ||0;
         if(this._activityTimer == 0) {
            $actorsActivitiesManagers.update();
            this._activityTimer = $gameVariables.value(TIME_TICK_VAR)*60; // Mise à jour toutes les secondes
        }else{
            this._activityTimer = (this._activityTimer +1) %60;
        }
    }
    if(this._ringCommandWindow){
        this.updateRingCommandTrigger();
    }
};
Scene_Map.prototype.onMapLoaded             = function() {
    _alias_Scene_Map_onMapLoaded.call(this);
    if ($gameDayLight) {
        $gameDayLight.initializeForMap();
    }
    if (this._healthHudWindow && DEBUG_OPTIONS.showDebugWindow) {
        this.addChild(this._healthHudWindow); // Ré-ajoute la fenêtre au premier plan
    }
};
Scene_Map.prototype.createAllWindows        = function() {
    _Scene_Map_createAllWindows.call(this);
    this.createRingCommandWindow();
    if(DEBUG_OPTIONS.showDebugWindow && Window_HealthHud)
        this.createHealthHudWindow();
   // this.createRelationshipInfoWindow();
   // this.createInteractionWindow(); // Ajout de la fenêtre d'interaction
};
Scene_Map.prototype.createMessageWindow = function() {
    _alias_Scene_Map_createMessageWindow.call(this);

    // Remplacer par Window_BubbleMsg
    const rect = this.messageWindowRect();

    // Supprimer l'ancienne fenêtre message si elle existe
    if (this._messageWindow && this._messageWindow.parent) {
        this._messageWindow.parent.removeChild(this._messageWindow);
    }

    this._messageWindow = new Window_BubbleMsg(rect);
    this._messageWindow.setBackgroundType(0);
    if (this._goldWindow) this._messageWindow.setGoldWindow(this._goldWindow);
    if (this._nameBoxWindow) this._messageWindow.setNameBoxWindow(this._nameBoxWindow);
    if (this._choiceListWindow) this._messageWindow.setChoiceListWindow(this._choiceListWindow);
    if (this._numberInputWindow) this._messageWindow.setNumberInputWindow(this._numberInputWindow);
    if (this._eventItemWindow) this._messageWindow.setEventItemWindow(this._eventItemWindow);
    this.addWindow(this._messageWindow);
};
Scene_Map.prototype.createDisplayObjects    = function() {
    _alias_Scene_Map_createDisplayObjects.call(this);
    this.createWeatherOverlay();
};
Scene_Map.prototype.start                   = function() {
    _alias_Scene_Map_start.call(this);
    if ($gameActorsAnims) {
        $gameActorsAnims.clear();
    }
};
// Surcharge pour désactiver le menu natif quand le Ring Menu est actif
Scene_Map.prototype.isMenuCalled = function() {
    return Input.isTriggered("menu")
        || (TouchInput.isCancelled()
            && !TouchInput.isHover(this.playerRect()));
};
Scene_Map.prototype.stop                    = function() {
    _alias_Scene_Map_stop.call(this);
};
Scene_Map.prototype.terminate               = function() {
    this.removeWeatherSprite();
    _alias_Scene_Map_terminate.call(this);
};

/* ==================== CUSTOM METHODS ======================== */
Scene_Map.prototype.createWeatherOverlay    = function() {
    this._weatherOverlaySprite = new TilingSprite();
    this._weatherOverlaySprite.blendMode = 1; // additive blend mode
    this._weatherOverlaySprite.move(0, 0, Graphics.width, Graphics.height);
    
    // Add the sprite to the scene
    this.addChild(this._weatherOverlaySprite);
    
    // Ensure it's above characters but below windows
    if (this._windowLayer) {
        const windowLayerIndex = this.getChildIndex(this._windowLayer);
        this.setChildIndex(this._weatherOverlaySprite, windowLayerIndex);
    }
};
Scene_Map.prototype.updateWeatherOverlay = function() {
    if (!this._weatherOverlaySprite || !$gameWeather) return;
    if ($dataMap && $dataMap.meta && !$dataMap.meta.inner){
        this.removeWeatherSprite();
        return;
    }

    const overlayName = $gameWeather.overlayName;

    // Update bitmap if it has changed
    if (this._weatherOverlaySprite.name !== overlayName) {
        this._weatherOverlaySprite.name = overlayName; // Store the name to prevent reloading
        this._weatherOverlaySprite.bitmap = ImageManager.loadWeather(overlayName);
    }
    
    // Update visual properties
    this._weatherOverlaySprite.opacity = ($gameWeather.intensity * 100).clamp(0, 255);
    
    

    if (this._weatherOverlaySprite.bitmap) {
        this._weatherOverlaySprite.origin.x += $gameWeather.scrollX;
        this._weatherOverlaySprite.origin.y += $gameWeather.scrollY;
    }
};
Scene_Map.prototype.removeWeatherSprite = function(){
    if (this._weatherOverlaySprite) {
        this.removeChild(this._weatherOverlaySprite);
        this._weatherOverlaySprite.destroy();
        this._weatherOverlaySprite = null;
    }
}
Scene_Map.prototype.updateActorsHealth = function() {
    const updatedActorIds = new Set();

    const updateActorHealth = (actor) => {
        if (actor && !updatedActorIds.has(actor.actorId())) {
            const healthManager = $actorHealthManagers.manager(actor.actorId());
            if (healthManager) {
                healthManager.mapUpdate();
            }
            updatedActorIds.add(actor.actorId());
        }
    };
    // Met à jour les membres du groupe (joueur + suivants)
    $gameParty.members().forEach(actor => updateActorHealth(actor));

    // Met à jour les acteurs représentés par des événements
    $gameMap.events().forEach(event => {
        // On suppose que l'événement peut être lié à un acteur via une propriété ou une méta-donnée.
        // Pour l'instant, on vérifie si l'événement a une méthode actor().
        if (typeof event.actor === "function") {
            const actor = event.actor();
            updateActorHealth(actor);
        }
    });
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
// --- Fenêtre d'info de relation
Scene_Map.prototype.createRelationshipInfoWindow = function() {
    const rect = this.relationshipInfoWindowRect();
    this._relationshipInfoWindow = new Window_RelationshipInfo(rect);
    this._relationshipInfoWindow.hide();
    this._relationshipInfoWindow.deactivate();
    this.addWindow(this._relationshipInfoWindow);
};
Scene_Map.prototype.relationshipInfoWindowRect = function() {
    // Dimensions pour une résolution de référence (ex: 1280x720)
    // Le patch de SCE se chargera de l'adapter à la résolution actuelle.
    const refWidth = 160;
    const refHeight = 160;
    const refX = 8;
    const refY = 8;
    return new Rectangle(refX, refY, refWidth, refHeight);
};
// --- Fenêtre de choix d'interaction (AJOUT)
Scene_Map.prototype.createInteractionWindow = function() {
    // Le rect est un placeholder, DialogManager le redimensionnera et le positionnera.
    const rect = new Rectangle(320, 155, 960, 540);// Taille par défaut pour une résolution de 1280x720
    this._interactionWindow = new Window_InteractionChoice(rect);
    this._interactionWindow.setInfoWindow(this._relationshipInfoWindow); // Lien avec la fenêtre d'info
    this.addWindow(this._interactionWindow);
};
// 2. Accesseurs pour que les managers puissent trouver les fenêtres
Scene_Map.prototype.getRelationshipInfoWindow = function() {
    return this._relationshipInfoWindow;
};
Scene_Map.prototype.getInteractionWindow = function() {
    return this._interactionWindow;
};
Scene_Map.prototype.createHealthHudWindow = function() {
    const rect = new Rectangle(10, 10, 240, Graphics.height - 20);
    this._healthHudWindow = new Window_HealthHud(rect);
    this.addWindow(this._healthHudWindow);
};
    