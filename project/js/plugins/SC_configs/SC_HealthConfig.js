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

SimCraft.Health.Config = {
    // --- Breath System ---
    // Rate at which breath decreases when dashing (per frame)
    breathDashDecreaseRate: 0.5,
    // Rate at which breath recovers when walking (per frame)
    breathWalkRecoverRate: 0.2,
    // Rate at which breath recovers when static (per frame)
    breathStaticRecoverRate: 0.6,
    // The breath percentage at or below which the actor is considered "out of breath"
    breathOutThreshold: 15,
    // The breath percentage at or above which the actor is considered "recovered"
    breathRecoveredThreshold: 80,
};

SC.HealthConfig = SimCraft.Health.Config;

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