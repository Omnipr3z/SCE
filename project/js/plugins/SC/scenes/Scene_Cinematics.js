

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
 * @plugindesc !SC [v1.0.3] Scène pour la gestion des cinématiques.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_CinematicConfig
 * @orderAfter SC_CinematicConfig
 *
 * @help
 * Scene_Cinematics.js
 * 
 * Ce plugin fournit une scène dédiée à l'affichage de cinématiques complexes
 * définies dans des fichiers de données JSON.
 */
class Scene_Cinematic extends Scene_Base {
    constructor(){
        super();
        this.initMembers();
    }
    get graphicsWidth(){
        const config = SC.GraphicsConfig;
        if(config.defaultMode === 'Fullscreen'){
            return screen.width;
        }
        return config.defaultResolution.width;
    }
    get graphicsHeight(){
        const config = SC.GraphicsConfig;
        if(config.defaultMode === 'Fullscreen'){
            return screen.height;
        }
        return config.defaultResolution.height;
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
        this._cinematicName = "global";

        this.isSkipEnable = DataManager.isAnySavefileExists();
    }

    /**
     * [INTERNE] Initialise les données de la scène à partir de l'objet de données de la cinématique.
     * @param {object} sourceData L'objet de données de la cinématique (ex: $dataPrologue40k).
     */
    _setupCinematic(sourceData) {
        this._cinematicData = sourceData.sequencies;
        this._cinematicName = sourceData.name;
        this._backgrounds = sourceData.backgrounds || [];
        this._endBackgrounds = sourceData.endBackgrounds || [];
        this._endNextScene = sourceData.endNext;
        this._endSequency = this._cinematicData.length - 1;
    }

