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
 * @plugindesc !SC [v1.0.1] Sprite autonome pour les layers de cinématiques.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * Sprite_CinematicLayer.js
 * 
 * Ce composant est un sprite "intelligent" utilisé par Scene_Cinematic.
 * Il est responsable de sa propre mise à jour (mouvement, fondu, zoom, etc.),
 * déchargeant ainsi la scène de cette responsabilité.
 *
 * ▸ Historique :
 *   v1.0.1 - 2024-08-04 : Correction de la logique de `isBusy` pour l'animation de frames.
 *   v1.0.0 - 2024-08-04 : Création initiale du composant.
 */

class Sprite_CinematicLayer extends Sprite {
    initialize() {
        super.initialize();
        this.initMembers();
    }

    initMembers() {
        this.imgName = '';
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.x = Math.floor(Graphics.width / 2);
        this.y = Math.floor(Graphics.height / 2) - 20;
        this.scale.x = 1;
        this.scale.y = 1;
        this.opacity = 0;
        this.rotation = 0;

        this._currentFrame = 0;
        this._lastFrame = 0;
        this._frameTick = 0;

        this._xGoal = this.x;
        this._yGoal = this.y;
        this._opacityGoal = 0;
        this._zoomGoal = 1;
        this._rotationGoal = 0;
        this._duration = 0;

        this._fadeSpeed = 3;
        this._moveSpeed = 0.05;
        this._rotationSpeed = 0.6;
        this._zoomSpeed = 0.005;
        this._frameDuration = 4;
    }

    /**
     * Méthode principale de mise à jour, appelée à chaque frame.
     */
    update() {
        super.update();
        this.updateMovement();
        this.updateOpacity();
        this.updateScale();
        this.updateRotation();
        this.updateFrameAnimation();
        this.updateDuration();
    }

    /**
     * Met à jour la position du sprite vers sa cible.
     */
    updateMovement() {
        const xGoal = eval(this._xGoal) || 0;
        const yGoal = eval(this._yGoal) || 0;
        this.x = Number(this.x).approach(xGoal, this._moveSpeed) || xGoal;
        this.y = Number(this.y).approach(yGoal, this._moveSpeed) || yGoal;
    }

    /**
     * Met à jour l'opacité du sprite vers sa cible.
     */
    updateOpacity() {
        this.opacity = this.opacity.approach(this._opacityGoal, this._fadeSpeed);
    }

    /**
     * Met à jour l'échelle (zoom) du sprite vers sa cible.
     */
    updateScale() {
        this.scale.x = this.scale.x.approach(this._zoomGoal, this._zoomSpeed);
        this.scale.y = this.scale.x; // Maintient un ratio uniforme
    }

    /**
     * Met à jour la rotation du sprite vers sa cible.
     */
    updateRotation() {
        const rotationSpeedRadians = this._rotationSpeed * (Math.PI / 180);
        this.rotation = this.rotation.approach(this._rotationGoal, rotationSpeedRadians);
    }

    /**
     * Met à jour la durée de pause du sprite.
     */
    updateDuration() {
        if (this._duration > 0) {
            this._duration--;
        }
    }

    /**
     * Gère l'animation par frames (changement d'image).
     */
    updateFrameAnimation() {
        if (this._currentFrame > this._lastFrame) {
            this._frameTick = 0;
            return;
        }
        if (this._frameTick < this._frameDuration) {
            this._frameTick++;
        } else if (this._currentFrame < this._lastFrame) {
            this._currentFrame++;
            this._frameTick = 0;
            const frameName = `${this.imgName}_${this._currentFrame}`;
            // La scène devra fournir une méthode pour charger l'image.
            if (this.parent && typeof this.parent.loadPicture === 'function') {
                this.bitmap = this.parent.loadPicture(frameName);
            }
        }
    }

    /**
     * Vérifie si le sprite est "occupé" (en cours d'animation).
     * @returns {boolean}
     */
    isBusy() {
        const states = {
            moving: this.isMoving(),
            fading: this.isFading(),
            scaling: this.isScaling(),
            rotating: this.isRotating(),
            frameAnimating: this.isFrameAnimating(),
            waiting: this.isWaiting()
        };

        $debugTool.log(`[SpriteLayer] isBusy states: ${JSON.stringify(states)}`, true);

        return Object.values(states).some(isBusy => isBusy);
    }

