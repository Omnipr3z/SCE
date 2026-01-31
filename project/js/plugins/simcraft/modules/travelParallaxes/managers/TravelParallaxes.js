class TravelParallaxesManager {
    static get ship(){

        const ship = $gameSpaceships.playerShip();

        if(!ship) return null;
        $debugTool.log("Retrieved player ship for travel parallax manager: " + (ship.orbitingPlanetId ? ship.orbitingPlanet.name : "No ship found"), true);

        return ship;
    }
    static get parallaxName(){
        return this._parallaxName || "";
    }
    static get oldParallaxName(){
        return this._oldParallaxName || "";
    }

    static updateParallaxes = function(){
        $debugTool.log("Updating travel parallax manager", true);

        if(this.ship){
            $debugTool.log("Updating travel parallax for ship status: " + this.ship.status, true);

            let filename = "StarlitSky";
            let moveSpeedX = -2;

            switch(this.ship.status.toLowerCase()){
                case "orbiting":
                    const planet = this.ship.orbitingPlanet;
                    if(planet){
                        switch(planet.type){
                            case "Warp":
                                this._parallaxName = '';
                                filename = "Warp";
                                moveSpeedX = -1;
                                break;
                            default:
                                this._parallaxName = '!' + planet.bitmapName;
                                moveSpeedX = 0;
                                break;
                        }
                    }
                    break;
                case "static":
                    this._parallaxName = '';
                    moveSpeedX = 0;
                    break;
                default:
                    this._parallaxName = '';
                    break;
            }
            if (this.oldParallaxName !== this.parallaxName) {
                const bitmapSrc = ImageManager.loadParallax(this.parallaxName);
                const spritesetMap = SceneManager._scene._spriteset;

                spritesetMap._superParallax.bitmap = bitmapSrc;

                const bitmap = spritesetMap._superParallax.bitmap;
                
                spritesetMap._superParallax.scale.x = 2;
                spritesetMap._superParallax.scale.y = 2;

                spritesetMap._superParallax.x = 60;
                spritesetMap._superParallax.y = 240;
                
                this._oldParallaxName = this.parallaxName;
            }

            if($gameMap.parallaxName() !== filename || $gameMap._parallaxLoopX !== moveSpeedX)
                $gameMap.changeParallax(filename, moveSpeedX, 0, 0, 0);
        }
    }
}
const _travlSprtst_Map_createParallax = Spriteset_Map.prototype.createParallax;
Spriteset_Map.prototype.createParallax = function() {
    _travlSprtst_Map_createParallax.call(this);
    this.createSuperParallax();
};
Spriteset_Map.prototype.createSuperParallax = function() {
    this._superParallax = new Sprite();
    this._superParallax.move(0, 0, Graphics.width, Graphics.height);
    this._superParallax.x = 60;
    this._superParallax.y = 240;
    this._baseSprite.addChildAt(this._superParallax, 2);
}