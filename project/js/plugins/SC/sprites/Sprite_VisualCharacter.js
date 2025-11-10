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
 * @plugindesc !SC [v1.0.0] Sprite pour les personnages visuels (paper-doll).
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_CharacterVisualManager
 * @orderAfter SC_CharacterVisualManager
 *
 * @help
 * Sprite_VisualCharacter.js
 * 
 * Ce sprite spécialisé est utilisé pour les acteurs qui ont le notetag <visual>.
 * Il hérite de Sprite_Character mais surcharge sa logique de mise à jour du bitmap
 * pour utiliser le CharacterVisualManager.
 * 
 * Il ne contient aucune logique de composition d'image ; il se contente de
 * demander le bitmap composite au manager et de gérer son affichage, y compris
 * l'état de chargement pour éviter les défauts visuels.
 *
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *   - SC_CharacterVisualManager.js
 *
 * ▸ Historique :
 *   v1.0.0 - 2024-08-02 : Création initiale et intégration avec CharacterVisualManager.
 */

class Sprite_VisualCharacter extends Sprite_Character {
    
    updateBitmap() {
        if (this.isImageChanged()) {
            this._characterName = this._character.characterName(); // Pour référence
            this._characterIndex = this._character.characterIndex();
            this.setVisualBitmap();
        }
    }

    setVisualBitmap() {
        const actor = this.getActor();
        if (!actor) return;
        const actorId = actor.actorId();
        this.bitmap = $characterVisualManager.getCharacterBitmap(actorId);
    }

    updateFrame() {
        const actor = this.getActor();
        if (!actor) {
            super.updateFrame();
            return;
        }

        // Avant de mettre à jour la frame, on vérifie si le bitmap est prêt.
        // Le manager nous a donné un bitmap, mais il est peut-être encore en cours de composition.
        const cacheEntry = $characterVisualManager.getCacheEntryByActorId(actor.actorId());
        if (cacheEntry && !cacheEntry.isReady) {
            const composer = cacheEntry.composer;
            // Petite sécurité supplémentaire : si le compositeur n'existe pas, on ne fait rien.
            if (!composer) return;

            if (composer.isReady()) {
                // Le chargement est terminé, on peut dessiner !
                composer.bltComposite(this.bitmap);
                cacheEntry.isReady = true; // On marque comme prêt pour ne pas le refaire.

                $debugTool.log(`Sprite_VisualCharacter: Composite ready for actor ${actor.actorId()}.`); // Ce log est toujours utile.
            }
        }
        super.updateFrame();
    }

    /**
     * [SURCHARGE] Calcule la largeur d'une seule case (pattern) du sprite.
     * Pour un sprite de personnage unique, la largeur totale est divisée par 3.
     * @returns {number}
     */
    patternWidth() {
        return this.bitmap ? this.bitmap.width / 3 : 0;
    }

    /**
     * [SURCHARGE] Calcule la hauteur d'une seule case (pattern) du sprite.
     * Pour un sprite de personnage unique, la hauteur totale est divisée par 4.
     * @returns {number}
     */
    patternHeight() {
        return this.bitmap ? this.bitmap.height / 4 : 0;
    }

    /**
     * Récupère l'objet Game_Actor associé à ce sprite, que le personnage
     * soit le joueur principal ou un follower.
     * @returns {Game_Actor|null}
     */
    getActor() {
        if (this._character === $gamePlayer) {
            return $gameParty.leader();
        } else if (this._character.actor) { // Game_Follower a une méthode actor()
            return this._character.actor();
        }
        return null;
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Sprite_VisualCharacter",
    icon: "🧍",
    version: "1.0.0",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_CharacterVisualManager"],
    createObj: { autoCreate: false } // C'est une classe, pas une instance globale.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);