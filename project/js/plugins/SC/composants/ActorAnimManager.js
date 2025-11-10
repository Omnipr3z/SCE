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
 * @plugindesc !SC [v1.0.7] Composant de gestion d'animation pour un personnage.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * ActorAnimManager.js
 * 
 * Ce composant est instancié pour chaque personnage sur la carte.
 * Il est responsable de suivre l'état du personnage (marche, course, inactif)
 * et de déterminer quelle animation doit être appliquée.
 */

class ActorAnimManager {
    /**
     * @param {Game_Character} character Le personnage (Game_Player ou Game_Follower) à gérer.
     */
    constructor(character) {
        this._character = character;
        this._idleTimer = 0;
        this._currentState = 'default'; // 'default', 'dash', 'idle', 'action', 'action_instant'
        this._visualIndexVarId = this._getVisualIndexVarId();
    }
    getDefaultIndex() {
        return SC.CharacterAnimConfig.DEFAULT_ANIM_INDEX; // Index pour la marche/par défaut
    }
    getDashIndex() {
        return SC.CharacterAnimConfig.DASH_ANIM_INDEX;
    }
    getIdleIndex() {
        return SC.CharacterAnimConfig.IDLE_ANIM_INDEX;
    }
    getJumpIndex() {
        return SC.CharacterAnimConfig.JUMP_ANIM_INDEX;
    }
    /**
     * Applique l'animation de course (Dash).
     */
    setDashAnim() {
        if (this._currentState !== 'dash') {
            this._currentState = 'dash';
            $gameVariables.setValue(this._visualIndexVarId, this.getDashIndex());
            $debugTool.log(`[ActorAnimManager] Acteur ${this._getActorId()}: Passe en dash (index: ${this.getDashIndex()}).`);
        }
        this._idleTimer = 0; // La course n'est pas de l'inactivité
    }
    /**
     * Applique l'animation d'inactivité (Idle).
     */
    setIdleAnim() {
        if(this._currentState !== 'idle') {
            this._currentState = 'idle';
            $gameVariables.setValue(this._visualIndexVarId, this.getIdleIndex());
            this._character.setStepAnime(true);
            $debugTool.log(`[ActorAnimManager] Acteur ${this._getActorId()}: Passe en idle (index: ${this.getIdleIndex()}).`);
        }
    }
    /**
     * Applique l'animation de marche/par défaut.
     */
    setWalkAnim() {
        if (this._currentState !== 'default') {
            // Le personnage était en idle ou en dash et a commencé à marcher.
            this._currentState = 'default';
            $gameVariables.setValue(this._visualIndexVarId, this.getDefaultIndex());
            // Toujours désactiver l'animation de pas lors du retour à l'état par défaut.
            // Cela annule toute activation forcée par 'idle' ou 'dash'.
            this._character.setStepAnime(false);
            
            $debugTool.log(`[ActorAnimManager] Acteur ${this._getActorId()}: Passe en marche/par défaut (index: ${this.getDefaultIndex()}).`);
        }
         // Réinitialise le timer d'idle dès que le personnage bouge
        this._idleTimer = 0;
    }
    /**
     * Applique l'animation de saut (Jump).
     */
    setJumpAnim() {
        if (this._currentState !== 'jump') {
            this._currentState = 'jump';
            $gameVariables.setValue(this._visualIndexVarId, this.getJumpIndex());
            this._character.setStepAnime(false); // Le saut n'a pas d'animation de pas
            $debugTool.log(`[ActorAnimManager] Acteur ${this._getActorId()}: Passe en saut (index: ${this.getJumpIndex()}).`);
        }
        this._idleTimer = 0;
    }
    /**
     * Vérifie si le seuil d'inactivité est atteint et incrémente le timer.
     */
    isIdleState() {
        this._idleTimer++;
        return this._idleTimer >= SC.CharacterAnimConfig.IDLE_THRESHOLD_FRAMES;
    }
    /**
     * Méthode principale appelée à chaque frame par le manager global.
     */
    update() {
        if (!this._visualIndexVarId) {
            // Pas de variable de contrôle d'index visuel configurée pour ce personnage.
            // On ne peut pas contrôler son animation via ce manager.
            return;
        }

        const isMoving = this._character.isMoving();
        const isDashing = this._character.isDashing();
        const isJumping = this._character.isJumping();

        if (isJumping) {
            // Le saut a la priorité absolue sur toutes les autres animations
            this.setJumpAnim();
        } else if (isDashing) {
            this.setDashAnim();
        } else if (!isMoving) {
            // Si le personnage ne bouge pas
            if(this.isIdleState()) { // Vérifie si le seuil d'inactivité est atteint
                this.setIdleAnim();
            } else {
                // Si pas encore inactif, mais immobile, revient à l'état de marche/par défaut
                // Cela gère la transition d'un mouvement à un arrêt avant l'idle.
                this.setWalkAnim();
            }
        }else { // Le personnage est en mouvement mais ne court pas (marche)
            this.setWalkAnim();
        }
    }
    /**
     * Récupère l'ID de la variable de jeu pour l'index visuel de ce personnage.
     * @returns {number|null} L'ID de la variable ou null si non configuré.
     */
    _getVisualIndexVarId() {
        const actorId = this._getActorId();
        return actorId !== null ? ACTOR_VISUAL_INDEX_VAR[actorId] : null;
    }

    _getActorId() {
        if (this._character === $gamePlayer) return $gameParty.leader().actorId();
        if (this._character.actor) return this._character.actor().actorId(); // Pour Game_Follower
        return null;
    }
}

// --- Enregistrement du plugin ---
// Ce plugin ne crée pas d'objet global, mais il doit être enregistré
// pour que d'autres plugins puissent déclarer une dépendance envers lui.
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorAnimManager",
    version: "1.0.7",
    icon: "🏃‍♂️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    
    // Pas de createObj car c'est une classe utilitaire à instancier au besoin.
    createObj: {
        autoCreate: false
    }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);