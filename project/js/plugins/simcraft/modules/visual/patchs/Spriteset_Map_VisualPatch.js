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
 * @plugindesc !SC [v1.2.0] Patch pour Spriteset_Map pour instancier les sprites visuels.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_Sprite_VisualCharacter
 * @base SC_Game_Actor_VisualPatch
 * @orderAfter SC_Sprite_VisualCharacter
 * @orderAfter SC_Game_Actor_VisualPatch
 *
 * @help
 * Spriteset_Map_VisualPatch.js
 * 
 * Ce patch est la dernière pièce du système de paper-doll.
 * Il surcharge la méthode `createCharacters` de Spriteset_Map pour agir
 * comme une "usine" (factory).
 * 
 * Pour chaque personnage à créer, il vérifie si c'est un acteur qui doit
 * utiliser le système visuel (via la méthode `isVisual()`).
 * Si c'est le cas, il instancie notre `Sprite_VisualCharacter` spécialisé.
 * Sinon, il instancie le `Sprite_Character` normal de RMMZ.
 *
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *   - SC_Sprite_VisualCharacter.js
 *   - SC_Game_Actor_VisualPatch.js
 *
 * ▸ Historique :
 *   v1.2.0 - 2024-08-03 : Externalisation de la logique de création pour permettre la surcharge par d'autres patchs.
 *   v1.1.0 - 2024-08-03 : Modifié pour créer et lier les ombres dynamiques aux personnages visuels.
 *   v1.0.0 - 2024-08-02 : Création initiale du patch "factory".
 */

const _Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function() {
    this._characterSprites = [];
    for (const event of $gameMap.events()) {
        this.createActorEventSprite(event);
    }
    for (const vehicle of $gameMap.vehicles()) {
        this.createVehiculeSprite(vehicle);
    }
    for (const follower of $gamePlayer.followers().visibleFollowers().reverse()) {
        // --- Logique de l'usine ---
        this.createFollowerSprite(follower);
    }
    this.createPlayerSprite();

    for (const sprite of this._characterSprites) {
        this._tilemap.addChild(sprite);
        
    }
};
Spriteset_Map.prototype.createVehiculeSprite = function(event) {
    this._characterSprites.push(new Sprite_Character(event));
}

Spriteset_Map.prototype.createActorEventSprite = function(event) {
    this._characterSprites.push(new Sprite_Character(event));
}
 /**
 * --- Logique de l'usine pour le joueur ---
 */   
Spriteset_Map.prototype.createFollowerSprite = function(follower) {
    const SpriteClass = follower.actor() && follower.actor().isVisual() ? Sprite_VisualCharacter : Sprite_Character;
    this._characterSprites.push(new SpriteClass(follower));
}
/**
 * --- Logique de l'usine pour le joueur ---
 */
Spriteset_Map.prototype.createPlayerSprite = function() {
    const PlayerSpriteClass = $gameParty.leader() && $gameParty.leader().isVisual() ? Sprite_VisualCharacter : Sprite_Character;
    const _sprite = new PlayerSpriteClass($gamePlayer);
    console.log(_sprite);
    this._characterSprites.push(_sprite);
}
// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Spriteset_Map_VisualPatch",
    version: "1.2.0",
    icon: "🏭",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_Sprite_VisualCharacter", "SC_Game_Actor_VisualPatch"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);