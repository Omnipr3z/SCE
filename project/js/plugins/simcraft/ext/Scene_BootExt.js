// --- Point d'entrée pour la surcharge ---
// On s'accroche à Scene_Boot.create, qui est appelé avant DataManager.loadDatabase.
// C'est le moment idéal pour surcharger les classes statiques.

const _Scene_Boot_create = Scene_Boot.prototype.create;
Scene_Boot.prototype.create = function() {
    $simcraftLoader.surchargeStaticClasses(); // On surcharge AVANT l'appel original
    _Scene_Boot_create.call(this, ...arguments);
    $debugTool.closeAllGroups(); // On ferme tous les groupes ouverts à la fin du boot.

    // Demande le plein écran si configuré, après que tout soit initialisé.
    if (SC.GraphicsConfig && SC.GraphicsConfig.defaultMode === 'Fullscreen') {
        Graphics._requestFullScreen();
    }
};


Scene_Boot.prototype.startNormalGame = function() {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        $debugTool.log("========= EXECTUTION ========");
        if (SC.CinematicConfig.useSplash && !DEBUG_OPTIONS.skipTitle && !DEBUG_OPTIONS.forceSkipSplash){
            SC._temp.requestedCinematic = SC.CinematicConfig.splashCinematicName;
            SceneManager.goto(Scene_Cinematic);
        }else if(!DEBUG_OPTIONS.skipTitle){
            SceneManager.goto(Scene_Title);
        }else{
            this._commandWindow = {};
            this._commandWindow.close = ()=>{};
            Scene_Title.prototype.commandNewGame.call(this)
        }
    }
    

const _Scene_Boot_adjustWindow = Scene_Boot.prototype.adjustWindow;
Scene_Boot.prototype.adjustWindow = function() {
    const config = SC.GraphicsConfig;
    if (config.defaultMode !== 'Fullscreen') {
        _Scene_Boot_adjustWindow.call(this, ...arguments);
    }
    // Si le mode par défaut est 'Fullscreen', on ne fait rien pour éviter d'annuler le plein écran.
};