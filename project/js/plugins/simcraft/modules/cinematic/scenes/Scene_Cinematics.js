

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
 * @plugindesc !SC [v1.1.5] Scène pour la gestion des cinématiques.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_CinematicConfig
 * @orderAfter SC_CinematicConfig
 * @base SC_Sprite_CinematicLayer
 *
 * @help
 * Scene_Cinematics.js
 * 
 * Ce plugin fournit une scène dédiée à l'affichage de cinématiques complexes
 * définies dans des fichiers de données JSON.
 *
 * ▸ Historique :
 *   v1.1.5 - 2025-11-13 : Ajout de la configuration pour le clic droit (skip) et les touches personnalisées (next).
 *   v1.1.4 - 2025-11-12 : Correction d'un bug où les séquences avançaient sans attendre la fin des animations.
 *   v1.1.3 - 2025-11-12 : Ajout de logs de débogage dans la méthode update.
 *   v1.0.9 - 2024-08-04 : Nettoyage final du code et suppression des méthodes de rafraîchissement obsolètes.
 *   v1.0.8 - 2024-08-04 : Refactorisation des boutons "OK" et "Skip" en composants autonomes.
 *   v1.0.7 - 2024-08-04 : Refactorisation pour utiliser le composant autonome Sprite_CinematicLayer.
 *   v1.0.6 - 2024-08-04 : Refactorisation de la gestion du bouton "Skip" pour une meilleure cohérence.
 *   v1.0.5 - 2024-08-04 : Intégration du système de mise à l'échelle pour les éléments de l'interface.
 */
class Scene_Cinematic extends Scene_Base {
    constructor(){
        super();
        this.initMembers();
    }
    get graphicsWidth(){
        return Graphics.width;
    }
    get graphicsHeight(){
        return Graphics.height;
    }
    currentSequencyData(index){
        return this._cinematicData[index];
    }
    /**
     * [INTERNE] Évalue une valeur qui peut être une expression JavaScript.
     * Si la valeur est une chaîne commençant par "eval:", elle est exécutée.
     * @param {*} value La valeur à évaluer.
     * @returns {*} La valeur évaluée ou la valeur originale.
     */
    evalValue(value) {
        if (typeof value === 'string' && value.startsWith('eval:')) {
            try {
                // 'this' dans eval fera référence à l'instance de Scene_Cinematic
                return eval(value.substring(5));
            } catch (e) {
                $debugTool.error(`Erreur lors de l'évaluation de la propriété de cinématique: "${value}"`, e);
                return 0; // Retourne une valeur par défaut en cas d'erreur
            }
        }
        return value;
    }
    isSkipEnable(){
        if(DEBUG_OPTIONS.forceSkipSplash && this._cinematicName == SC.CinematicConfig.splashCinematicName)
            return true;
        if(this._skipMode.enabled === false){
            return false;
        }else{
            switch(this._skipMode.mode){
                case "always":
                    return true;
                case "never":
                    return false;
                case "saveExisting":
                    return DataManager.isAnySavefileExists();
                default:
                    return false;
            }
        }
    }
    isSkipCalled(){
        return Input.isTriggered("cancel")
            || TouchInput.isCancelled()
            || (TouchInput.isRightPressed() && SC.CinematicConfig.skipRightClick);
    }
    isOkCalled(){
        let called = false;
        SC.CinematicConfig.nextSequenceKeys.forEach(keyActionName => {
            if(Input.isTriggered(keyActionName))
                called = true;
        })
        return Input.isTriggered("ok")
            || called;
    }
    /**
     * [INTERNE] Initialise les données de la scène à partir de l'objet de données de la cinématique.
     * @param {object} sourceData L'objet de données de la cinématique (ex: $dataPrologue40k).
     */
    _setupCinematic(sourceData) {
        const config = SC.CinematicConfig;
        this._cinematicData = sourceData.sequencies;
        this._cinematicName = sourceData.name;
        this._backgrounds = sourceData.backgrounds || [];
        this._endBackgrounds = sourceData.endBackgrounds || [];
        this._endNextScene = sourceData.endNext;
        this._endSequency = this._cinematicData.length - 1;
        this._gameInfosNeeded = sourceData.gameInfos || false;
        this._skipMode = sourceData.skipMode? sourceData.skipMode : config.skipDefaultMode;
        this._okBtnPosData =  sourceData.okBtnPos || config.OkBtnPos;
    
    }
    _setupSkipMode(skipData) {
        this._skipMode = skipData || {};
    }
    setBtnPos(positionName, sprite){
        const margin = 20;
        const demiH = sprite.bitmap.height/2;
        const demiW = sprite.bitmap.width/2;
        const bottom = this.graphicsHeight - sprite.bitmap.height - margin;
        const right = this.graphicsWidth - sprite.bitmap.width - margin ;
        const top = margin;
        const left = margin;

        switch(positionName.toLowerCase()){
            case "topright":
                sprite.x = right;
                sprite.y = bottom;
                break;
            case "bottomright":
                sprite.x = right;
                sprite.y = bottom;
                break;
            case "topleft":
                sprite.x = left;
                sprite.y = top;
                break;
            case "bottomleft":
                sprite.x = left;
                sprite.y = bottom;
                break;
            default:
                if(sprite == this._pressOkButton){
                    sprite.x = right;
                    sprite.y = bottom;
                }else{
                    sprite.x = left;
                    sprite.y = bottom;
                }
                break;
        }
        if(this._pressOkButton){
            sprite.anchor.x = 1;
        }else {
            sprite.anchor.x = 2;
        }
        sprite.anchor.y = 1;
    }
    setupBtnsPos() {
        this.setBtnPos(this._okBtnPosData, this._pressOkButton);
        if(this._skipButton)
            this.setBtnPos(this._skipMode.btnPos, this._skipButton);
    }
    loadPicture(filename){
        return ImageManager.loadBitmap(`img/cinematics/${this._cinematicName}/`, filename);
    }
    loadBgPicture(filename){
        return ImageManager.loadBitmap(`img/cinematics/Bg/`, filename);
    }
    loadHudPicture(filename){
        return ImageManager.loadBitmap(`img/cinematics/Hud/`, filename);
    }   
    playScSE(seNm){
        AudioManager.playSe({
            name:seNm,
            pitch:100,
            pan:0,
            volume:100,
            pos:0
        })
    };

