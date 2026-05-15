class SpriteSystemMap extends Sprite {
    constructor(manager) {
        super();
        this._manager = manager;
    }

    get planets() { return this._manager.planets; }
    get alerts() { return this._manager.alerts; }
    get spaceships() { return this._manager.spaceships; }
    get mapOffsetX() { return this._manager.mapOffsetX; }
    get mapOffsetY() { return this._manager.mapOffsetY; }

    loadSpaceshipBitmap(filename) {
        return ImageManager.loadBitmap("img/GUI/ship/", filename);
    }

    // CREATE
    create() {
        this.createBackground();
        this.createSprites();
        this.createLayout();
    }

    createBackground() {
        this._bgSprite = new Sprite();
        this._bgSprite.bitmap = this.loadSpaceshipBitmap("travelScreenBg");
        this._bgSprite.opacity = 255;
        this.addChild(this._bgSprite);

        this._bg2Sprite = new Sprite();
        this._bg2Sprite.bitmap = this.loadSpaceshipBitmap("space");
        this._bg2Sprite.opacity = 180;
        this.addChild(this._bg2Sprite);
    }

    createSprites() {
        this.createPlanets();
        this.createAlerts();
        this.createSpaceships();
    }

    createPlanets() {
        this._planetSprites = [];
        this.planets.forEach((planet, index) => {
            const bitmap = this.loadSpaceshipBitmap(planet.bitmapName);
            
            this._planetSprites[index] = new Sprite();
            this._planetSprites[index].anchor.x = 0.5;
            this._planetSprites[index].anchor.y = 0.5;
            this._planetSprites[index].bitmap = bitmap;
            this._planetSprites[index].opacity = 255;
            this._planetSprites[index].x = planet.x;
            this._planetSprites[index].y = planet.y;
            this._planetSprites[index].scale.x = planet.zoom || 1;
            this._planetSprites[index].scale.y = planet.zoom || 1;
            this._planetSprites[index].zoomOriginal = planet.zoom || 1;

            this.addChild(this._planetSprites[index]);
        });
    }

    createAlerts() {
        this._alertSprites = [];
        this.alerts.forEach((icon, index) => {
            const bitmap = this.loadSpaceshipBitmap(icon.iconName);
            this._alertSprites[index] = new Sprite();
            this._alertSprites[index].bitmap = bitmap;
            this._alertSprites[index].opacity = 0;
            this._alertSprites[index].x = -100;
            this._alertSprites[index].y = -100;
            this._alertSprites[index].anchor.x = 0.5;
            this._alertSprites[index].anchor.y = 0.5;
            this.addChild(this._alertSprites[index]);
        });
    }

    createSpaceships() {
        this._spaceshipSprites = [];
        this.spaceships.forEach((ship, index) => {
            const bitmap = this.loadSpaceshipBitmap(ship.bitmapName);

            this._spaceshipSprites[index]           = new Sprite();
            this._spaceshipSprites[index].bitmap    = bitmap;
            this._spaceshipSprites[index].x         = ship.x;
            this._spaceshipSprites[index].y         = ship.y;
            this._spaceshipSprites[index].anchor.x  = 0.5;
            this._spaceshipSprites[index].anchor.y  = 0.5;
            this._spaceshipSprites[index].scale.x   = 0.001;
            this._spaceshipSprites[index].scale.y   = 0.001;

            this.addChild(this._spaceshipSprites[index]);
        });
    }

    createLayout() {
        this._layoutSprite = new Sprite();
        this._layoutSprite.bitmap = this.loadSpaceshipBitmap("travelScreenLayout");
        this._layoutSprite.opacity = 180;
        this.addChild(this._layoutSprite);
    }

    // UPDATE
    update() {
        super.update();
        if (this._manager) {
            this.updateMapOffset();
            this.updatePlanets();
            this.updateAlerts();
            this.updateSpaceships();
        }
    }

    updateMapOffset() {
        const offX = this.mapOffsetX;
        const offY = this.mapOffsetY;

        this._bgSprite.x = offX;
        this._bgSprite.y = offY;
        this._bg2Sprite.x = offX;
        this._bg2Sprite.y = offY;
        this._layoutSprite.x = offX;
        this._layoutSprite.y = offY;
    }

    updatePlanets() {
        this._planetSprites.forEach((sprite, index) => {
            const planet = this.planets[index];
            if (planet.moves instanceof Array) {
                planet.moves.forEach(move => {
                    switch (move.type) {
                        case "rotation":
                            sprite.rotation = (sprite.rotation + move.value * $gameDate.getScrollSpeedMode()) % (Math.PI * 2);
                            break;
                        case "scale":
                            if (!sprite.scaleDir && sprite.scale.x < move.value) {
                                sprite.scale.x += move.speed || 0.01;
                                sprite.scale.y += move.speed || 0.01;
                                if (sprite.scale.x > move.value) sprite.scaleDir = true;
                            } else if (sprite.scale.x > sprite.zoomOriginal) {
                                sprite.scale.x -= move.speed || 0.01;
                                sprite.scale.y -= move.speed || 0.01;
                            } else if (sprite.scale.x <= sprite.zoomOriginal) {
                                sprite.scaleDir = false;
                            }
                            break;
                        case "opacity":
                            if (!sprite.opacityFadeOut && sprite.opacity <= move.max) {
                                sprite.opacity += move.speed || 1;
                                if (sprite.opacity >= move.max) sprite.opacityFadeOut = true;
                            } else if (sprite.opacity > move.min) {
                                sprite.opacity -= move.speed || 1;
                            } else if (sprite.opacity <= move.min) {
                                sprite.opacityFadeOut = false;
                            }
                            break;
                        case "scaleOnY":
                            const change = (move.value - sprite.zoomOriginal) * (planet.y / 720);
                            sprite.scale.y = sprite.zoomOriginal + change;
                            sprite.scale.x = sprite.zoomOriginal + change;
                            break;
                        default:
                            // Orbit et OrbitPlanet sont gérés par le manager
                            break;
                    }
                });
            }
            sprite.x = planet.x + this.mapOffsetX;
            sprite.y = planet.y + this.mapOffsetY;
        });
    }

    updateAlerts() {
        if (this._timer === undefined) this._timer = 0;
        this._timer++;
        
        this._alertSprites.forEach((sprite, index) => {
            const alert = this.alerts[index];
            if (alert.active) {
                this.updateAlertsPos(sprite, alert);
                this.updateAlertBlink(sprite);
                this.updateAlertScale(sprite);
            } else {
                sprite.opacity = 0;
                sprite.scale.x = 1;
                sprite.scale.y = 1;
            }
        });
    }

    updateAlertBlink(sprite) {
        sprite.opacity = (Math.sin(this._timer * 0.1) + 1) * 127.5;
    }

    updateAlertScale(sprite) {
        const scale = (this._timer % 500) / 500 + 0.2;
        sprite.scale.x = scale;
        sprite.scale.y = scale;
    }

    updateAlertsPos(sprite, alert) {
        switch (alert.pos.type) {
            case "follow":
                const planetSprite = this._planetSprites[alert.pos.planetId];
                if (planetSprite) {
                    sprite.x = planetSprite.x;
                    sprite.y = planetSprite.y;
                }
                break;
            case "static":
                sprite.x = alert.pos.x + this.mapOffsetX;
                sprite.y = alert.pos.y + this.mapOffsetY;
                break;
            default:
                break;
        }
    }

    updateSpaceships() {
        this._spaceshipSprites.forEach((sprite, index) => {
            const ship = this.spaceships[index];
            if (ship) {
                const oldLogicalX = sprite._lastLogicalX !== undefined ? sprite._lastLogicalX : ship.x;
                sprite._lastLogicalX = ship.x;
                
                sprite.x = ship.x + this.mapOffsetX;
                sprite.y = ship.y + this.mapOffsetY;

                // Flip sprite based on logical direction
                if (ship.x > oldLogicalX) { // Moving right
                    sprite.scale.x = -Math.abs(sprite.scale.x);
                } else if (ship.x < oldLogicalX) { // Moving left
                    sprite.scale.x = Math.abs(sprite.scale.x);
                }

                this.updateSpaceshipScale(sprite);
            }
        });
    }

    updateSpaceshipScale(sprite) {
        if (Math.abs(sprite.scale.x) !== 0.2) {
            const newScale = Math.abs(sprite.scale.x).approach(0.03, 0.002);
            const direction = sprite.scale.x >= 0 ? 1 : -1;
            sprite.scale.x = newScale * direction;
            sprite.scale.y = newScale;
        }
    }
}
