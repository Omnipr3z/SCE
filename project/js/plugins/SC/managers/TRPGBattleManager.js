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
 * @plugindesc !SC [v1.0.0] Manager pour les combats tactiques (TRPG).
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * TRPGBattleManager.js
 * 
 * Ce manager est le chef d'orchestre des combats tactiques. Il est
 * responsable de la gestion des tours, du déroulement des actions, et
 * des conditions de victoire/défaite. Il sert d'interface centrale.
 * 
 * Il est conçu pour fonctionner avec Scene_TrpgMapBattle et est instancié
 * en tant que $gameTRPGBattle.
 */

class TRPGBattleManager {
    constructor() {
        this.clear();
    }

    /**
     * Réinitialise l'état du manager. Appelé au début d'un nouveau jeu ou au chargement.
     */
    clear() {
        this._phase = 'idle'; // 'idle', 'setup', 'start', 'turn', 'action', 'end'
        this._actors = [];
        this._enemies = [];
        this._turnOrder = [];
        this._activeBattler = null;
    }

    /**
     * Initialise un nouveau combat.
     * @param {number} troopId L'ID de la troupe d'ennemis.
     * @param {boolean} canEscape Indique si la fuite est possible.
     * @param {boolean} canLose Indique si la défaite est possible.
     */
    setup(troopId, canEscape, canLose) {
        $debugTool.log(`[TRPGBattleManager] Setup du combat avec la troupe ID: ${troopId}`);
        this.clear();
        this._phase = 'setup';
        // NOTE POUR L'INTÉGRATION :
        // Ici, on peuplerait this._actors et this._enemies.
        // Puis on déterminerait l'ordre de passage.
        this.determineTurnOrder();
        this.startBattle();
    }

    /**
     * Démarre officiellement le combat après le setup.
     */
    startBattle() {
        this._phase = 'start';
        this._turnIndex = -1; // Sera incrémenté à 0 pour le premier tour.
        $debugTool.log(`[TRPGBattleManager] Le combat commence. Ordre des tours:`, this._turnOrder.map(b => b.name()));
        this.processNextTurn();
    }

    /**
     * Passe au tour du prochain battler dans la liste.
     */
    processNextTurn() {
        this.endTurn(); // Termine le tour du battler précédent

        this._turnIndex = (this._turnIndex + 1) % this._turnOrder.length;
        this._activeBattler = this._turnOrder[this._turnIndex];
        this._phase = 'turn';

        $debugTool.log(`[TRPGBattleManager] Début du tour pour: ${this._activeBattler.name()}`);
        this.startTurn();
    }

    /**
     * Logique à exécuter au début du tour d'un battler (ex: régénération, états).
     */
    startTurn() {
        this._activeBattler.onTurnStart();
        // La scène (Scene_TrpgMapBattle) prendra le relais pour gérer les inputs
        // si c'est un acteur, ou l'IA si c'est un ennemi.
    }

    /**
     * Logique à exécuter à la fin du tour d'un battler.
     */
    endTurn() {
        if (this._activeBattler) {
            $debugTool.log(`[TRPGBattleManager] Fin du tour pour: ${this._activeBattler.name()}`);
            this._activeBattler.onTurnEnd();
        }
    }

    /**
     * Méthode principale de mise à jour, appelée par Scene_TrpgMapBattle.
     */
    update() {
        if (this._phase === 'battle' || this._phase === 'turn') {
            // Ici, on pourrait vérifier si l'action du battler actif est terminée.
            // Si oui, on appellerait this.processNextTurn();
            // Exemple très simplifié :
            // if (this.isActionFinished()) {
            //     this.processNextTurn();
            // }
        }
    }

    /**
     * [EXEMPLE] Détermine l'ordre de passage des combattants.
     * Pourrait être basé sur la statistique d'agilité (AGI).
     */
    determineTurnOrder() {
        // Simule la récupération des acteurs et ennemis
        const allBattlers = [...$gameParty.battleMembers(), ...$gameTroop.members()];

        // Trie les combattants par agilité décroissante (exemple)
        this._turnOrder = allBattlers.sort((a, b) => b.agi - a.agi);
    }

    getActiveBattler() {
        return this._activeBattler;
    }

    // --- Méthodes neutralisées (normalement liées à Scene_Battle) ---

    /**
     * [NEUTRALISÉ] Normalement, cette méthode interagit avec les fenêtres de Scene_Battle.
     * Dans notre cas, la gestion de l'interface est déléguée à Scene_TrpgMapBattle.
     */
    displayStartMessages() {
        $debugTool.log("[TRPGBattleManager] displayStartMessages (neutralisé)");
    }

    /**
     * [NEUTRALISÉ] La logique de victoire sera gérée par Scene_TrpgMapBattle.
     */
    processVictory() {
        $debugTool.log("[TRPGBattleManager] processVictory (neutralisé)");
    }

    /**
     * [NEUTRALISÉ] La logique de défaite sera gérée par Scene_TrpgMapBattle.
     */
    processDefeat() {
        $debugTool.log("[TRPGBattleManager] processDefeat (neutralisé)");
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_TRPGBattleManager",
    version: "1.0.0",
    icon: "🧠",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: {
        autoCreate: true,
        classProto: TRPGBattleManager,
        instName: "$gameTRPGBattle"
    },
    autoSave: true // L'état du combat doit être sauvegardé.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);