    initMembers(){
        this._cinematicData = null;
        this._endSequency = 0;
        this._currentSequency = 0;
        this._layers = [];
        this._backgrounds = [];
        this._cinematicSourceData = null;
        this._endBackgrounds = [];
        this._tick = 0;
        this._tickBgOpacity = 0;
        this.needToPressOk = false;
        this._waitFrame = 0; // Délai pour la gestion des entrées
        this._isSequencePassing = false; // Verrou pour l'enchaînement automatique
        this._cinematicName = "global";
    }

    // ===== CREATE PARTS ======
    create() {
        super.create();

        // Récupère le nom de la cinématique depuis la variable temporaire globale.
        let cinematicToLoad = SC._temp.requestedCinematic;
        
        $debugTool.log(cinematicToLoad)

        // Si aucune cinématique n'a été demandée, on charge la première de la config par défaut.
        if (!cinematicToLoad && SC.CinematicConfig && SC.CinematicConfig.dataFiles.length > 0) {
            cinematicToLoad = SC.CinematicConfig.dataFiles[0].filename;
        }

        if (cinematicToLoad) {
            const instName = `$data${cinematicToLoad.charAt(0).toUpperCase() + cinematicToLoad.slice(1)}`;
            const cinematicData = window[instName];
            if (cinematicData) {
                this._setupCinematic(cinematicData);
            } else {
                $debugTool.error(`Impossible de charger la cinématique : ${instName} n'est pas défini.`);
                SceneManager.pop();
                return;
            }
        } else {
            $debugTool.error("Aucune cinématique à charger. Utilisez SC._temp.requestedCinematic pour en définir une.");
            SceneManager.pop();
            return;
        }

        this.createBackground()
        //creation des layers 0 1 2 3
        for(let i=0; i<13; i++ ) {
            this.createLayer(i);
        };
        this.createWindowLayer();

        

        this.createStoryWindow();
        this.createTitleGameInfosWindows();
        this.createButtons(); // Crée les sprites de boutons dédiés
        this.setupBtnsPos();
        this.updateNextSequency();
    }
    createBackground() {
        this._bgSprites = [];
        if (this._backgrounds.length > 0) {
            for (let i = 0; i < this._backgrounds.length; i++) {
                const filename = this._backgrounds[i];
                const sprite = new TilingSprite(this.loadBgPicture(filename));
                sprite.opacity = 10;
                sprite.move(0, 0, Graphics.width, Graphics.height);
                this._bgSprites.push(sprite);
                this.addChild(sprite);
            }
        }
    }
    createTitleGameInfosWindows() {
        const rect = new Rectangle(0, this.graphicsHeight - 64, this.graphicsWidth, 100);
        this._gameInfosWindow = new Window_TitleGameInfos(rect, this._gameInfosNeeded);
        this.addChild(this._gameInfosWindow);
    }
    createStoryWindow(){
        const rect = {
            x:0,
            y:50,
            width:this.graphicsWidth,
            height:this.graphicsHeight / 2
        }
        this._storyWindow = new Window_Story(rect);

        const rectB = {
            x:rect.x + 310,
            y:rect.y + 724,
            width:260,
            height:440
        }
        this._storyLastWindow = new Window_Story(rectB);

        
        this.addChild(this._storyWindow)
        this.addChild(this._storyLastWindow)
    }
    createButtons() {
        // Crée le bouton "Press OK"
        this._pressOkButton = new Sprite_CinematicBtn();
        this._pressOkButton.bitmap = this.loadHudPicture("PressOk");
        this.addChild(this._pressOkButton);

        // Crée le bouton "Skip" si activé
        if (this.isSkipEnable()) {
            this._skipButton = new Sprite_CinematicBtn();
            this._skipButton.bitmap = this.loadHudPicture(this._skipMode.buttonBitmap || "Skip");
            this.addChild(this._skipButton);
        }
    }
    createLayer(i){
        // On instancie notre nouveau sprite autonome.
        // Il gère lui-même son initialisation.
        this._layers[i] = new Sprite_CinematicLayer();
        this.addChild(this._layers[i]);
    }

