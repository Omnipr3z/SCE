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
 * @plugindesc !SC [v1.0.0] Patch pour que Spriteset_Map instancie les sprites des Game_ActorEvent.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_Spriteset_Map_VisualPatch
 * @base SC_Game_ActorEvent
 * @orderAfter SC_Spriteset_Map_VisualPatch
 * @orderAfter SC_Game_ActorEvent
 *
 * @help
 * SpritesetMap_GameActorEventPatch.js
 * 
 * Ce patch surcharge la méthode Spriteset_Map.prototype.createActorEventSprite,
 * qui est fournie par le patch Spriteset_Map_VisualPatch.
 * 
 * Il vérifie si un événement est une instance de Game_ActorEvent et si son
 * acteur est "visuel". Si c'est le cas, il instancie un Sprite_VisualCharacter
 * au lieu d'un Sprite_Character normal.
 */
const _Spriteset_Map_createActorEventSprite = Spriteset_Map.prototype.createActorEventSprite;
Spriteset_Map.prototype.createActorEventSprite = function(event) {
    $debugTool.log(`Création du sprite pour l'événement d'acteur ID=${event.eventId()}`);

    if(event._actorId && $gameActors.actor(event._actorId).isVisual()) {
        this._characterSprites.push(new Sprite_VisualCharacter(event));
        $debugTool.log(`-> Utilisation de Sprite_VisualCharacter pour l'acteur ID=${event._actorId}`);
    } else {    
        _Spriteset_Map_createActorEventSprite.call(this, event);}
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_SpritesetMap_GameActorEventPatch",
    version: "1.0.0",
    icon: "🏭",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_Spriteset_Map_VisualPatch", "SC_Game_ActorEvent"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);