    create() {
        super.create();

        // Récupère le nom de la cinématique depuis la variable temporaire globale.
        let cinematicToLoad = SC._temp.requestedCinematic;
        // Efface la variable temporaire pour éviter qu'elle ne soit réutilisée.
        SC._temp.requestedCinematic = null;

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
        this.preloadImg();
        this.createWindowLayer();

        

        this.createStoryWindow();
        this.createTitleGameInfosWindows();
        this.setupBtnPosition();
        this.updateCinematic();
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
    createTitleGameInfosWindows() {
        this._gameInfosWindow = new Window_TitleGameInfos();
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
    setupBtnPosition(){
        const y = 10
        this._layers[11].anchor.x        = 0;
        this._layers[11].anchor.y        = 0;
        this._layers[11].x = this.graphicsWidth - 188;
        this._layers[11].y = y;
        this._layers[11].xGoal = this.graphicsWidth - 188;
        this._layers[11].yGoal = y;
        this._layers[11].fadeSpeed = 3;

        this._layers[12].anchor.x        = 0;
        this._layers[12].anchor.y        = 0;
        this._layers[12].x = 0;
        this._layers[12].y = y;
        this._layers[12].xGoal = 0;
        this._layers[12].yGoal = y;
        

    }
    createLayer(i){
        this._layers[i] = new Sprite();
        
        this._layers[i].imgName         ='';

        this._layers[i].anchor.x        = 0.5;
        this._layers[i].anchor.y        = 0.5;
        this._layers[i].x               = Math.floor(this.graphicsWidth / 2);
        this._layers[i].y               = Math.floor(this.graphicsHeight / 2) - 20;
        this._layers[i].scale._x        = 1;
        this._layers[i].scale._y        = 1;
        this._layers[i].opacity         = 0;
        this._layers[i].rotation        = 0;
        
        this._layers[i].currentFrame    = 0;
        this._layers[i].lastFrame       = 0;
        this._layers[i].frameTick       = 0;

        this._layers[i].xGoal           = Math.floor(this.graphicsWidth / 2);
        this._layers[i].yGoal           = Math.floor(this.graphicsHeight / 2);
        this._layers[i].opacityGoal     = 0;
        this._layers[i].zoomGoal        = 1;

        this._layers[i].fadeSpeed       = 3;
        this._layers[i].moveSpeed       = 8;
        this._layers[i].rotationSpeed   = 0;
        this._layers[i].zoomSpeed       = 0.05;
        this._layers[i].frameDuration   = 4;
        
        this._layers[i].rotation        = 0;
        this._layers[i].rotationGoal    = 0;
        this._layers[i].rotationSpeed   = 0.01;
        this._layers[i].rotatMandatory  = false;

        this._layers[i].zoomGoal        = 1;
        this._layers[i].zoomSpeed       = 0.004;

        this.addChild(this._layers[i]);
    }
    preloadImg(){
        this._layers[11].bitmap = this.loadHudPicture("PressOk");
        this._layers[12].bitmap = this.loadHudPicture("Skip");
    }
    endScene(){
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
    evalValue(value) {
        if (typeof value !== 'string') {
            return value;
        }
        try {
            // Context for evaluation
            const context = {
                BOOK_Y: BOOK_Y,
                Graphics: Graphics
            };
            return new Function(...Object.keys(context), `return ${value}`)(...Object.values(context));
        } catch (e) {
            console.error(`Error evaluating value: ${value}`, e);
            return value;
        }
    }
    applyLayerProperties(layer, props) {
        for (const key in props) {
            const value = props[key];
            if (key === 'bitmap') {
                layer.bitmap = this.loadPicture(value);
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Handle nested properties like scale.x
                let target = layer;
                const parts = key.split('.');
                for (let i = 0; i < parts.length - 1; i++) {
                    target = target[parts[i]];
                }
                target[parts[parts.length - 1]] = this.evalValue(value);
            } else {
                layer[key] = this.evalValue(value);
            }
        }
    }
    updateCinematic() {
        if (this._currentSequency > this._endSequency) {
            this.endScene();
            return;
        };
        const sequence = this._cinematicData[this._currentSequency];
        if (!sequence) return;

        if (sequence.needPressOk !== undefined) {
            this.needToPressOk = sequence.needPressOk;
        }

        if (sequence.audio) {
            if (sequence.audio.se) this.playScSE(sequence.audio.se);
            if (sequence.audio.bgm) AudioManager.playBgm(sequence.audio.bgm);
            if (sequence.audio.fadeOutBgm) AudioManager.fadeOutBgm(sequence.audio.fadeOutBgm);
        }

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

        if (sequence.storyWindow) {
            const win = this._storyWindow;
            if (sequence.storyWindow.clear) win.clearTxt();
            if (sequence.storyWindow.style) win.setStyle(sequence.storyWindow.style);
            if (sequence.storyWindow.txt) win.setTxt(sequence.storyWindow.txt);
            if (sequence.storyWindow.y) win.y = this.evalValue(sequence.storyWindow.y);
        }

        if (sequence.storyLastWindow) {
            const win = this._storyLastWindow;
            if (sequence.storyLastWindow.clear) win.clearTxt();
            if (sequence.storyLastWindow.txt) win.setTxt(sequence.storyLastWindow.txt);
            if (sequence.storyLastWindow.y) win.y = this.evalValue(sequence.storyLastWindow.y);
        }

        if (sequence.events) {
            sequence.events.forEach(event => {
                if (typeof this[event.name] === 'function') {
                    this[event.name].apply(this, event.args || []);
                }
            });
        }
    }
    start() {
        super.start();
        this.startFadeIn(2, false);
    }
    refreshBtns(isBusy){
        if(this.needToPressOk && !isBusy){
            if(this._layers[11].opacity <= 150){
                this._layers[11].opacity += this._layers[11].fadeSpeed;
            }else{
                this._layers[11].opacity = 20;
            };
            if(this.isSkipEnable && this._currentSequency >= 1){
                this._layers[12].opacity = this._layers[11].opacity;
            };
        }else{
            this._layers[11].opacity=0;
            if(this.isSkipEnable && this._currentSequency >=1){
                if(this._layers[12].opacity <= 100){
                    this._layers[12].opacity += this._layers[12].fadeSpeed;
                }else{
                    this._layers[12].opacity = 20;
                };
            }else{
                this._layers[11].opacity = 0;
            };
        };
    }
    refreshOpacity(i){
        if ( this._layers[i].opacity !=  this._layers[i].opacityGoal){
            this._layers[i].opacity = this._layers[i].opacity.approach(this._layers[i].opacityGoal, this._layers[i].fadeSpeed);
            return false;
        }
        return true;
    }
    refreshPosition(i){
        let res = true;
        if( this._layers[i].x !=  this._layers[i].xGoal){
            this._layers[i].x = this._layers[i].x.approach(this._layers[i].xGoal, this._layers[i].moveSpeed);
            res = false;
        }
        if( this._layers[i].y !=  this._layers[i].yGoal){
            this._layers[i].y = this._layers[i].y.approach(this._layers[i].yGoal, this._layers[i].moveSpeed);
            res = false;
        }
        return res;
    }
    refreshZoom(i){
        if( this._layers[i].scale.x !=  this._layers[i].zoomGoal){

            this._layers[i].scale.x = this._layers[i].scale.x.approach(this._layers[i].zoomGoal, this._layers[i].zoomSpeed);
            this._layers[i].scale.y = this._layers[i].scale.x;
            return false;
        }
        return true;
    }
    updateDuration(i){
        if(this._layers[i]._duration > 0){
            this._layers[i]._duration--;
            return false;
        }
        return true;

    }
    refreshFrame(i){
        if ( this._layers[i].currentFrame >  this._layers[i].lastFrame){
            this._layers[i].frameTick = 0;
            return true;
        }else if(this._layers[i].frameTick < this._layers[i].frameDuration){
            this._layers[i].frameTick++;
            return false;
        } else if (this._layers[i].currentFrame <  this._layers[i].lastFrame){
            this._layers[i].currentFrame++;
            this._layers[i].frameTick = 0;
            const frameName = `${this._layers[i].imgName}_${this._layers[i].currentFrame}`;
            this._layers[i].bitmap = this.loadPicture(frameName);
            return false;
        }
    }
    refreshRotation(i){
        let res = true;
        if( this._layers[i].rotation !=  this._layers[i].rotationGoal){

            this._layers[i].rotation = this._layers[i].rotation.approach(this._layers[i].rotationGoal, this._layers[i].rotationSpeed);
            if(this._layers[i].rotatMandatory)
                res = false;
        }
        return res;
    }
    refreshLayer(i){
        let needRefresh = true;
        if(!this.refreshOpacity(i)) needRefresh = false;
        if(!this.refreshPosition(i)) needRefresh = false;
        if(!this.refreshZoom(i)) needRefresh = false;
        if(!this.updateDuration(i))needRefresh = false;
        if(!this.refreshRotation(i))needRefresh = false;

        if(needRefresh)
            needRefresh = !this.refreshFrame(i)
        return needRefresh;
    }
    update() {
        super.update();
        let needRefresh = [];
        
        for(let i=0; i<11; i++){
            needRefresh[i] = this.refreshLayer(i);
        }
        if(!needRefresh.includes(false)){
            this.updateInputOk();

        }
        this.updateSkipInput();
        this.refreshBtns(needRefresh.includes(false));
        this._storyWindow.update();
        this.updateBg();
    }
    updateSkipInput(){
        if(this.isSkipEnable && (Input.isTriggered("cancel") || TouchInput.isCancelled())) {
            this._currentSequency = this._endSequency;
            SoundManager.playCancel();
            this.needToPressOk = false;
            this.updateCinematic();
        }else if (Input.isTriggered("cancel") || TouchInput.isCancelled()) {
            SoundManager.playBuzzer();
        }
    }
    updateInputOk(){
        if(!this.needToPressOk){
            this.passSequency();
        } else if ((Input.isTriggered("ok") || Input.isTriggered("jump") || Input.isTriggered("enter") || TouchInput.isTriggered())) {
            this.passSequency(true);
        }else if(this._tick > 1500){
            this.passSequency(true);
        }
        this._tick++;
    }
    passSequency(se){
      this._tick = 0;
      this._currentSequency++;
      if(se)
        SoundManager.playCursor();
      this.updateCinematic();
    }
}

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "Scene_Cinematic",
    icon                : "\u{2699}\u{FE0F}\u{1F532}",
    version             : "1.0.2",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader", "SC_CinematicConfig"],
    loadDataFiles       : SC.CinematicConfig.dataFiles,
    createObj           : {autoCreate  : false},
    autoSave            : false
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);