    // ===== START PARTS ======   
    start() {
        super.start();
        this.startFadeIn(2, false);
    }
    isSpriteBusy(){
        const contentLayers = this._layers.slice(0, 11);
        return contentLayers.some(layer => layer && layer.isBusy());
    }

    // ===== UPDATE PARTS ======
    update() {
        super.update();
        
        // On met à jour les éléments visuels en continu
        this.updateSkipInput();
        this.refreshBtns();
        this._storyWindow.update();
        this.updateBg();

        // Si une animation est en cours, on ne fait rien d'autre. On attend.
        if (this.isSpriteBusy()) {
            return;
        }
        // Si les animations sont terminées, on vérifie comment passer à la suite.
        if (this._currentSequency > this._endSequency) {
            this.endScene();
            return;
        }else if (this.needToPressOk) {
            this._isSequencePassing = false; // On peut passer à la suite, on retire le verrou
            // On attend une action du joueur pour continuer.
            if (Input.isTriggered("ok") || Input.isTriggered("jump") || Input.isTriggered("enter") || TouchInput.isTriggered()) {
                this.passSequency(true); // On passe à la séquence suivante avec un son
            }
        } else if (!this._isSequencePassing) {
            this._isSequencePassing = true; // On verrouille pour n'appeler qu'une fois
            this.passSequency(false);
        }
    }
    updateNextSequency() {
        const sequence = this.currentSequencyData(this._currentSequency);
        if (!sequence) return;

        this.updateNeedPressOk(sequence)

        // Si c'est la dernière séquence, on ne fait rien de plus, on la laisse se terminer.
        

        $debugTool.log(`--> Séquence ${this._currentSequency} chargée. needToPressOk est maintenant: ${this.needToPressOk}`);
        this.updateCinematicAudio(sequence)
        this.updateCinematicLayers(sequence);
        this.updateStoryWindow(sequence, "storyWindow");
        this.updateStoryWindow(sequence, "storyLastWindow");

        if (sequence.events) {
            sequence.events.forEach(event => {
                if (typeof this[event.name] === 'function') {
                    this[event.name].apply(this, event.args || []);
                }
            });
        }
    }
    updateNeedPressOk(sequence){
        // this.needToPressOk est déjà réinitialisé dans passSequency.
        // On l'applique seulement si la séquence le définit.
        if (sequence.needPressOk !== undefined) {
            this.needToPressOk = sequence.needPressOk;
        }
    }
    updateCinematicLayers(sequence){
        if (sequence.layers) {
            for (const layerId in sequence.layers) {
                if (layerId === "all") {
                    this._layers.forEach(layer => this.applyLayerProperties(layer, sequence.layers.all));
                } else {
                    const layer = this._layers[parseInt(layerId, 12)];
                    if (layer) {
                        this.applyLayerProperties(layer, sequence.layers[layerId]);
                    }
                }
            }
        }
    }
    updateCinematicAudio(sequence){
        if (sequence.audio) {
            if (sequence.audio.se) this.playScSE(sequence.audio.se);
            if (sequence.audio.bgm) AudioManager.playBgm(sequence.audio.bgm);
            if (sequence.audio.fadeOutBgm) AudioManager.fadeOutBgm(sequence.audio.fadeOutBgm);
        }
    }
    updateStoryWindow(sequence, key){
         if (sequence[key]) {
            const win = this[`_${key}`];
            if (sequence[key].clear) win.clearTxt();
            if (sequence[key].style) win.setStyle(sequence[key].style);
            if (sequence[key].txt) win.setTxt(sequence[key].txt);
            if (sequence[key].y) win.y = this.evalValue(sequence[key].y);
        }
    }

