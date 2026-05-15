
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

/* ==================== LOGIQUE DE L'USINE ======================== */
Spriteset_Map.prototype.createVehiculeSprite = function(event) {
    this._characterSprites.push(new Sprite_Character(event));
}
Spriteset_Map.prototype.createActorEventSprite = function(event) {
    this._characterSprites.push(new Sprite_Character(event));
} 
Spriteset_Map.prototype.createFollowerSprite = function(follower) {
    const isVisual = follower.actor() && follower.actor().isVisual();
    const SpriteClass = isVisual ? Sprite_VisualCharacter : Sprite_Character;
    const characterSprite = new SpriteClass(follower);

    if(isVisual && SC.ShadowConfig && SC.ShadowConfig.useShadow){
        const shadowSprite = new Sprite_CharacterShadow();
        characterSprite.setShadow(shadowSprite);
        this._tilemap.addChild(shadowSprite); // Ajoute l'ombre en premier
    }

    this._characterSprites.push(characterSprite);
}
Spriteset_Map.prototype.createPlayerSprite = function() {
    const isVisual = $gameParty.leader() && $gameParty.leader().isVisual();
    const PlayerSpriteClass = isVisual? Sprite_VisualCharacter : Sprite_Character;
    const _sprite = new PlayerSpriteClass($gamePlayer);

    if(isVisual && SC.ShadowConfig && SC.ShadowConfig.useShadow){
        const shadowSprite = new Sprite_CharacterShadow();
        shadowSprite.z = 0; // S'assure que l'ombre est en dessous du personnage
        _sprite.setShadow(shadowSprite);
        this._tilemap.addChild(shadowSprite);
    }

    this._characterSprites.push(_sprite);
}

const _Spriteset_Map_createActorEventSprite = Spriteset_Map.prototype.createActorEventSprite;
Spriteset_Map.prototype.createActorEventSprite = function(event) {
    $debugTool.log(`Création du sprite pour l'événement d'acteur ID=${event.eventId()}`, true);

    if(event._actorId && $gameActors.actor(event._actorId).isVisual()) {
        this._characterSprites.push(new Sprite_VisualCharacter(event));
        $debugTool.log(`-> Utilisation de Sprite_VisualCharacter pour l'acteur ID=${event._actorId}`, true);
    } else {    
        _Spriteset_Map_createActorEventSprite.call(this, event);
    }
}