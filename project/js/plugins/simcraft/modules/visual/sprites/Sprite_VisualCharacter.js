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
 * @plugindesc !SC [v1.2.7] Sprite pour les personnages visuels (paper-doll).
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
 *   v1.2.7 - 2024-08-03 : Ajout de la gestion de l'échelle et de l'opacité de l'ombre pendant le saut.
 *   v1.2.6 - 2024-08-03 : Ajout d'un paramètre de configuration pour le décalage Y de l'ombre.
 *   v1.2.5 - 2024-08-03 : Ajout de la logique pour que l'ombre reste au sol pendant un saut.
 *   v1.2.4 - 2024-08-03 : Correction de la dépendance de l'ombre (elle ne connaît plus son parent).
 *   v1.2.3 - 2024-08-03 : Ajout de la gestion d'une ombre externe pour une superposition correcte.
 *   v1.2.2 - 2024-08-03 : Découplage du système d'ombre dans un patch dédié pour une meilleure modularité.
 *   v1.2.1 - 2024-08-03 : Ajout d'une condition de configuration pour activer/désactiver l'ombre dynamique.
 *   v1.2.0 - 2024-08-03 : Ajout d'un sprite d'ombre découplé pour une gestion dynamique.
 *   v1.1.1 - 2024-08-03 : Utilisation de la configuration (VisualConfig) pour le calcul des blocs de personnages.
 *   v1.1.0 - 2024-08-03 : Stabilisation du module, validation du rafraîchissement et de la gestion de l'index.
 *   v1.0.1 - 2024-08-03 : Remplacement du notetag par la configuration centralisée via varConfig.js pour l'index visuel.
 *   v1.0.0 - 2024-08-02 : Création initiale et intégration avec CharacterVisualManager.
 */

class Sprite_VisualCharacter extends Sprite_Character {
    initialize(character) {
        super.initialize(character);
        this._shadowSprite = null;
    } 

    update() {
        super.update();
        if (this._shadowSprite) {
            this.updateShadow();
        }
    }
    updateBitmap() {
        if (this.isImageChanged()) {
            this._characterName = this._character.characterName(); // Pour référence
            this._characterIndex = this.getCharacterIndex();
            this.setVisualBitmap();
            // [CORRECTION] Force la réinitialisation de la frame.
            // Sans cela, même si l'index change, le sprite continue d'afficher l'ancienne frame.
            // Mettre _frame.width à 0 force updateFrame() à tout recalculer.
            this._frame.width = 0;
        }
    }

    /**
     * [SURCHARGE] Vérifie si l'image du personnage a changé.
     * Utilise notre méthode centralisée `getCharacterIndex` pour la comparaison.
     * @returns {boolean}
     */
    isImageChanged() {
        const newIndex = this.getCharacterIndex();
        const nameChanged = this._characterName !== this._character.characterName();
        const indexChanged = this._characterIndex !== newIndex;
        return nameChanged || indexChanged;
    }
    /**
     * [SURCHARGE] Empêche le remplacement du bitmap par une tuile (ex: buissons).
     *
     * Contrairement à la méthode de base, nous ne remplaçons PAS le bitmap par une tuile.
     * Nous conservons notre bitmap composite pour afficher les équipements.
     * Cependant, nous mettons à jour `_characterName` et `_characterIndex` pour que
     * `isImageChanged()` détecte correctement le changement d'état (entrée/sortie de buisson)
     * et rafraîchisse le sprite si nécessaire.
     */
    setTileBitmap() {
        // Si le personnage est sur une tuile spéciale (comme un buisson)
        if (this._character.tileId() > 0) {
            // Nous ne remplaçons PAS le bitmap par une tuile.
            this._characterName = "";    // Réinitialise le nom du personnage
            this._characterIndex = -1;   // Réinitialise l'index du personnage
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
        return SC.VisualConfig.frameSize.width;
    }

    /**
     * [SURCHARGE] Calcule la hauteur d'une seule case (pattern) du sprite.
     * Pour un sprite de personnage unique, la hauteur totale est divisée par 4.
     * @returns {number}
     */
    patternHeight() {
        return SC.VisualConfig.frameSize.height;
    }

    /**
     * [SURCHARGE] Force le sprite à ne pas être considéré comme un "big character".
     * Cela garantit que `_characterIndex` est utilisé pour sélectionner le personnage
     * sur le spritesheet, même si le nom du fichier de base contient "!$".
     * @returns {boolean}
     */
    isBigCharacter() {
        return false;
    }

    /**
     * [NOUVEAU] Assigne un sprite d'ombre à ce personnage.
     * @param {Sprite_CharacterShadow} shadowSprite Le sprite de l'ombre.
     */
    setShadow(shadowSprite) {
        this._shadowSprite = shadowSprite;
    }

    /**
     * [NOUVEAU] Met à jour la position et l'apparence de l'ombre.
     */
    updateShadow() {
        this._shadowSprite.x = this.x;
        const jumpHeight = this._character.jumpHeight();
        // On compense la hauteur du saut pour que l'ombre reste au sol.
        this._shadowSprite.y = this.y + jumpHeight + SC.ShadowConfig.yOffset;
        this._shadowSprite.visible = this.visible;

        if (jumpHeight > 0) {
            const scale = 1.0 - (jumpHeight * SC.ShadowConfig.jumpScaleRate);
            this._shadowSprite.scale.x = Math.max(scale, 0.1); // Ne pas laisser l'ombre disparaître complètement
            this._shadowSprite.scale.y = Math.max(scale, 0.1);
            this._shadowSprite.opacity = 255 - (jumpHeight * SC.ShadowConfig.jumpOpacityRate);
        } else {
            this._shadowSprite.scale.x = 1.0;
            this._shadowSprite.scale.y = 1.0;
            this._shadowSprite.opacity = 255;
        }
    }

    characterBlockX() {
        const index = this.getCharacterIndex();
        return (index % SC.VisualConfig.numColumns) * 3;
    };

    characterBlockY() {
        const index = this.getCharacterIndex();
        return Math.floor(index / SC.VisualConfig.numColumns) * 4;
    };

    /**
     * [NOUVEAU] Récupère l'index du personnage de manière centralisée.
     * @returns {number} L'index du personnage à utiliser.
     */
    getCharacterIndex() {
        const actor = this.getActor();
        if (actor) {
            const visualIndexVarId = ACTOR_VISUAL_INDEX_VAR[actor.actorId()];
            if (visualIndexVarId) {
                const indexFromVar = $gameVariables.value(Number(visualIndexVarId));
                if (typeof indexFromVar === 'number' && indexFromVar >= 0) {
                    return indexFromVar;
                }
            }
        }
        return this._character.characterIndex(); 
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
    version: "1.2.7",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_CharacterVisualManager"],
    createObj: { autoCreate: false } // C'est une classe, pas une instance globale.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);