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
 * @plugindesc !SC [v1.0.0] Ajoute le séquenceur d'actions à ActorAnimManager.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_ActorAnimManager
 * @orderAfter SC_ActorAnimManager
 *
 * @help
 * ActorAnimManager_ActionSequencePatch.js
 * 
 * Ce patch étend la classe ActorAnimManager pour y ajouter un système de
 * séquence d'actions. Il permet de mettre en file d'attente plusieurs
 * animations et de les jouer les unes après les autres.
 * 
 * Il ajoutera la méthode `playSequence(sequenceName)`.
 */

(() => {

    const _ActorAnimManager_initialize = ActorAnimManager.prototype.initialize;
    ActorAnimManager.prototype.initialize = function(actorId, config) {
        this._animQueue = []; // Initialise la file d'attente des animations
        _ActorAnimManager_initialize.call(this, actorId, config);
    };

    /**
     * [NOUVEAU] Lance une séquence d'animations prédéfinie.
     * @param {string} sequenceName Le nom de la séquence à jouer (doit être définie dans la config).
     */
    ActorAnimManager.prototype.playSequence = function(sequenceName) {
        if (this._isActionPlaying) {
            $debugTool.warn(`ActorAnimManager (Actor ${this._actorId}): Impossible de lancer la séquence '${sequenceName}' car une animation est déjà en cours.`);
            return;
        }

        const sequence = SC.SequenceConfig.sequences ? SC.SequenceConfig.sequences[sequenceName] : null;
        if (!sequence || !Array.isArray(sequence)) {
            $debugTool.error(`ActorAnimManager (Actor ${this._actorId}): Séquence '${sequenceName}' non trouvée ou invalide dans la configuration.`);
            return;
        }

        // Remplit la file d'attente avec les animations de la séquence
        this._animQueue = [...sequence];
        $debugTool.log(`Séquence '${sequenceName}' chargée pour l'acteur ${this._actorId}. Actions en file: ${this._animQueue.length}`, true);
    };

    /**
     * [NOUVEAU] Gère la progression de la file d'attente des animations.
     * @private
     */
    ActorAnimManager.prototype.updateSequence = function() {
        // fix provisoire si la file n'existe pas
        if(!this._animQueue) this._animQueue = [];
        
        // Si une animation est en cours ou si la file est vide, on ne fait rien.
        if (this._isActionPlaying || this._animQueue.length === 0) {
            return;
        }

        // On récupère la prochaine animation de la file et on la lance.
        const nextAnim = this._animQueue.shift();
        this.playAction(nextAnim);
    };

    const _ActorAnimManager_update = ActorAnimManager.prototype.update;
    ActorAnimManager.prototype.update = function() {
        _ActorAnimManager_update.call(this);
        this.updateSequence(); // On vérifie s'il faut lancer la prochaine animation de la séquence.
    };

})();

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorAnimManager_ActionSequencePatch",
    version: "1.0.0",
    icon: "⛓️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_ActorAnimManager", "SC_AnimConfig"],
    createObj: { autoCreate: false } // C'est un patch, pas une nouvelle classe globale.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);