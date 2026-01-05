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
 * @plugindesc !SC [v1.0.0] Patch pour lier les stats/traits aux mécaniques (Saut, Stamina).
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 * @base SC_ActorMainManager
 * @orderAfter SC_ActorMainManager
 *
 * @help
 * SC_Mechanics_TraitsPatch.js
 * 
 * Ce patch connecte les statistiques natives (AGI, etc.) et les Notetags
 * de la base de données aux mécaniques du SimCraft Engine.
 *
 * -----------------------------------------------------------------------------
 * 1. CONFIGURATION DES FORMULES (Dans le code ci-dessous)
 * -----------------------------------------------------------------------------
 * Vous pouvez définir comment l'AGI influence nativement les taux.
 *
 * -----------------------------------------------------------------------------
 * 2. NOTETAGS (Balises de notes)
 * -----------------------------------------------------------------------------
 * À placer sur : Acteurs, Classes, Armes, Armures, États (States).
 *
 * --- SAUT (JUMP) ---
 * <sc_jump_rate: x>
 * Modifie la distance de saut.
 * Ex: <sc_jump_rate: 0.5>  -> +50% de distance.
 * Ex: <sc_jump_rate: -0.2> -> -20% de distance (malus armure lourde).
 *
 * --- ENDURANCE (STAMINA / FORM) ---
 * <sc_stamina_cost: x>
 * Modifie la consommation d'endurance.
 * Ex: <sc_stamina_cost: -0.1> -> Coûte 10% moins cher (Économie).
 *
 * --- SOUFFLE (BREATH) ---
 * <sc_breath_regen: x>
 * Modifie la vitesse de récupération du souffle.
 * Ex: <sc_breath_regen: 0.2> -> Récupère 20% plus vite.
 *
 * --- IMPULSION (IMPULSE) ---
 * <sc_impulse_gain: x>
 * Modifie la vitesse de gain d'impulsion.
 * Ex: <sc_impulse_gain: 0.5> -> Monte 50% plus vite.
 */

(() => {
    // ========================================================================
    // CONFIGURATION
    // ========================================================================
    const SC_TraitsConfig = {
        // Formule pour le bonus de saut basé sur l'AGI.
        // "agi" est la valeur de l'agilité de l'acteur.
        // Retourne un pourcentage (0.001 = 0.1% par point d'agi).
        jumpAgiFormula: (agi) => Math.floor(agi / 10) * 0.01, // Ex: 50 Agi = +0.05 (+5%)

        // Formule pour l'économie de stamina basée sur l'AGI (ou autre stat).
        staminaAgiFormula: (agi) => 0, // Désactivé par défaut

        // Formule pour la regen de souffle.
        breathAgiFormula: (agi) => 0, // Désactivé par défaut
    };

    // ========================================================================
    // Game_Actor - Extension pour lire les Traits SimCraft
    // ========================================================================
    
    /**
     * Calcule la somme des valeurs d'un tag spécifique sur tous les objets de trait
     * (Acteur, Classe, Équipement, États).
     * @param {string} tagName Le nom du tag (ex: 'sc_jump_rate').
     * @returns {number} La somme des valeurs trouvées.
     */
    Game_Actor.prototype.getScTraitSum = function(tagName) {
        let value = 0;
        // traitObjects() retourne [Actor, Class, Equipments..., States...]
        const objects = this.traitObjects();
        for (const obj of objects) {
            if (obj && obj.meta && obj.meta[tagName]) {
                value += parseFloat(obj.meta[tagName]);
            }
        }
        return value;
    };

    // ========================================================================
    // Game_CharacterBase - Intégration du Saut
    // ========================================================================

    /**
     * Récupère le multiplicateur de distance de saut.
     * Base 1.0 + Bonus AGI + Bonus Traits.
     */
    Game_CharacterBase.prototype.getJumpDistanceMultiplier = function() {
        const actor = this.actor ? this.actor() : null;
        if (!actor) return 1.0;

        // 1. Bonus via Formule de Stat (AGI)
        const statBonus = SC_TraitsConfig.jumpAgiFormula(actor.agi);

        // 2. Bonus via Notetags (<sc_jump_rate: x>)
        const traitBonus = actor.getScTraitSum('sc_jump_rate');

        // Base 100% + Bonus
        return Math.max(0.1, 1.0 + statBonus + traitBonus);
    };

    // ========================================================================
    // ActorHealthManager - Intégration Stamina/Souffle/Impulse
    // ========================================================================
    
    /**
     * Retourne le taux de consommation d'endurance (1.0 = normal).
     * Plus c'est bas, moins on consomme.
     */
    ActorHealthManager.prototype.getStaminaCostRate = function() {
        const actor = this.mainManager.actor;
        if (!actor) return 1.0;

        const statBonus = SC_TraitsConfig.staminaAgiFormula(actor.agi);
        // Note: Pour le coût, un bonus négatif est bon (réduction de coût).
        // Donc si on met <sc_stamina_cost: -0.1>, on veut 0.9.
        const traitBonus = actor.getScTraitSum('sc_stamina_cost');

        return Math.max(0.1, 1.0 + statBonus + traitBonus);
    };

    /**
     * Retourne le taux de régénération du souffle (1.0 = normal).
     */
    ActorHealthManager.prototype.getBreathRegenRate = function() {
        const actor = this.mainManager.actor;
        if (!actor) return 1.0;

        const statBonus = SC_TraitsConfig.breathAgiFormula(actor.agi);
        const traitBonus = actor.getScTraitSum('sc_breath_regen');

        return Math.max(0.1, 1.0 + statBonus + traitBonus);
    };

    /**
     * Retourne le taux de gain d'impulsion (1.0 = normal).
     */
    ActorHealthManager.prototype.getImpulseGainRate = function() {
        const actor = this.mainManager.actor;
        if (!actor) return 1.0;

        const traitBonus = actor.getScTraitSum('sc_impulse_gain');
        return Math.max(0.1, 1.0 + traitBonus);
    };

})();

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Mechanics_TraitsPatch",
    version: "1.0.0",
    icon: "🧬",
    author: "0mnipr3z",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["SC_ActorMainManager"],
    createObj: { autoCreate: false }
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);