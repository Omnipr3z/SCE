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
 * @plugindesc !SC [v1.0.0] Patch pour mettre à jour la santé des acteurs sur la carte.
 * @author SimCraft
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base ActorsHealthManagers
 * @orderAfter ActorsHealthManagers
 *
 * @help
 * SceneMap_HealthPatch.js
 * 
 * Ce patch étend Scene_Map pour appeler la méthode de mise à jour
 * (mapUpdate) de l'ActorHealthManager pour chaque acteur présent sur la carte.
 * 
 * Il s'assure qu'un acteur n'est mis à jour qu'une seule fois par frame,
 * même s'il est présent à la fois dans l'équipe du joueur et en tant
 * qu'événement sur la carte.
 *
 */

(() => {

    const _SceneMap_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _SceneMap_update.call(this);
        if ($actorHealthManagers) {
            this.updateActorsHealth();
        }
    };

    /**
     * [NOUVEAU] Appelle la méthode mapUpdate() pour chaque acteur unique sur la carte.
     */
    Scene_Map.prototype.updateActorsHealth = function() {
        const updatedActorIds = new Set();

        const updateActorHealth = (actor) => {
            if (actor && !updatedActorIds.has(actor.actorId())) {
                const healthManager = $actorHealthManagers.manager(actor.actorId());
                if (healthManager) {
                    healthManager.mapUpdate();
                }
                updatedActorIds.add(actor.actorId());
            }
        };

        // Met à jour les membres du groupe (joueur + suivants)
        $gameParty.members().forEach(actor => updateActorHealth(actor));

        // Met à jour les acteurs représentés par des événements
        $gameMap.events().forEach(event => {
            // On suppose que l'événement peut être lié à un acteur via une propriété ou une méta-donnée.
            // Pour l'instant, on vérifie si l'événement a une méthode actor().
            if (typeof event.actor === "function") {
                const actor = event.actor();
                updateActorHealth(actor);
            }
        });
    };

    // --- Enregistrement du plugin ---
    SC._temp = SC._temp || {};
    SC._temp.pluginRegister = {
        name: "SC_SceneMap_HealthPatch",
        version: "1.0.0",
        icon: "❤️‍🩹",
        author: "SimCraft",
        license: "CC BY-NC-SA 4.0",
        dependencies: ["SC_SystemLoader", "SC_ActorsHealthManagers"],
        createObj: null,
        save: null
    };
    $simcraftLoader.checkPlugin(SC._temp.pluginRegister);

})();