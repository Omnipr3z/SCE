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
 * @plugindesc !SC [v1.0.0] Patch pour lancer un splash screen au démarrage.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_CinematicConfig
 * @base Scene_Cinematic
 * @orderAfter SC_CinematicConfig
 * @orderAfter Scene_Cinematic
 *
 * @help
 * Scene_Boot_SplashPatch.js
 * 
 * Ce patch surcharge la scène de démarrage (Scene_Boot) pour lancer une
 * cinématique en tant que splash screen avant l'écran-titre, si l'option
 * est activée dans SC_CinematicConfig.
 */

Scene_Boot.prototype.startNormalGame = function() {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        $debugTool.log("========= EXECTUTION ========");
        if (SC.CinematicConfig.useSplash){
            SC._temp.requestedCinematic = SC.CinematicConfig.splashCinematicName;
            SceneManager.goto(Scene_Cinematic);
        }else{
            SceneManager.goto(Scene_Title);
        }
}
// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Scene_Boot_SplashPatch",
    version: "1.0.0",
    icon: "🎬",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_CinematicConfig", "Scene_Cinematic"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);