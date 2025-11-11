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
 * @plugindesc !SC [v1.0.2] Configuration pour le chargement des données de cinématiques.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @orderAfter SC_CoreConfig
 *
 * @help
 * SC_CinematicConfig.js
 * 
 * Ce plugin permet de définir la liste de tous les fichiers de données
 * de cinématiques (.json) à charger depuis le dossier `data/SC/`.
 *
 * @param useSplash
 * @text Utiliser un Splash Screen
 * @desc Si 'true', lance une cinématique avant l'écran-titre au démarrage du jeu.
 * @type boolean
 * @default true
 * 
 * 
 * @param Debug - Force Skip Splash
 * @text Forcer l'activation de skip sur le splash et les cinematics (Si vous utili)
 * @type boolean
 * @default false
 * @desc Si 'true', le splash screen sera toujours sauté, même si 'Passer l'écran-titre' est désactivé.
 * Utile pour tester uniquement l'écran-titre.
 *
 * @param splashCinematicName
 * @text Nom de la Cinématique Splash
 * @desc Le nom du fichier de la cinématique à utiliser comme splash screen.
 * @type string
 * @default cinematic
 *
 * @param skipDefaultEnabled
 * @text Activer le "Skip" par défaut
 * @parent skipDefaultMode
 * @type boolean
 * @default true
 *
 * @param skipDefaultMode
 * @text Mode de "Skip" par défaut
 * @desc Le comportement par défaut pour passer les cinématiques.
 * @type select
 * @option Toujours possible
 * @value always
 * @option Jamais possible
 * @value never
 * @option Si une sauvegarde existe
 * @value saveExisting
 * @default saveExisting
 *
 * @param skipDefaultBitmap
 * @text Image du bouton "Skip"
 * @parent skipDefaultMode
 * @type file
 * @dir img/cinematics/Hud/
 *
 * @param cinematicFiles
 *
 * @param cinematicFiles
 * @text Fichiers de Cinématiques
 * @desc Liste des noms de fichiers de données de cinématiques à charger (sans l'extension .json).
 * @type string[]
 * @default ["Cinematics", "Prologue_40k"]
 */

SC.CinematicConfig = SC.CinematicConfig || {};

(() => {
    const pluginName = "SC_CinematicConfig";
    const params = PluginManager.parameters(pluginName);

    SC.CinematicConfig.useSplash = params.useSplash === 'true';
    SC.CinematicConfig.splashCinematicName = params.splashCinematicName.trim() || 'cinematic';
    DEBUG_OPTIONS.forceSkipSplash =  params["Debug - Force Skip Splash"] === "true";

    SC.CinematicConfig.skipDefaultMode = {
        enabled: params.skipDefaultEnabled === 'true',
        mode: params.skipDefaultMode || "saveExisting",
        buttonBitmap: params.skipDefaultBitmap || "Skip",
        buttonX: 750, // Valeurs par défaut codées en dur pour l'instant
        buttonY: 550
    };
    
    const files = JSON.parse(params.cinematicFiles || "[]");

    // C'est la responsabilité de la config de préparer la structure pour le loader.
    SC.CinematicConfig.dataFiles = files.map(filename => {
        // Le nom de l'instance globale sera $data<NomDuFichier>
        const instName = `$data${filename.trim().charAt(0).toUpperCase() + filename.slice(1)}`;
        return { filename: filename, instName: instName };
    });

})();

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_CinematicConfig",
    version: "1.0.2",
    icon: "🎞️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);