    updateBg(){
        if(this._bgSprite_1 && this._bgSprite_2 && this._bgSprite_3){
            this.updateBgPosition();
            if(this._tickBgOpacity > 10){
                this.updateBgOpacity();
                this._tickBgOpacity = 0;
            }else{
                this._tickBgOpacity++
            }
            //this.updateBgScale();
        }
    }
    updateBgScale(){
        for(let i = 1; i < 4; i++){
            const goal = Math.random() * 3;

            if(this[`_bgSprite_${i}`].scale.x != goal)
                this[`_bgSprite_${i}`].scale.x.approach(goal,0.1);
            if(this[`_bgSprite_${i}`].scale.x != this[`_bgSprite_${i}`].scale.y)
                this[`_bgSprite_${i}`].scale.y = this[`_bgSprite_${i}`].scale.x;

        }
    }
    updateBgPosition(){
        if (this._bgSprites[0] && this._bgSprites[0].bitmap) this._bgSprites[0].origin.x = (this._bgSprites[0].origin.x + 1) % this._bgSprites[0].bitmap.width;
        if (this._bgSprites[1] && this._bgSprites[1].bitmap) this._bgSprites[1].origin.x = (this._bgSprites[1].origin.x + 2) % this._bgSprites[1].bitmap.width;
        if (this._bgSprites[2] && this._bgSprites[2].bitmap) this._bgSprites[2].origin.x = (this._bgSprites[2].origin.x + 4) % this._bgSprites[2].bitmap.width;
    }
    updateBgOpacity(){
        
        if(this._currentSequency > this._endSequency - 1){
            if (this._endBackgrounds.length > 0) {
                for (let i = 0; i < this._bgSprites.length; i++) {
                    if (this._endBackgrounds[i] && this._bgSprites[i].bitmap.url.indexOf(this._endBackgrounds[i]) === -1) {
                        this._bgSprites[i].bitmap = this.loadPBgicture(this._endBackgrounds[i]);
                    }
                }
            }

            this._bgSprite_1.opacity = this._bgSprite_1.opacity.approach(255, 10);
            this._bgSprite_2.opacity = this._bgSprite_2.opacity.approach(255, 6);
            this._bgSprite_3.opacity = this._bgSprite_3.opacity.approach(255, 6);


        }else if(this._currentSequency > 23){
            if(this._bgSprite_1.opacity > 10)
                this._bgSprite_1.opacity  = this._bgSprite_1.opacity.approach(1, 15);

            if(this._bgSprite_2.opacity > 10)
                this._bgSprite_2.opacity = this._bgSprite_2.opacity.approach(1, 6);

            if(this._bgSprite_3.opacity > 10)
                this._bgSprite_3.opacity = this._bgSprite_3.opacity.approach(1, 3);
        }else if(this._currentSequency > 2){
            if(this._bgSprite_1.opacity < 255)
                this._bgSprite_1.opacity  = this._bgSprite_1.opacity.approach(255, 3);
                
            if(this._bgSprite_2.opacity < 255)
                this._bgSprite_2.opacity  = this._bgSprite_2.opacity.approach(255, 6);
                
            if(this._bgSprite_3.opacity < 255)
                this._bgSprite_3.opacity  = this._bgSprite_3.opacity.approach(255, 9);
        }
    }
    updateSkipInput(){
        if(this.isSkipEnable() && this.isSkipCalled()) {
            this._currentSequency = this._endSequency;
            SoundManager.playCancel();
            this.needToPressOk = false;
            this.updateNextSequency();
        }else if (this.isSkipCalled()) {
            SoundManager.playBuzzer();
        }
    }
    updateInputOk(){
        if(!this.needToPressOk && !this.isSpriteBusy()){
            this.passSequency();
        } else if (this.isOkCalled()) {
            this.passSequency(true);
            this.needToPressOk = false;
        }else if(this._tick > 1500){
            this.passSequency(true);
            this.needToPressOk = false;
        }
        this._tick++;
    }

