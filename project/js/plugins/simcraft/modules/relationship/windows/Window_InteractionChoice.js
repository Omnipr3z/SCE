// ==============================================================================
// WINDOW INTERACTION CHOICE (Ring Menu à catégories)
// ==============================================================================

class Window_InteractionChoice extends Window_RingCommand {
    
    initialize(rect) {
        super.initialize(rect);
        this._mode = 'category'; // 'category' ou 'action'
        this._allInteractions = [];
        this._categories = {};
        this._currentCategory = null;

        // On se cache au début
        this.hide();
        this.deactivate();
    }

    setInfoWindow(infoWindow) {
        this._infoWindow = infoWindow;
    }

    /**
     * Peuple la fenêtre avec les interactions disponibles et les organise.
     * @param {Array<InteractionBase>} interactions - Liste des instances d'interactions possibles.
     */
    setInteractions(interactions) {
        this._allInteractions = interactions;
        this._categories = this.categorizeInteractions(interactions);
        this.setupCategoryView();
        
        this.show();
        this.activate();
    }

    categorizeInteractions(interactions) {
        const categories = {};
        for (const interaction of interactions) {
            // On suppose que chaque interaction a une propriété "category"
            const category = interaction.category || 'divers';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(interaction);
        }
        return categories;
    }

    // --- Vues ---

    setupCategoryView() {
        this._mode = 'category';
        this._currentCategory = null;
        const categoryKeys = Object.keys(this._categories);
        
        const commands = categoryKeys.map(key => ({
            name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
            symbol: `category_${key}`,
            enabled: true,
            icon: null, // Mettre une icone de catégorie ici ?
            ext: key
        }));

        commands.push({ name: "Au revoir", symbol: "cancel", enabled: true, ext: null });

        this.setCommands(commands);
        this.setHandler('cancel', this.onCancel.bind(this));
        
        for (const cmd of commands) {
            if (cmd.symbol !== 'cancel') {
                this.setHandler(cmd.symbol, this.onCategoryOk.bind(this));
            }
        }
        this.refresh();
        this.select(0);
        this.activate();
    }
    
    setupActionView(categoryKey) {
        this._mode = 'action';
        this._currentCategory = categoryKey;
        const interactions = this._categories[categoryKey];

        const commands = interactions.map(interaction => ({
            name: interaction.name, // Supposons que l'interaction a un nom
            symbol: interaction._key,  // ex: "flirter"
            enabled: true, // isEnable a déjà été vérifié avant
            icon: null,
            ext: interaction
        }));
        
        this.setCommands(commands);
        this.setHandler('cancel', this.onActionCancel.bind(this)); // 'cancel' appelle maintenant onActionCancel

        for (const cmd of commands) {
            this.setHandler(cmd.symbol, this.onActionOk.bind(this));
        }
        this.refresh();
        this.select(0);
        this.activate();
    }

    // --- Handlers ---

    onCategoryOk() {
        const categoryKey = this.currentExt();
        this.setupActionView(categoryKey);
        SoundManager.playOk();
    }

    onActionOk() {
        console.log("Action OK");
        const interaction = this.currentExt();
        // On remonte l'objet interaction complet à l'orchestrateur
        DialogManager.onActionSelected(interaction);
        SoundManager.playOk();
        this._infoWindow.refresh();
    }

    onActionCancel() {
        // Retour à la vue des catégories
        this.setupCategoryView();
        SoundManager.playCancel();
    }

    onCancel() {
        // En mode catégorie, 'cancel' ferme tout
        DialogManager.end();
        SoundManager.playCancel();
        this.close();
        this.deactivate();
    }

    // On surcharge le handler OK de base
    callOkHandler() {
        // Pas besoin de le surcharger si chaque item a son propre handler
        const symbol = this.currentSymbol();
        if (this.isHandled(symbol)) {
            this.callHandler(symbol);
        } else {
            this.activate();
        }
    }

    /**
     * Réinitialise complètement la fenêtre pour une future réutilisation.
     */
    clear() {
        this.clearCommandList();
        this._allInteractions = [];
        this._categories = {};
        this._currentCategory = null;
        this._mode = 'category';
        this.close();
        this.deactivate();
    }

    /**
     * Logique de mise à jour pour la visibilité contextuelle.
     */
    update() {
        super.update();
        // Si le manager de dialogue est inactif, on s'assure d'être caché et inactif.
        if (DialogManager.isIdle()) {
            this.hide();
            this.deactivate();
            return;
        }

        const isDialActive = $gameMessage.isBusy();

        // Si une bulle est active ou qu'une action est en cours, on se cache et on se désactive.
        if (isDialActive || DialogManager.isProcessing()) {
            this.hide();
            this.deactivate();
        } 
        // Sinon, si on attend un choix et qu'on est prêt (et invisible), on s'affiche et on s'active.
        else if (DialogManager.isAwaitingChoice() && !this.visible && this._allInteractions.length > 0) {
            this.show();
            this.activate();
        }
    }
}
