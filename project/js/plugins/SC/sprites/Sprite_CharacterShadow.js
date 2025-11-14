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
 * @plugindesc !SC [v1.1.0] Sprite pour l'ombre dynamique des personnages.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * Sprite_CharacterShadow.js
 * 
 * Ce sprite est utilisé pour afficher une ombre découplée sous un personnage.
 * Il est conçu pour être un enfant d'un Sprite_Character.
 */

class Sprite_CharacterShadow extends Sprite {
    constructor() {
        super();
        this.loadBitmap();
        this.anchor.x = 0.5;
        this.anchor.y = 1;
    }

    loadBitmap() {
        this.bitmap = ImageManager.loadSystem(SC.ShadowConfig.fileName || "Shadow1");
    }

    update() {
        super.update();
        // La visibilité est maintenant gérée par le Sprite_VisualCharacter parent.
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Sprite_CharacterShadow",
    version: "1.1.0",
    icon: "⚫",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    
    // Pas de createObj car c'est une classe utilitaire à instancier au besoin.
    createObj: {
        autoCreate: false
    }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);