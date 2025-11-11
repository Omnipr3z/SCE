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
 * @param splashCinematicName
 * @text Nom de la Cinématique Splash
 * @desc Le nom du fichier de la cinématique à utiliser comme splash screen.
 * @type string
 * @default cinematic
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