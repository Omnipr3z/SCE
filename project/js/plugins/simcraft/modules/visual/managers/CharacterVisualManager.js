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
 * @plugindesc !SC [v1.1.0] Gestionnaire visuel des personnages (Paper-doll).
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
 *   v1.1.0 - 2024-08-03 : Ajout de la gestion des couches arrière (visualBackLayer) pour un "paper-doll" complet.
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
        const mainManager = $actorsMM.actor(actorId);
        if (!mainManager || !mainManager.actor) {
            return null;
        }

        const cacheKey = this._generateCacheKey(mainManager);
        if (this._cache.has(cacheKey)) {
            return this._cache.get(cacheKey).bitmap;
        } else {
            return this._createAndCacheBitmap(mainManager, cacheKey);
        }
    }
    /**
     * Récupère l'entrée de cache complète pour un acteur, y compris le compositeur et l'état.
     * @param {number} actorId L'ID de l'acteur.
     * @returns {object|null} L'objet de cache ou null.
     */
    getCacheEntryByActorId(actorId) {
        const mainManager = $actorsMM.actor(actorId);
        if (!mainManager || !mainManager.actor) {
            return null;
        }
        const cacheKey = this._generateCacheKey(mainManager);
        return this._cache.get(cacheKey) || null;
    }
    _matchVisualEquipBckLayer(item){
        const backLayerRegex = /<visualBackLayer:\s*(\S+)\s+(\d+)>/;

        if(item && item.note) {
            return item.note.match(backLayerRegex);
        }
        return null;
    }
    _matchVisualEquipFrtLayer(item){
        const frontLayerRegex = /<visualLayer:\s*(\S+)\s+(\d+)>/;

        if(item && item.note) {
            return item.note.match(frontLayerRegex);
        }
        return null;
    }
    _shouldDisplayFaceLayer(actor) {
        const faceLayerRegex = /<useFaceLayer>/;
        if(actor && actor.note) {
            return actor.note.match(faceLayerRegex)
                && SC.VisualConfig.useFaceLayer;
        }
        return false; // Par défaut, on affiche pase la couche face
    }
    _needHair(actor){
        // La variable 'actor' est une instance de Game_Actor.
        // Pour accéder à ses données de base (notetags, nom, etc.), on utilise la méthode .actor().
        const actorData = actor ? actor.actor() : null;
        const hairRegex = /<useHairLayer>/;
        if(actorData && actorData.note) {
            return actorData.note.match(hairRegex)
                && SC.VisualConfig.useHairLayer;
        }
        return false; // Par défaut, on affiche pase la couche hair
    }
    /**
     * Crée une entrée dans le cache pour un acteur et lance la composition.
     * @param {ActorMainManager} mainManager Le manager principal de l'acteur.
     * @param {string} cacheKey La clé de cache pour cet acteur.
     * @returns {Bitmap} Le bitmap de destination (initialement vide).
     * @private
     */
    _createAndCacheBitmap(mainManager, cacheKey) {
        const actor = mainManager.actor;
        $debugTool.log(`CharacterVisualManager: Cache miss for key "${cacheKey}". Creating new composite.`, true);
        
        // 1. Initialisation du compositeur
        // On crée une nouvelle instance de Bitmap_Composite qui va se charger d'assembler les différentes couches d'images.
        const composer = new Bitmap_Composite();

        // --- Phase 1: Couches Arrière ---
        // On parcourt tous les équipements de l'acteur pour trouver les couches qui doivent s'afficher DERRIÈRE le personnage (ex: capes).
        let backLayerCount = 0;
        actor.equips().forEach((item) => {
            const match = this._matchVisualEquipBckLayer(item);
            if (match) {
                // Si un notetag <visualBackLayer> est trouvé, on ajoute la couche au compositeur avec son z-index.
                composer.addLayer(match[1], parseInt(match[2]));
                backLayerCount++;
            }
        });

        // --- Phase 2: Couche de Base ---
        // On ajoute le corps du personnage (la base) et potentiellement son visage
        const baseSprite = actor.characterName();

        if (baseSprite) {
            // Le z-index de la base est `backLayerCount`, ce qui la place juste au-dessus de toutes les couches arrière.
            composer.addLayer(baseSprite, backLayerCount);
            backLayerCount++;
            // On vérifie si une couche de visage doit être ajoutée.
            if(this._shouldDisplayFaceLayer(actor)) {
                const faceSprite = actor.name() + "_face";
                // Le visage est ajouté juste au-dessus de la couche de base.
                backLayerCount++;
                composer.addLayer(faceSprite, backLayerCount + backLayerCount);
                
            }
        }

        // --- Phase 3: Couches Avant ---
        // C'est la partie la plus complexe. On parcourt à nouveau les équipements pour ajouter les couches avant (armures, etc.) et les cheveux.
        actor.equips().forEach((item) => {
            // On cherche une couche d'équipement avant (<visualLayer>).
            const match = this._matchVisualEquipFrtLayer(item);
            if (match) {
                // On calcule le z-index de cette couche d'équipement.
                // Il est basé sur le z-index du notetag, auquel on ajoute le nombre de couches de base et arrière.
                if(parseInt(match[2]) != SC.VisualConfig.hairLayerZIndex){
                    const layerIndex = parseInt(match[2]) + backLayerCount;
                    composer.addLayer(match[1], layerIndex);
                }else{
                    $debugTool.error(`Le z-index ${SC.VisualConfig.hairLayerZIndex} est resérvé à la couche des cheveux.
                        Veuillez utiliser un autre index pour l'équipement '${item.id}:${item.name}'.`);
                }
            }
        });

        // Si, après avoir parcouru tous les équipements, les cheveux n'ont toujours pas été ajoutés,
        // on fait une dernière vérification. C'est un filet de sécurité si la condition dans la boucle n'a jamais été remplie.
        if(this._needHair(actor)){
            composer.addLayer(actor.name() + "_hair", SC.VisualConfig.hairLayerZIndex  + backLayerCount);
        }

        // 4. Lancement du chargement
        // Maintenant que toutes les couches sont listées, on demande au compositeur de commencer à charger les images.
        composer.loadLayers();

        // 5. Création du Bitmap de destination et mise en cache
        // On crée un bitmap de destination. La taille est fixe pour l'instant.
        // C'est moins flexible mais plus stable.
        const bitmapWidth = SC.VisualConfig.bitmapSize.width;
        const bitmapHeight = SC.VisualConfig.bitmapSize.height;
        const destinationBitmap = new Bitmap(bitmapWidth, bitmapHeight);

        // On stocke tout dans le cache : le bitmap final (encore vide), le compositeur, et un drapeau `isReady`.
        // Le sprite (`Sprite_VisualCharacter`) utilisera ce drapeau pour savoir quand le dessin final peut être effectué.
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
     * @param {ActorMainManager} mainManager Le manager principal de l'acteur.
     * @returns {string} La clé de cache.
     * @private
     */
    _generateCacheKey(mainManager) {
        const actor = mainManager.actor;
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
    version: "1.1.0",
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