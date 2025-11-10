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
 * @plugindesc !SC [v1.0.1] Gestionnaire des options graphiques.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_GraphicsConfig
 * @orderAfter SC_GraphicsConfig
 *
 * @help
 * GraphicsManager.js
 * 
 * Ce module gère la logique de changement de résolution et de mode
 * d'affichage (fenêtré, plein écran). Il lit la configuration depuis
 * SC_GraphicsConfig.js et impose une résolution rigide pour éviter le
 * flou de la mise à l'échelle dynamique.
 *
 * ▸ Historique :
 *   v1.0.1 - 2024-08-01 : Implémentation de la surcharge rigide de Graphics.resize
 *                        et neutralisation de Scene_Boot.adjustWindow.
 *   v1.0.0 - 2024-07-31 : Création initiale du module.
 */
const _Graphics_initialize = Graphics.initialize;
class Graphics_SC {

    resize(width, height) { // eslint-disable-line no-unused-vars
    
        const config = SC.GraphicsConfig;
        if (config.defaultMode === 'Fullscreen') {
            $debugTool.log(`Mode: Fullscreen. Using screen dimensions: ${screen.width}x${screen.height}`, true);
            width = screen.width;
            height = screen.height;
            
        } else { // Windowed
            $debugTool.log(`Mode: Windowed. Using configured resolution: ${config.defaultResolution.width}x${config.defaultResolution.height}`, true);
            width = config.defaultResolution.width;
            height = config.defaultResolution.height;
        }
        // On met à jour les valeurs de $dataSystem pour la cohérence
        $dataSystem.advanced.screenWidth = width;
        $dataSystem.advanced.screenHeight = height;
        // On met à jour les propriétés de Graphics
        Graphics._width = width;
        Graphics._height = height;
        Graphics._app.renderer.resize(width, height);
        Graphics._updateAllElements();
        
    };
};

const _Scene_Boot_adjustWindow = Scene_Boot.prototype.adjustWindow;
Scene_Boot.prototype.adjustWindow = function() {
    const config = SC.GraphicsConfig;
    if (config.defaultMode !== 'Fullscreen') {
        _Scene_Boot_adjustWindow.call(this, ...arguments);
    }
    // Si le mode par défaut est 'Fullscreen', on ne fait rien pour éviter d'annuler le plein écran.
};

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {}; // Assure que SC._temp existe
SC._temp.pluginRegister = { // Utilise l'ancien système d'enregistrement pour la cohérence
    name: "SC_GraphicsManager",
    version: "1.0.1",
    icon: "🖥️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_GraphicsConfig"],
    createObj: { 
        autoCreate: false, // Ne pas créer d'instance globale
        classProto: Graphics_SC
    },
    surchargeClass: "Graphics", // Indique que cette classe surcharge Graphics
    autoSave: false
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);