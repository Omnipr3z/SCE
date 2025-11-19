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
 * @plugindesc !SC [v1.0.0] Configuration pour les animations et séquences d'actions.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * SC_AnimConfig.js
 * 
 * Ce fichier de configuration permet de définir les animations personnalisées
 * et les séquences d'actions pour les personnages.
 *
 * @param sequences
 * @text Séquences d'actions
 * @desc Définissez des séquences d'animations qui peuvent être jouées en chaîne.
 * @type struct<Sequence>[]
 * @default []
 */

/*~struct~Sequence:fr
 * @param name
 * @text Nom de la séquence
 * @desc Le nom unique pour appeler cette séquence (ex: "victory_pose").
 * @type string
 *
 * @param actions
 * @text Actions de la séquence
 * @desc La liste des noms d'animations à jouer, dans l'ordre.
 * @type string[]
 */

SC.SequenceConfig = SC.SequenceConfig || {};

(() => {
    const params = PluginManager.parameters("SC_ActionSequencesConfig");

    // --- Traitement des Séquences ---
    SC.SequenceConfig.sequences = {}; 
    const sequencesParam = JSON.parse(params.sequences || "[]");

    for (const seq of sequencesParam) {
        const sequenceData = JSON.parse(seq);
        if (sequenceData.name) {
            SC.SequenceConfig.sequences[sequenceData.name] = JSON.parse(sequenceData.actions || "[]");
        }
    }

    // NOTE: La configuration des animations individuelles sera ajoutée ici plus tard.

})();

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_AnimConfig",
    version: "1.0.0",
    icon: "🎬",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);