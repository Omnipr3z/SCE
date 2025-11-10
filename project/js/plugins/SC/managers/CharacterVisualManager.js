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
 * @plugindesc !SC [v1.0.0] Gestionnaire visuel des personnages (Paper-doll).
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_Bitmap_Composite
 * @orderAfter SC_Bitmap_Composite
 *
 * @help
 * CharacterVisualManager.js
 * 
 * Ce manager est le "chef d'orchestre" du système de paper-doll.
 * Il est responsable de générer et de mettre en cache les sprites composites
 * des personnages en fonction de leur équipement.
 *
 * ▸ Principe de fonctionnement :
 *   1. Un sprite (ex: Sprite_Character) demande le bitmap pour un acteur via
 *      `$characterVisualManager.getCharacterBitmap(actorId)`.
 *   2. Le manager vérifie son cache. Si une version à jour existe, il la retourne.
 *   3. Sinon, il inspecte l'équipement de l'acteur, lit les notetags pour
 *      déterminer les couches graphiques, et utilise Bitmap_Composite pour
 *      générer un nouveau sprite.
 *   4. Le nouveau sprite est mis en cache et retourné.
 *
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *   - SC_Bitmap_Composite.js
 *
 * ▸ Historique :
 *   v1.0.0 - 2024-08-02 : Création initiale du manager et de sa structure de cache.
 */

class CharacterVisualManager {
    constructor() {
        this._cache = new Map(); // Cache pour les bitmaps composites
    }

    /**
     * Point d'entrée principal. Récupère le bitmap composite pour un acteur.
     * @param {number} actorId L'ID de l'acteur.
     * @returns {Bitmap|null} Le bitmap composite, ou null si l'acteur n'est pas valide.
     */
    getCharacterBitmap(actorId) {
        const actor = $gameActors.actor(actorId);
        if (!actor) {
            return null;
        }

        const cacheKey = this._generateCacheKey(actor);
        if (this._cache.has(cacheKey)) {
            return this._cache.get(cacheKey).bitmap;
        } else {
            return this._createAndCacheBitmap(actor, cacheKey);
        }
    }

    /**
     * Récupère l'entrée de cache complète pour un acteur, y compris le compositeur et l'état.
     * @param {number} actorId L'ID de l'acteur.
     * @returns {object|null} L'objet de cache ou null.
     */
    getCacheEntryByActorId(actorId) {
        const actor = $gameActors.actor(actorId);
        if (!actor) {
            return null;
        }
        const cacheKey = this._generateCacheKey(actor);
        return this._cache.get(cacheKey) || null;
    }

    /**
     * Crée une entrée dans le cache pour un acteur et lance la composition.
     * @param {Game_Actor} actor L'acteur pour lequel créer le bitmap.
     * @param {string} cacheKey La clé de cache pour cet acteur.
     * @returns {Bitmap} Le bitmap de destination (initialement vide).
     * @private
     */
    _createAndCacheBitmap(actor, cacheKey) {
        $debugTool.log(`CharacterVisualManager: Cache miss for key "${cacheKey}". Creating new composite.`);

        const composer = new Bitmap_Composite();
        
        // 1. Ajoute la couche de base de l'acteur
        const baseSprite = actor.characterName();
        if (baseSprite) {
            composer.addLayer(baseSprite, 0);
        }

        // 2. Ajoute les couches des équipements
        const visualLayerRegex = /<visualLayer:\s*(\S+)\s+(\d+)>/;
        for (const item of actor.equips()) {
            if (item && item.note) {
                const match = item.note.match(visualLayerRegex);
                if (match) {
                    composer.addLayer(match[1], parseInt(match[2]));
                }
            }
        }

        composer.loadLayers();

        // On crée un bitmap de destination. La taille est fixe pour l'instant.
        // C'est moins flexible mais plus stable.
        const bitmapWidth = SC.VisualConfig.bitmapSize.width;
        const bitmapHeight = SC.VisualConfig.bitmapSize.height;
        const destinationBitmap = new Bitmap(bitmapWidth, bitmapHeight);

        this._cache.set(cacheKey, {
            bitmap: destinationBitmap,
            composer: composer,
            actorState: cacheKey, // Sauvegarde de l'état qui a généré ce cache
            isReady: false // Le bitmap n'est pas encore dessiné
        });

        return destinationBitmap;
    }

    /**
     * Génère une clé de cache unique basée sur l'état visuel de l'acteur.
     * @param {Game_Actor} actor L'acteur.
     * @returns {string} La clé de cache.
     * @private
     */
    _generateCacheKey(actor) {
        // La clé est composée du nom du sprite de base de l'acteur et des IDs de tous ses équipements.
        // Si un seul de ces éléments change, la clé change, et le cache est invalidé.
        const baseName = actor.characterName();
        const equipIds = actor.equips().map(item => (item ? item.id : 0)).join('_');
        return `actor_${actor.actorId()}_${baseName}_equips_${equipIds}`;
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_CharacterVisualManager",
    version: "1.0.0",
    icon: "🧑‍🎨",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_Bitmap_Composite"],
    createObj: {
        autoCreate: true,
        classProto: CharacterVisualManager,
        instName: "$characterVisualManager"
    },
    autoSave: false // Le cache sera reconstruit au chargement, pas besoin de sauvegarder.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);