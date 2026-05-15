// ==============================================================================
// DIALOG MANAGER (Orchestrator)
// ==============================================================================

class DialogManager {
    /**
     * Classe statique, ne pas instancier.
     * @throws {Error}
     */
    constructor() {
        throw new Error("This is a class");
    }
    /**
     * Initialise les membres statiques. A appeler une fois au chargement du jeu.
     */
    initialize() {
        this._state = 'IDLE'; // IDLE, SHOWING_HUD, AWAITING_CHOICE, PROCESSING_ACTION, CLOSING
        this._playerEvent = null;
        this._npcEvent = null;
        this._relationship = null; // Stocke l'objet Game_ActorsRelation
    }

    //GETTERS
    _getInteractionWindowRect() {
        const refWidth = 960;
        const refHeight = 460;
        const refX = (Graphics.boxWidth - refWidth) / 2;
        const refY = (Graphics.boxHeight - refHeight) / 2;
        return new Rectangle(refX, refY, refWidth, refHeight);
    }
    state() { return this._state; }
    isIdle() { return this._state === 'IDLE'; }
    isProcessing() { return this._state === 'PROCESSING_ACTION'; }
    isAwaitingChoice() { return this._state === 'AWAITING_CHOICE'; }
    getDialText(actorId, actionKey){ return $dataDIals[$dataDialsRegistery[actorId][actionKey]];}

    //START DIAL
    /**
     * Démarre une nouvelle session de dialogue.
     * C'est le point d'entrée principal.
     * @param {number} npcEventId - L'ID de l'événement du PNJ avec qui on interagit.
     * @param {number} npcActorId - L'ID de l'événement du PNJ avec qui on interagit.
     */
    start(npcEventId, npcActorId) {

        if (this._state !== 'IDLE') return;

        this._state = 'SHOWING_HUD';
        $debugTool.log(`Starting dialog with NPC event: ${npcEventId}`);

        this.setupDial(npcEventId, npcActorId);
        this.showWindows()
        
        this._state = 'AWAITING_CHOICE';
    }
    setupDial(npcEventId, npcActorId){
        //Interlocutors
        this._playerEvent = $gamePlayer;
        this._npcEvent = $gameMap.event(npcEventId);
        if (!this._npcEvent) {
            $debugTool.error(`Event ${npcEventId} not found on map.`);
            return this.end();
        }
        this.interlocId = npcActorId || this._npcEvent.actorId();
        if (!actorId) {
            $debugTool.error(`Event ${npcEventId} has no actorId.`);
            return this.end();
        }
        //stopActions
        $gamePlayer.stopAction();
        if ($actorsMM.actor(actorId) && $actorsMM.actor(actorId).character) {
            $actorsMM.actor(actorId).character.stopAction();
        }
        //load relation data
        this._relationship = $relationManager.actorRel(actorId);
    }
    showWindows() {
        this.showInfoWindow();
        this.showInteractionWindow();
    }
    showInfoWindow() {
        const infoWindow = SceneManager._scene.getRelationshipInfoWindow();
        if (infoWindow) {
            infoWindow.setRelationship(this._relationship);
            infoWindow.show();
            infoWindow.open();
        }
    }
    showInteractionWindow() {
        this._interactionWindow = SceneManager._scene.getInteractionWindow();
        if (this._interactionWindow) {
            const rect = this._getInteractionWindowRect();
            this._interactionWindow.move(rect.x, rect.y, rect.width, rect.height);
            
            const interactionClasses = InteractionRegistry.getRegisteredClasses();
            const availableInteractions = interactionClasses.map(cls => new cls({ interloc: npcActorId }))
                .filter(interaction => interaction.isEnable());

            if (availableInteractions.length === 0) {
                console.log("No available interactions for this target.");
                return this.end();
            }
            this._interactionWindow.setInteractions(availableInteractions);
        }
    }

    // ACTION PROCESSING
    /**
     * Appelé par la fenêtre de choix lorsque le joueur sélectionne une action.
     * @param {InteractionBase} interaction - L'instance de l'interaction choisie.
     */
    onActionSelected(interaction) {
        if (this._state !== 'AWAITING_CHOICE') return;

        this._state = 'PROCESSING_ACTION';

        // --- Exécution de l'action et de la réaction ---
        this.playAction($gamePlayer.actor().actorId(), interaction.key);
        this.playReaction(interaction)
        
        // --- L'action est synchrone pour l'instant ---
        // Rafraîchir la fenêtre d'info
        const infoWindow = SceneManager._scene.getRelationshipInfoWindow();
        if (infoWindow) {
            infoWindow.setRelationship(this._relationship);
        }

        // On a fini de traiter, on attend le prochain choix.
        // La fenêtre se ré-ouvrira d'elle-même.
        this._state = 'AWAITING_CHOICE';
    }
    
    /**
     * Joue une animation d'action sur un acteur.
     * @param {number} actorId 
     * @param {string} actionKey 
     */
    playAction(actorId, actionKey) {
        const actorManager = $actorsMM.actor(actorId);
        actorManager.character.playAction(actionKey);
        this.showDialogue(actorId, `act_${actionKey.toLowerCase()}`);
    }
    playReaction(interaction){
        const ReactionClass = interaction.interlocGetReact();
        if (ReactionClass) {
            new (`InteractRel_${ReactionClass}`)(this, this._relationship);
        } else {
            debugTool.warn(`No reaction class returned for interaction ${interaction.name}`);
        }
    }
    
    /**
     * Termine la session de dialogue et nettoie les ressources.
     */
    end() {
        console.log("Ending dialog session.");

        // 1. Cacher et nettoyer les fenêtres
        const infoWindow = SceneManager._scene.getRelationshipInfoWindow();
        if (infoWindow) {
            infoWindow.close();
            infoWindow.clear();
        }
        // On récupère la fenêtre depuis la scène au lieu de notre réf. interne
        const interactionWindow = SceneManager._scene.getInteractionWindow();
        if (interactionWindow) {
            interactionWindow.close();
            interactionWindow.clear();
        }
        
        // 2. Dégeler les personnages (logique à venir)

        // 3. Nettoyer les variables
        this._playerEvent = null;
        this._npcEvent = null;
        this._relationship = null;
        this._interactionWindow = null; // Clear internal reference
        this._state = 'IDLE';
    }

    //ACTIONS & REACTIONS
    /**
     * Affiche une bulle de dialogue sur un acteur.
     * @param {number} actorId l'ID de l'acteur cible de la bulle
     * @param {string} actionkey clé dbase pour récupérer le texte dans le JSON (ex: "act_presentation" pour l'action de présentation)
     */
    showDialogue(actorId, actionKey) {
        const actorManager = $actorsMM.actor(actorId);
        const textArray = this.getDialText(actorId, actionKey);
        const text = [];
        textArray.forEach(textLine =>{
            text.push(textLine.randomElem());
        });
        actorManager.dial.talk(text);
    }

    showIconEffect(actorId, iconType) {
        console.log(`(Stub) Showing icon effect ${iconType} on actor ${actorId}`);
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_DialogManager",
    version: "1.0.0",
    icon: "👨‍💼",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_ActorMainManager", "SC_ActorDialsManager"],
    createObj: {
        autoCreate: true,
        classProto: DIalogManager,
        instName: "$DialogManager"
    },
    autoSave: false
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);

const _Dial_Game_Player_canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function() {
    if(DialogManager?._state === 'IDLE'){
        return _Dial_Game_Player_canMove.call(this);
    }
    return false;   
};