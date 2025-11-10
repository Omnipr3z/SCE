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
 * @plugindesc !SC [v1.2.0] Patch pour ajouter une ombre dynamique à Sprite_VisualCharacter.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_Sprite_VisualCharacter
 * @base SC_Sprite_CharacterShadow
 * @base SC_ShadowConfig
 * @orderAfter SC_Sprite_VisualCharacter
 *
 * @help
 * Sprite_VisualCharacter_ShadowPatch.js
 * 
 * Ce patch ajoute la fonctionnalité d'ombre dynamique à la classe
 * Sprite_VisualCharacter. Il ne fait rien si le plugin SC_Sprite_CharacterShadow
 * ou SC_ShadowConfig est désactivé.
 *
 * ▸ Historique :
 *   v1.2.0 - 2024-08-03 : Stabilisation du module d'ombre.
 *   v1.1.0 - 2024-08-03 : Surcharge des méthodes de création de l'usine pour une intégration modulaire.
 *   v1.0.0 - 2024-08-03 : Création initiale du patch pour découpler la logique de l'ombre.
 */

const _Spriteset_Map_createFollowerSprite = Spriteset_Map.prototype.createFollowerSprite;
Spriteset_Map.prototype.createFollowerSprite = function(follower) {
    if (follower.actor() && follower.actor().isVisual() && SC.ShadowConfig && SC.ShadowConfig.useShadow) {
        const characterSprite = new Sprite_VisualCharacter(follower);
        const shadowSprite = new Sprite_CharacterShadow();
        characterSprite.setShadow(shadowSprite);
        this._tilemap.addChild(shadowSprite); // Ajoute l'ombre en premier
        this._characterSprites.push(characterSprite);
    } else {
        _Spriteset_Map_createFollowerSprite.call(this, follower);
    }
};

const _Spriteset_Map_createPlayerSprite = Spriteset_Map.prototype.createPlayerSprite;
Spriteset_Map.prototype.createPlayerSprite = function() {
    if ($gameParty.leader() && $gameParty.leader().isVisual() && SC.ShadowConfig && SC.ShadowConfig.useShadow) {
        const characterSprite = new Sprite_VisualCharacter($gamePlayer);
        const shadowSprite = new Sprite_CharacterShadow();
        characterSprite.setShadow(shadowSprite);
        this._tilemap.addChild(shadowSprite); // Ajoute l'ombre en premier
        this._characterSprites.push(characterSprite);
    } else {
        _Spriteset_Map_createPlayerSprite.call(this);
    }
};

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Sprite_VisualCharacter_ShadowPatch",
    version: "1.2.0",
    icon: "⚫",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_Sprite_VisualCharacter", "SC_Sprite_CharacterShadow", "SC_ShadowConfig"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);