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
 * @plugindesc !SC [v1.0.0] Classe spécialisée pour les événements représentant des acteurs.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_DataManagerAddOns
 * @orderAfter SC_DataManagerAddOns
 *
 * @help
 * Game_ActorEvent.js
 * 
 * Ce fichier définit la classe Game_ActorEvent, qui hérite de Game_Event.
 * Elle est utilisée pour les événements qui sont liés à un acteur via le
 * notetag <actorId:ID>.
 * 
 * Cette classe permet d'isoler la logique spécifique à ces événements
 * (visibilité, animation, etc.) sans affecter les événements normaux.
 */

class Game_ActorEvent extends Game_Event {
    /**
     * @param {number} mapId L'ID de la carte.
     * @param {number} eventId L'ID de l'événement.
     */
    constructor(mapId, eventId) {
        super(mapId, eventId);
        // La méthode initialize de Game_Event est déjà appelée par le super constructeur.
        
        const meta = DataManager.extractEventMetaFromFirstComment(this.event());
        if (meta && meta.actorId) {
            this._actorId = Number(meta.actorId);
            $debugTool.log(`[Game_ActorEvent] Événement ${eventId} initialisé comme acteur ID: ${this._actorId}`, true);
        }
    }

    getAnimManager(){
        return $gameActorsAnims.getManagerById(this._actorId);
    }
    /**
     * Récupère l'objet Game_Actor associé à cet événement.
     * @returns {Game_Actor|null}
     */
    actor() {
        return this._actorId ? $gameActors.actor(this._actorId) : null;
    }

    /**
     * [SURCHARGE] Met à jour l'événement.
     * Si l'acteur associé est dans l'équipe du joueur, l'événement est "gelé"
     * et sa mise à jour est ignorée pour éviter les doublons de comportement.
     */
    update() {
        const actor = this.actor();
        if (actor && $gameParty.members().includes(actor)) {
            // L'acteur est dans l'équipe, donc cet événement ne doit pas être mis à jour.
            // Il sera rendu invisible par la future surcharge de isTransparent(),
            // mais bloquer l'update ici empêche tout mouvement autonome ou autre logique.
            return;
        }
        // Si l'acteur n'est pas dans l'équipe, on exécute la logique de mise à jour
        // normale de Game_Event (mouvement, animation de pas, etc.).
        super.update();
    }

    /**
     * [SURCHARGE] Vérifie si le personnage peut bouger.
     * Combine la logique de Game_Event (isLocked, isMoveRouteForcing) avec
     * la logique de notre patch sur Game_CharacterBase (isActionPlaying).
     * @returns {boolean}
     */
    canMove() {
        // On combine la logique de Game_Event (super.canMove()) avec la logique
        // de notre patch sur Game_CharacterBase (isActionPlaying).
        return super.canMove() && !this.isActionPlaying();
    }

    /**
     * [SURCHARGE] Vérifie si l'événement doit être transparent.
     * Un Game_ActorEvent est transparent si son acteur est dans l'équipe,
     * ou si sa page actuelle n'a pas d'image (comportement normal).
     * @returns {boolean}
     */
    isTransparent() {
        const actor = this.actor();
        // Si l'acteur est dans l'équipe, l'événement doit être caché pour éviter les doublons.
        if (actor && $gameParty.members().includes(actor)) {
            return true;
        }
        // Sinon, on utilise la logique de transparence normale de Game_Event.
        return super.isTransparent();
    }

    /**
     * [SURCHARGE] Retourne le nom du fichier de personnage.
     * Pour un Game_ActorEvent, il s'agit du nom du personnage de l'acteur associé,
     * et non de celui défini sur la page de l'événement.
     * @returns {string}
     */
    characterName() {
        const actor = this.actor();
        // Si l'acteur est visuel, on utilise son nom de personnage comme base pour le système de paper-doll.
        if (actor && actor.isVisual()) {
            return actor.characterName();
        }
        // Sinon, on retourne le comportement original de Game_Event.
        return super.characterName();
    }

    /**
     * [SURCHARGE] Retourne l'index du personnage dans le fichier.
     * Pour un Game_ActorEvent, cet index est contrôlé dynamiquement par
     * une variable de jeu, mise à jour par l'ActorAnimManager.
     * @returns {number}
     */
    characterIndex() {
        const actor = this.actor();
        if (actor && actor.isVisual()) {
            const visualIndexVarId = ACTOR_VISUAL_INDEX_VAR[actor.actorId()];
            if (visualIndexVarId) {
                const indexFromVar = $gameVariables.value(Number(visualIndexVarId));
                // On retourne la valeur de la variable si elle est valide.
                if (typeof indexFromVar === 'number' && indexFromVar >= 0) {
                    return indexFromVar;
                }
            }
        }
        // Si l'acteur n'est pas visuel ou si la variable n'est pas configurée, on retourne le comportement original.
        return super.characterIndex();
    }
}

// --- Enregistrement du plugin ---
// Ce plugin ne crée pas d'objet global, mais il doit être enregistré
// pour que d'autres plugins puissent déclarer une dépendance envers lui.
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Game_ActorEvent",
    version: "1.0.0",
    icon: "⚙️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader", "SC_DataManagerAddOns"],
    createObj: { autoCreate: false } // C'est une classe, pas une instance globale.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);