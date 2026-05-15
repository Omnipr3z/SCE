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
 * @plugindesc !SC [v0.4.0] Chargeur de système, dépendances et instances.
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
        if(plugin.dependencies)
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

    surchargeStaticClasses() {
        $debugTool.group("SC STATIC CLASS SURCHARGE");
        for (const pluginKey in this._pluginsList) {
            const plugin = this._pluginsList[pluginKey];
            if (plugin.surchargeClass && plugin.createObj && plugin.createObj.classProto) {
                this._extendStaticClass(plugin.createObj.classProto, plugin.surchargeClass, plugin);
            }
        }
        $debugTool.groupEnd();
    }

    createScGameObjects() {
        $debugTool.group("SC GAME OBJECT CREATION");
        for (const pluginKey in this._pluginsList) {
            const plugin = this._pluginsList[pluginKey];
            if (plugin.createObj && plugin.createObj.autoCreate && !plugin.surchargeClass && !window[plugin.createObj.instName]) {
                window[plugin.createObj.instName] = new plugin.createObj.classProto();
                $debugTool.drawInstanceCreated(plugin);
            }
        }
        $debugTool.groupEnd();
    }

    _extendStaticClass(surchargeClassProto, className, plugin) {
        const originalStaticClass = window[className];
        if (!originalStaticClass) {
            $debugTool.error(`Cannot surcharge: Original static class "${className}" not found.`);
            return;
        }

        const instance = new surchargeClassProto();
        this._surchargedInstances = this._surchargedInstances || {};
        this._surchargedInstances[className] = instance;

        // Greffer les méthodes de la classe de surcharge sur la classe statique originale.
        // On utilise .bind(instance) pour s'assurer que le 'this' à l'intérieur
        // des méthodes de surcharge fait toujours référence à l'instance qui contient
        // les propriétés (_nameToCodeMap, etc.), et non à la classe statique (Input, DataManager...).
        for (const methodName of Object.getOwnPropertyNames(surchargeClassProto.prototype)) {
            if (methodName !== 'constructor') {
                const method = surchargeClassProto.prototype[methodName];
                originalStaticClass[methodName] = method.bind(instance);
            }
        }
        $debugTool.log(`🔌 ${plugin.icon} ${plugin.name.toUpperCase()} → Surchargé sur ${plugin.surchargeClass}`);

        // Si la classe de surcharge a une méthode setupSurcharge, on l'appelle maintenant.
        // C'est le point d'entrée pour la logique d'initialisation qui doit se faire après la surcharge.
        if (typeof instance.setupSurcharge === "function") {
            instance.setupSurcharge();
        }
    }
}
const $simcraftLoader = new System_Loader();



