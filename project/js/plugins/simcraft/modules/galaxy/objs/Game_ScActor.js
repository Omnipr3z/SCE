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
 * @plugindesc !SC [v0.1.0] Classe Game_Actor étendue pour SimCraft Engine
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help Game_ScActor.js
 * 
 *   ██████╗ █████╗ ██████╗ ████████╗ ██████╗  ██████╗ 
 *  ██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔═══██╗
 *  ██║     ███████║██████╔╝   ██║   ██║   ██║██║   ██║
 *  ██║     ██╔══██║██╔══██╗   ██║   ██║   ██║██║   ██║
 *  ╚██████╗██║  ██║██║  ██║   ██║   ╚██████╔╝╚██████╔╝
 *   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═════╝ 
 * 
 * Cette classe étend Game_Actor pour y intégrer les données et logiques
 * spécifiques au SimCraft Engine.
 * 
 * ▸ Responsabilités de cette classe :
 *   - Stocker l'état et les propriétés fondamentales de l'acteur (nom, niveau, classe...).
 *   - Fournir des accesseurs (getters) vers ses données de base (race, sexe, clan...).
 *   - Gérer son expérience, ses compétences et ses équipements.
 *   - Fournir une "recette" logique de son apparence visuelle (`getVisualLayers`).
 * 
 * ▸ Logiques externalisées (pour une meilleure architecture) :
 *   - La gestion de la santé/morphologie est déléguée à `$gameHealths`.
 *   - La gestion des activités est déléguée à `ActivityManager`.
 *   - La gestion des relations est déléguée à `Game_ActorRelation`.
 *   - La mise en forme de texte (présentation) sera déléguée à une classe `Presenter`.
 * 
 * ▸ Historique :
 *   v0.1.0 - Version initiale avec héritage et séparation des responsabilités.
 */

class Game_ScActor extends Game_Actor {

    // --- SURCHARGE DU CONSTRUCTEUR ET SETUP ---

    setup(actorId) {
        super.setup(actorId); // Appelle la méthode originale de Game_Actor
        const actor = this.actor();
        this._isVisual = actor.meta.visual || false;
        this._ready = actor.meta.ready || false;
        
        // Initialisation des managers délégués (lazy loading)
        this._activityManager = null;
        this._relation = null;
        this._worldmapManager = null;
    }

    // --- ACCESSEURS (GETTERS) POUR LES DONNÉES SC ---

    get dataSc() { return $dataActors[this._actorId]; }
    get raceId() { return Number(this.actor().meta.race) || 0; }
    get race() { return $gameRaces.race(this.raceId); }
    get clanId() { return this.actor().meta.clan || 0; }
    get clan() { return $gameClans.clan(this.clanId); }
    get kingdomId() { return this.clan.kingdomId; }
    get kingdom() { return $gameKingdoms.kingdom(this.kingdomId); }
    get sex() { return this.actor().meta.sex || "m"; }
    get isVisual() { return this._isVisual; }
    get ready() { return this._ready; }

    // --- GESTION DES MANAGERS DÉLÉGUÉS ---
    // C'est une bonne pratique : l'acteur ne gère pas lui-même la logique,
    // il délègue à des classes spécialisées.

    get health() { return $gameHealths.actor(this.actorId()); }
    get activities() {
        if (!this._activityManager) this._activityManager = new ActivityManager(this.actorId());
        return this._activityManager;
    }
    get activity() { return this.activities.current(); }
    get relation() {
        if (!this._relation) this._relation = new Game_ActorRelation(this.actorId());
        return this._relation;
    }
    get worldmap() {
        if (!this._worldmapManager) this._worldmapManager = new Game_ActorWorldmap(this.actorId());
        return this._worldmapManager;
    }

    // --- LOGIQUE VISUELLE ---
    // La seule responsabilité de l'acteur est de fournir la "recette" logique.
    // La traduction en fichiers et la composition sont faites ailleurs.

    getVisualLayers() {
        const actorId = this.actorId();
        const morpho = this.health.morpho;
        const layers = [];

        // Couches de base
        layers.push({ key: 'body', z: 30, filename: `${morpho}_body`, type: 'morpho' });
        layers.push({ key: 'face', z: 40, filename: `${actorId}_face`, type: 'actor' });

        // Couches optionnelles (ailes, queue)
        if (this.race.tail) {
            const tailType = this.tail ? 'actor' : 'morpho';
            const tailPrefix = this.tail ? actorId : morpho;
            layers.push({ key: 'tailBck', z: 20, filename: `${tailPrefix}_tail_bck`, type: tailType });
            layers.push({ key: 'tailFrt', z: 50, filename: `${tailPrefix}_tail_frt`, type: tailType });
        }
        if (this.race.wings) {
            const wingsType = this.wings ? 'actor' : 'morpho';
            const wingsPrefix = this.wings ? actorId : morpho;
            layers.push({ key: 'wingBck', z: 10, filename: `${wingsPrefix}_wing_bck`, type: wingsType });
            layers.push({ key: 'wingFrt', z: 60, filename: `${wingsPrefix}_wing_frt`, type: wingsType });
        }

        // Couches d'équipement
        for (const equip of this.equips()) {
            if (equip && equip.meta.visual) {
                const [key, filename, z] = equip.meta.visual.split(',').map(s => s.trim());
                let finalFilename = filename;
                // Logique pour les armures qui dépendent de la morphologie
                if (equip.atypeId === 4 && !morpho.includes("normal")) {
                    const morphoWeight = morpho.split("_")[0];
                    finalFilename = `${morphoWeight}_${filename}`;
                }
                layers.push({ key: key, z: Number(z) || 1, filename: finalFilename, type: 'equip' });
            }
        }

        return layers.sort((a, b) => a.z - b.z);
    }

    // --- LOGIQUE A DÉPLACER ---
    // Ces méthodes ne devraient pas être ici.
    // `presentation` et `story` sont du formatage de texte -> pour un `Presenter`.
    // `updateGameActivity` modifie d'autres objets -> pour un `Game_Map` ou `Scene_Map`.

}

// On indique au moteur de RMMZ de remplacer la classe Game_Actor par notre version étendue.
Game_Actor = Game_ScActor;