    /**
     * Vérifie si le sprite est en cours de déplacement.
     * @returns {boolean}
     */
    isMoving() {
        
        const xGoal = eval(this._xGoal) || 0;
        const yGoal = eval(this._yGoal) || 0;
        return this.x !== xGoal || this.y !== yGoal;
    }

    /**
     * Vérifie si le sprite est en cours de fondu (changement d'opacité).
     * @returns {boolean}
     */
    isFading() {
        return this.opacity !== this._opacityGoal;
    }

    /**
     * Vérifie si le sprite est en cours de mise à l'échelle (zoom).
     * @returns {boolean}
     */
    isScaling() {
        return this.scale.x !== this._zoomGoal;
    }

    /**
     * Vérifie si le sprite est en cours de rotation.
     * @returns {boolean}
     */
    isRotating() {
        return this.rotation !== this._rotationGoal;
    }

    /**
     * Vérifie si le sprite est en cours d'animation par frames.
     * @returns {boolean}
     */
    isFrameAnimating() {
        return this._lastFrame > 0 && this._currentFrame <= this._lastFrame;
    }

    /**
     * Vérifie si le sprite est en pause (duration).
     * @returns {boolean}
     */
    isWaiting() {
        return this._duration > 0;
    }

    /**
     * Applique un nouvel ensemble de propriétés cibles au sprite.
     * @param {object} props Les nouvelles propriétés à appliquer.
     */
    applyProperties(props) {
        $debugTool.log(`[SpriteLayer] applyProperties - Props reçues: ${JSON.stringify(props)}`);
        const beforeState = {
            xGoal: this._xGoal,
            yGoal: this._yGoal,
            opacityGoal: this._opacityGoal,
            zoomGoal: this._zoomGoal,
            rotationGoal: this._rotationGoal,
            duration: this._duration,
            lastFrame: this._lastFrame,
            currentFrame: this._currentFrame
        };
        $debugTool.log(`[SpriteLayer] ... État AVANT: ${JSON.stringify(beforeState)}`, true);

        // On utilise des noms de propriétés internes pour éviter les conflits.
        if (props.xGoal !== undefined) this._xGoal = props.xGoal;
        if (props.yGoal !== undefined) this._yGoal = props.yGoal;
        if (props.opacityGoal !== undefined) this._opacityGoal = props.opacityGoal;
        if (props.zoomGoal !== undefined) this._zoomGoal = props.zoomGoal;
        if (props.rotationGoal !== undefined) {
            // On convertit les degrés (plus intuitifs) en radians pour le moteur.
            this._rotationGoal = props.rotationGoal * (Math.PI / 180);
        }

        if (props.moveSpeed !== undefined) this._moveSpeed = props.moveSpeed;
        if (props.rotationSpeed !== undefined) this._rotationSpeed = props.rotationSpeed;
        if (props.zoomSpeed !== undefined) this._zoomSpeed = props.zoomSpeed;
        if (props.fadeSpeed !== undefined) this._fadeSpeed = props.fadeSpeed;

        if (props.duration !== undefined) this._duration = props.duration;
        // --- Propriétés pour l'animation par frames ---
        if (props.lastFrame !== undefined) this._lastFrame = props.lastFrame;
        if (props.frameDuration !== undefined) this._frameDuration = props.frameDuration;
        // Si une nouvelle animation est définie, on réinitialise la frame actuelle pour la démarrer.
        if (props.lastFrame !== undefined) this._currentFrame = 0;
        

        const afterState = {
            xGoal: this._xGoal,
            yGoal: this._yGoal,
            opacityGoal: this._opacityGoal,
            zoomGoal: this._zoomGoal,
            rotationGoal: this._rotationGoal,
            duration: this._duration,
            lastFrame: this._lastFrame,
            currentFrame: this._currentFrame
        };
        $debugTool.log(`[SpriteLayer] ... État APRÈS: ${JSON.stringify(afterState)}`, true);
    }
}


// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Sprite_CinematicLayer",
    version: "1.0.1",
    icon: "🎞️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false } // C'est une classe, pas une instance globale.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);