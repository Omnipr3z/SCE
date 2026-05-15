class SystemMapManager {
    constructor() {
        this._mapOffsetX = 0;
        this._mapOffsetY = 0;
        this._rightPannelActive = "shipInfos";
        this._logs = [];
    }

    get planets() { return $gameSector.currentSystem().planets(); }
    get alerts() { return $gameQuests.alerts(); }
    get spaceships() { return $gameSpaceships.spaceships(); }
    get playerSpaceship() { return $gameSpaceships.playerShip(); }
    get mapOffsetX() { return this._mapOffsetX; }
    get mapOffsetY() { return this._mapOffsetY; }

    log(style, txt) {
        this._logs.push({ style, txt });
    }

    pullLogs() {
        const logs = [...this._logs];
        this._logs = [];
        return logs;
    }

    setRightPannelActive(val) {
        this._rightPannelActive = val;
    }

    update() {
        this.updateMapOffset();
        this.updatePlanetsPhysics();
        this.updateSpaceships();
    }

    bottomPanelRealSize() { 
        return (720 / 3) * (Graphics._height / 720); 
    }
    
    rightPanelRealSize() { 
        return (1280 / 4) * (Graphics._width / 1280); 
    }

    updateMapOffset() {
        if (this.playerSpaceship) {
            const ship = this.playerSpaceship;
            let targetX = 0;
            let targetY = 0;
            
            targetY = Math.max(
                -ship.y + 310,
                -this.bottomPanelRealSize() + (Graphics._height - 720)
            );

            if (this._rightPannelActive != "none") {
                targetX = Math.max(-ship.x + 640, -this.rightPanelRealSize() + (Graphics._width - 1280));
            }

            targetX = Math.min(targetX, 0);
            targetY = Math.min(targetY, 0);

            // On utilise la fonction approach existante dans l'engine pour adoucir le déplacement de la caméra
            this._mapOffsetX = this._mapOffsetX.approach(targetX, 1);
            this._mapOffsetY = this._mapOffsetY.approach(targetY, 1);
        }
    }

    updatePlanetsPhysics() {
        this.planets.forEach((planet, index) => {
            if (planet.moves instanceof Array) {
                planet.moves.forEach(move => {
                    if (move.type === "orbit" || move.type === "orbitPlanet") {
                        let centerX = move.centerX || 0;
                        let centerY = move.centerY || 0;
                        if (move.type === "orbitPlanet") {
                            const planetC = this.planets[move.planetId];
                            if (planetC) {
                                centerX = planetC.x;
                                centerY = planetC.y;
                            }
                        }
                        this.updatePlanetOrbitPhysics(planet, move, centerX, centerY);
                    }
                });
            }
        });
    }

    updatePlanetOrbitPhysics(planet, move, centerX, centerY) {
        const pi2 = Math.PI * 2;
        const speed = move.speed || 0.01 * $gameDate.getScrollSpeedMode();
        
        if (!planet.active) {
            planet.orbitAngle = Math.random() * pi2;
            planet.activate();
        } else {
            planet.orbitAngle = (planet.orbitAngle + speed) % pi2;
        }
        const angle = planet.orbitAngle;

        planet._x = centerX + Math.cos(angle) * move.radiusX;
        planet._y = centerY + Math.sin(angle) * move.radiusY;
    }

    updateSpaceships() {
        this.spaceships.forEach((ship, index) => {
            if (ship) {
                const orbitingId = ship.orbitingPlanetId;
                const speed = ship.speed / 8 * $gameDate.getScrollSpeedMode();

                if (orbitingId !== null) {
                    const planet = this.planets[orbitingId];
                    this.updateSpaceshipOrbiting(ship, planet, speed);
                } else if (ship.x != ship.targetX || ship.y != ship.targetY) {
                    this.moveShipToTarget(ship, speed);
                } else if (ship.status != "Static") {
                    this.log('infos', `The ${ship.name} reached the target position.`);
                    ship.status = "Static";
                }
            }
        });
    }

    getMapDistance(ship, target) {
        const dx = ship.x - target.x;
        const dy = ship.y - target.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    updateSpaceshipOrbiting(ship, planet, speed) {
        if (planet) {
            const distance = this.getMapDistance(ship, planet);
            if (distance > speed) {
                this.approachTarget(ship, planet, speed);
            } else {
                this.shipStaticOrbit(ship, planet);
            }
        }
    }

    approachTarget(ship, target, speed) {
        ship.consumeFuel(0.01); 
        ship.x = ship.x.approach(target.x, speed);
        ship.y = ship.y.approach(target.y, speed);
    }

    shipStaticOrbit(ship, planet) {
        ship.x = planet.x;
        ship.y = planet.y;
        
        if (ship.status != "Orbiting")
            this.log('basicInfos', `The ${ship.name} is entering orbit around ${planet.name}.`);

        ship.status = "Orbiting";
    }

    moveShipToTarget(ship, speed) {
        ship.consumeFuel(0.01);
        ship.x = ship.x.approach(ship.targetX, speed);
        ship.y = ship.y.approach(ship.targetY, speed);
    }
}