    passSequency(se){
        this._currentSequency++;
      this._tick = 0;
      if(se)
        SoundManager.playCursor();
      this._isSequencePassing = false; // On réinitialise le verrou pour la prochaine séquence
      this.needToPressOk = false; // On réinitialise ici, juste avant de charger la nouvelle séquence
      this.updateNextSequency();
    }
    refreshBtns() {
        // Si on doit presser OK et que les animations sont finies, on fait clignoter les boutons.
        if (this.needToPressOk && !this.isSpriteBusy()) {
            this._pressOkButton.setBlinking(true);
            // Le bouton Skip clignote en même temps que le bouton OK.
            if (this._skipButton) this._skipButton.setBlinking(true);
        } else {
            // Sinon, on s'assure qu'ils ne clignotent pas et redeviennent transparents.
            this._pressOkButton.setBlinking(false);
            if (this._skipButton) this._skipButton.setBlinking(false);
        }
    }
    applyLayerProperties(layer, props) {
        for (const key in props) {
            let value = props[key];
            if (key === 'bitmap') {
                layer.bitmap = this.loadPicture(value);
            } else if (key.endsWith('Goal') || key === 'duration' || key.endsWith('Speed')) {
                // Les propriétés cibles sont passées à la méthode applyProperties du sprite.
                layer.applyProperties({ [key]: this.evalValue(value) });
            } else {
                // Les autres propriétés (comme les vitesses) sont appliquées directement.
                layer[key] = this.evalValue(value);
            }
        }
    }

    // ===== ENDING =====
    endScene(){
        SC._temp.requestedCinematic = null;
        AudioManager.stopMe();
        this._layers.forEach((layer)=>layer.opacity = 0);
    
        switch(this._endNextScene.type){
            case "Title":
                DataManager.setupNewGame();
                //Window_TitleCommand.initCommandPosition();
                SceneManager.goto(Scene_Title);
                break;
            case "Cinematic":
                SC._temp.requestedCinematic = this._endNextScene.cinematicName;
                SceneManager.goto(Scene_Cinematic);
                break;
            case "Map":
                $gamePlayer.reserveTransfer(this._endNextScene.mapId, this._endNextScene.mapPos.x, this._endNextScene.mapPos.y, this._endNextScene.mapPos.d, 0);
                
                SceneManager.goto(Scene_Map);
                break;
            default:
                SceneManager.pop();
                break;
        }
    }
}

//Gestion de la dependance conditionnelle
SC._temp.dependency = ["SC_SystemLoader", "SC_CinematicConfig"];
if(SC.CinematicConfig.skipRightClick)dependency.push("SC_TouchInputManager");

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "Scene_Cinematic",
    icon                : "🎬",
    version             : "1.1.3",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : SC._temp.dependency,
    loadDataFiles       : SC.CinematicConfig.dataFiles,
    createObj           : {autoCreate  : false},
    autoSave            : false
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);