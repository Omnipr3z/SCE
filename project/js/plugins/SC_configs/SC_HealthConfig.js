/**
 * ╔════════════════════════════════════════╗
 * ║                                        ║
 * ║ ███████╗ ██████╗███████╗ ║
 * ║ ██╔════╝██╔════╝██╔════╝ ║
 * ║ ███████╗██║     █████╗ ║
 * ║ ╚════██║██║     ██╔══╝ ║
 * ║ ███████║╚██████╗███████╗ ║
 * ║ ╚══════╝ ╚═════╝╚══════╝ ║
 * ║ S I M C R A F T   E N G I N E ║
 * ║________________________________________║
 */
/*:fr
 * @target MZ
 * @plugindesc !SC [v1.0.0] Fichier de configuration pour le système de santé.
 * @author SimCraft
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @param --- Breath System ---
 * @default
 *
 * @param breathDashDecreaseRate
 * @text Perte Souffle (Course)
 * @desc Vitesse à laquelle le souffle diminue en courant (par frame).
 * @type number
 * @decimals 2
 * @default 0.5
 *
 * @param breathWalkRecoverRate
 * @text Gain Souffle (Marche)
 * @desc Vitesse à laquelle le souffle remonte en marchant (par frame).
 * @type number
 * @decimals 2
 * @default 0.2
 *
 * @param breathStaticRecoverRate
 * @text Gain Souffle (Immobile)
 * @desc Vitesse à laquelle le souffle remonte en étant immobile (par frame).
 * @type number
 * @decimals 2
 * @default 0.6
 *
 * @param breathOutThreshold
 * @text Seuil Essoufflement
 * @desc Pourcentage de souffle en dessous duquel l'acteur est essoufflé.
 * @type number
 * @default 15
 *
 * @param breathRecoveredThreshold
 * @text Seuil Récupération
 * @desc Pourcentage de souffle à atteindre pour ne plus être essoufflé.
 * @type number
 * @default 80
 *
 * @param --- Dynamic Jump System ---
 * @default
 *
 * @param jumpMinBreathCost
 * @text Coût Souffle Saut
 * @desc Quantité de souffle minimale requise et consommée par un saut.
 * @type number
 * @default 20
 *
  * @param jumpBaseDistance
 * @text Distance Saut (Base)
 * @desc Distance de saut minimale sans élan (en cases).
 * @type number
 * @min 1
 * @default 1
 *
 * @param jumpMaxDistance
 * @text Distance Saut (Max)
 * @desc Distance de saut maximale avec élan complet (en cases).
 * @type number
 * @min 1
 * @default 4
 *
 * @param jumpImpulseThresholds
 * @text Seuils Impulsion Saut
 * @desc Liste des seuils d'impulsion pour augmenter la distance de saut, séparés par des virgules (ex: 20,50,90).
 * @type string
 * @default 20,50,90
 * 
 * @help
 * SC_HealthConfig.js
 * 
 * Ce fichier contient tous les paramètres de configuration pour le système
 * de santé des acteurs (ActorHealthManager).
 * 
 */

var Imported = Imported || {};
Imported.SC_HealthConfig = true;

var SimCraft = SimCraft || {};
SimCraft.Health = SimCraft.Health || {};


const pluginName = "SC_HealthConfig";
const params = PluginManager.parameters(pluginName);

const parseNumberArray = (string) => {
    if (!string) return [];
    return string.split(',').map(s => Number(s.trim()));
};

SC.HealthConfig = {
    // --- Breath System ---
    breathDashDecreaseRate: Number(params.breathDashDecreaseRate) || 0.5,
    breathWalkRecoverRate: Number(params.breathWalkRecoverRate) || 0.2,
    breathStaticRecoverRate: Number(params.breathStaticRecoverRate) || 0.6,
    breathOutThreshold: Number(params.breathOutThreshold) || 15,
    breathRecoveredThreshold: Number(params.breathRecoveredThreshold) || 80,

    // --- Dynamic Jump System ---
    jumpMinBreathCost: Number(params.jumpMinBreathCost) || 20,
    jumpBaseDistance: Number(params.jumpBaseDistance) || 1,
    jumpMaxDistance: Number(params.jumpMaxDistance) || 4,
    jumpImpulseThresholds: parseNumberArray(params.jumpImpulseThresholds) || [20, 50, 90],

};

// --- Plugin Registration ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_HealthConfig",
    version: "1.0.0",
    icon: "⚙️",
    author: "SimCraft",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["SC_SystemLoader"]
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);