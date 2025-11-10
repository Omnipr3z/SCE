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
 * @plugindesc !SC [v0.1.0] Scène de carte étendue pour SimCraft Engine
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help Scene_ScMap.js
 * 
 *   ███████╗ ██████╗███████╗███╗   ██╗███████╗
 *   ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝
 *   ███████╗██║     █████╗  ██╔██╗ ██║█████╗  
 *   ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝  
 *   ███████║╚██████╗███████╗██║ ╚████║███████╗
 *   ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝
 * 
 * Ce fichier étend la Scene_Map de base pour y intégrer les fonctionnalités
 * spécifiques du SimCraft Engine, comme la gestion d'événements dynamiques
 * et de systèmes de jeu personnalisés.
 * 
 * ▸ Fonctionnalités Clés :
 *   - Extraction des métadonnées des événements dynamiques au chargement de la carte.
 *   - Liaison des événements à des acteurs de la base de données.
 *   - Point d'entrée pour les systèmes de jeu personnalisés (HUD, temps, etc.).
 *
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *   - DataManager.js (version SC)
 *   - SC_CharacterManager.js
 *
 * ▸ Historique :
 *   v0.1.1 - Utilisation de $characterManager au lieu de l'ancienne instance globale.
 *   v0.1.0 - Version initiale avec extraction des métadonnées des événements.
 */
/*:en
 * @target MZ
 * @plugindesc !SC [v0.1.1] SimCraft Engine's extended Map Scene
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help Scene_ScMap.js
 * 
 *   ███████╗ ██████╗███████╗███╗   ██╗███████╗
 *   ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝
 *   ███████╗██║     █████╗  ██╔██╗ ██║█████╗  
 *   ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝  
 *   ███████║╚██████╗███████╗██║ ╚████║███████╗
 *   ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝
 * 
 * This file extends the base Scene_Map to integrate SimCraft Engine's
 * specific features, such as dynamic event management and custom game systems.
 * 
 * ▸ Key Features:
 *   - Extracts metadata from dynamic events upon map loading.
 *   - Links events to database actors.
 *   - Entry point for custom game systems (HUD, time, etc.).
 *
 * ▸ Requires:
 *   - SC_SystemLoader.js
 *   - DataManager.js (SC version)
 *   - SC_CharacterManager.js
 *
 * ▸ History:
 *   v0.1.1 - Now uses $characterManager instead of the old global instance.
 *   v0.1.0 - Initial version with event metadata extraction.
 */
class Scene_ScMap extends Scene_Map{
    onMapLoaded() {
        this.extractScMetaData();
        this.registerMapCharacters();
        super.onMapLoaded();
    }

    extractScMetaData() {
        console.log("SC MetaData extraction for map " + $gameMap.mapId());

        // On s'assure que les données de la carte et les événements existent.
        if (!$dataMap || !$dataMap.events) {
            return;
        }

        // On parcourt tous les événements de la carte (sauf le premier qui est null).
        for (const eventData of $dataMap.events.filter(e => e)) {
            // On vérifie si l'événement a le notetag <dynamic>
            if (eventData.note.includes("<dynamic>")) {
                // Si oui, on extrait les métadonnées depuis son premier commentaire.
                const meta = DataManager.SC_extractEventMetaFromFirstComment(eventData);

                // On attache ces métadonnées directement à l'objet de données de l'événement.
                eventData.scMeta = meta;

                // Pour le débogage, on affiche ce qu'on a trouvé.
                console.log(`Event ${eventData.id} is dynamic. Meta found:`, meta);
            }
        }
    }

    registerMapCharacters() {
        // Réinitialiser le manager pour la nouvelle carte.
        $characterManager.reset();

        // Parcourir les objets Game_Event vivants sur la carte.
        for (const event of $gameMap.events()) {
            const eventData = event.event();
            // Vérifier si l'événement a nos métadonnées et un actorId.
            if (eventData.scMeta && eventData.scMeta.actorId) {
                const actorId = eventData.scMeta.actorId;
                // Enregistrer l'objet Game_Event dans le manager.
                $characterManager.addCharacter(event, actorId);
                console.log(`Character for actor ${actorId} registered from event ${event.eventId()}.`);
            }
        }
    }

    createSpriteset() {
        this._spriteset = new Spriteset_ScMap();
        this.addChild(this._spriteset);
        this._spriteset.update();
    }
}