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
 * @plugindesc !SC [v0.3.0] Chargeur de système, dépendances et instances.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help sysLoader.js
 * 
 * Ce module initialise le moteur SimCraft et contrôle le chargement
 * des composants, la création des instances et la surcharge des classes statiques.
 * 
 * ▸ Fonctions principales :
 *   - Gère l'enregistrement des plugins et la vérification des dépendances.
 *   - Centralise la création des instances de plugins (`autoCreate`).
 *   - Gère la surcharge des classes statiques via le paramètre `surchargeClass`.
 * 
 * ▸ Historique :
 *   v0.3.0 - Ajout de la gestion de création d'instances et de surcharge de classes.
 *   v0.2.1 - Chargement automatique de base + vérification de dépendances.
 */
class System_Loader {
    constructor() {
        this._pluginsList = {};
        this.selfLoad();
    }

    selfLoad() {
        const pluginInfo = {
            name: "SC_SystemLoader",
            version: "0.3.0",
            icon: "⚙️",
            author: AUTHOR,
            license: LICENCE,
            dependencies: [],
            loadDataFiles: [],
            createObj: { autoCreate: false },
            autoSave: false
        }
        this.checkPlugin(pluginInfo);
    }

    checkPlugin(plugin) {
        let allDependenciesOk = true;

        plugin.dependencies.forEach((requiredDependency) => {
            if (!this._pluginsList[requiredDependency]) {
                $debugTool.drawDependencyError(plugin, requiredDependency);
                allDependenciesOk = false;
            }
        }, this);

        if (allDependenciesOk) {
            this._pluginsList[plugin.name] = plugin;
            $debugTool.drawPluginLoaded(plugin);
        }
        return allDependenciesOk;
    }

    initializeScPlugins() {
        $debugTool.group("SC GAME OBJECT CREATION");
        for (const pluginKey in this._pluginsList) {
            const plugin = this._pluginsList[pluginKey];
            if (!plugin.createObj) continue;

            // Cas 1: Surcharge d'une classe statique
            if (plugin.surchargeClass) {
                const newInstance = new plugin.createObj.classProto();
                this._extendStaticInstance(newInstance, plugin.surchargeClass);
                $debugTool.drawInstanceCreated(plugin);
            }
            // Cas 2: Création d'une instance globale standard
            else if (plugin.createObj.autoCreate && !window[plugin.createObj.instName]) {
                window[plugin.createObj.instName] = new plugin.createObj.classProto();
                $debugTool.drawInstanceCreated(plugin);
            }
        }
        $debugTool.groupEnd();
    }

    _extendStaticInstance(instance, originalClassName) {
        const originalStaticClass = window[originalClassName];
        if (!originalStaticClass) {
            $debugTool.error(`Cannot surcharge: Original static class "${originalClassName}" not found.`);
            return;
        }

        // Copier les propriétés/méthodes de l'objet statique original vers la nouvelle instance
        for (const key in originalStaticClass) {
            // On ne copie que si la propriété n'est pas déjà définie sur l'instance
            // (les méthodes de la classe ont la priorité)
            if (typeof instance[key] === 'undefined') {
                instance[key] = originalStaticClass[key];
            }
        }

        // Remplacer l'objet statique global par notre nouvelle instance améliorée
        window[originalClassName] = instance;
    }
}
$simcraftLoader = new System_Loader();