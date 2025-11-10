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
 * @plugindesc !SC [v1.0.0] Patch pour la gestion des Poses via l'équipement.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_Game_Actor_PosePatch
 * @orderAfter SC_Game_Actor_PosePatch
 *
 * @help
 * Game_Actor_EquipmentPosePatch.js
 * 
 * Ce patch étend le système de Poses. Il permet à un équipement de forcer
 * une pose spécifique sur un acteur via le notetag <forcePose: poseName>.
 *
 * La pose forcée par l'équipement a la priorité sur la pose manuellement
 * définie sur l'acteur.
 *
 * ▸ Notetag à utiliser sur les équipements (Armes, Armures) :
 *   <forcePose: nom_de_la_pose>
 *   Exemple: <forcePose: rifle>
 *
 * ▸ Historique :
 *   v1.0.0 - 2024-08-03 : Création initiale du patch.
 */

//=============================================================================
// Game_Actor
//=============================================================================

/**
 * [NOUVEAU] Vérifie les équipements de l'acteur et retourne la première pose forcée trouvée.
 * @returns {string|null} Le nom de la pose forcée, ou null si aucune n'est trouvée.
 */
Game_Actor.prototype.getEquipmentPose = function() {
    for (const item of this.equips()) {
        if (item) {
            if(!item.meta)
                DataManager.extractMetadata(item);
            if(item.meta.forcePose)
                return item.meta.forcePose;
        }
    }
    return null;
};

// --- Surcharge de getPose pour intégrer la logique de l'équipement ---

const _Game_Actor_getPose = Game_Actor.prototype.getPose;
Game_Actor.prototype.getPose = function() {
    // La pose forcée par l'équipement a la priorité.
    const equipmentPose = this.getEquipmentPose();
    if (equipmentPose) {
        return equipmentPose;
    }
    // Sinon, on retourne le comportement original (pose manuelle ou 'default').
    return _Game_Actor_getPose.call(this);
};

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Game_Actor_EquipmentPosePatch",
    version: "1.0.0",
    icon: "🥋",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_Game_Actor_PosePatch"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);