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
 * @plugindesc !SC [v1.1.0] Configuration pour les ombres dynamiques des personnages.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @orderAfter SC_CoreConfig
 *
 * @help
 * SC_ShadowConfig.js
 * 
 * Ce fichier de configuration définit si le système d'ombres dynamiques
 * pour les personnages doit être activé.
 * 
 * Il expose également plusieurs paramètres pour ajuster le comportement
 * des ombres en fonction des sauts des personnages.
 * 
 * ▸ Nécessite :
 *  - SC_SystemLoader.js
 * 
 * ▸ Historique :
 * v1.1.1: -ajout du paramètre 'shadowFileName' pour choisir le fichier d'ombre.
 * v1.1.0 - 2024-08-15 : Ajout des paramètres de configuration des ombres dynamiques.
 * v1.0.0 - 2024-08-01 : Création initiale du plugin pour les ombres dynamiques.
 *
 * @param useShadow
 * @text Utiliser les Ombres Dynamiques
 * @desc Si 'true', les personnages visuels auront une ombre découplée et dynamique.
 * @type boolean
 * @default true
 *
 * @param shadowYOffset
 * @text Décalage Y de l'Ombre
 * @desc Ajustement vertical de la position de l'ombre (en pixels). Une valeur négative la remonte.
 * @type number
 * @default 0
 *
 * @param jumpScaleRate
 * @text Taux de Réduction (Saut)
 * @desc Taux de réduction de la taille de l'ombre par pixel de hauteur de saut. Ex: 0.01.
 * @type number
 * @decimals 4
 * @default 0.01
 *
 * @param jumpOpacityRate
 * @text Taux d'Opacité (Saut)
 * @desc Perte d'opacité de l'ombre par pixel de hauteur de saut. Ex: 2.5.
 * @type number
 * @decimals 2
 * @default 2.5
 * 
 * @param shadowFileName
 * @type string
 * @text Nom du fichier d'Ombre
 * @default Shadow1
 * @desc Nom du fichier image de l'ombre à utiliser (dans le dossier 'img/system/').
 * Par default le systeme utilisera "Shadow1".
 * 
 */

SC.ShadowConfig = SC.ShadowConfig || {};

(() => {
    const params = PluginManager.parameters("SC_ShadowConfig");
    SC.ShadowConfig.useShadow = params.useShadow === 'true';
    SC.ShadowConfig.yOffset = parseInt(params.shadowYOffset) || 0;
    SC.ShadowConfig.jumpScaleRate = parseFloat(params.jumpScaleRate) || 0.01;
    SC.ShadowConfig.jumpOpacityRate = parseFloat(params.jumpOpacityRate) || 2.5;
    SC.ShadowConfig.fileName = params.shadowFileName || "Shadow1"; // Nom du fichier d'ombre par défaut.
})();

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ShadowConfig",
    version: "1.1.0",
    icon: "⚫",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);