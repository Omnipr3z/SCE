// ==============================================================================
// GESTIONNAIRE DES RELATIONS (Manager)
// ==============================================================================

class ActorRelationshipManager {
    constructor() {
        this._data = {
            factions: {},
            actors: {} // Correction: initialisé comme objet {} et non tableau [] pour utiliser des ID comme clés
        };
        console.log("ActorRelationshipManager initialisé");
        
    }

    defaultActorData(id) {
        return {
            id: id,
            factionKey: "sans",
            encountered: false,
            entente: 0,
            love: 0,
            sub: 0,
            negoce: 0 // <--- NOUVEAU : Bonus de négociation (en %)
        };
    }

    // Dans ActorRelationshipManager
    getPlayerFactionKey() {
        // Si le joueur a créé sa faction, elle est stockée dans une variable globale du jeu
        // Sinon, "sans" ou une faction de départ
        if ($gameVariables && $gameVariables.value(10)) { // Imaginons que la VAR 10 stocke la clé
            return $gameVariables.value(10);
        }
        return "sans"; // ou "player_default"
    }

    /**
     * Point d'entrée principal pour demander une relation
     * @param {number|string} key - ID de l'acteur ou clé de la faction
     * @param {string} type - 'factions' ou 'actors' (défaut)
     */
    relation(key, type) {
        if (type === 'factions') {
            return this.factionRel(key);
        } else {
            return this.actorRel(key);
        }
    }

    // --------------------------------------------------------------------------
    // GESTION DES ACTEURS (PNJ)
    // --------------------------------------------------------------------------

    actorRel(id) {
        // Si l'instance n'existe pas en mémoire de jeu, on la crée
        if (!this._data.actors[id]) {
            this._data.actors[id] = this.getActor(id);
        }
        return this._data.actors[id];
    }

    getActor(id) {
        // Priorité 1 : Donnée définie dans la database globale ($dataActorsRel)
        // Note : On suppose que $dataActorsRel est défini globalement ailleurs
        if (typeof $dataActorsRel !== 'undefined' && $dataActorsRel[id]) {
            return new Game_ActorsRelation($dataActorsRel[id]);
        } 
        // Priorité 2 : Données par défaut
        else {
            return new Game_ActorsRelation(this.defaultActorData(id));
        }
    }

    // --------------------------------------------------------------------------
    // GESTION DES FACTIONS
    // --------------------------------------------------------------------------

    factionRel(key) {
        if (!this._data.factions[key]) {
            this._data.factions[key] = this.getFaction(key);
        }
        return this._data.factions[key];
    }

    getFaction(key) {
        if (typeof $dataFactionsRel !== 'undefined' && $dataFactionsRel[key]) {
            return new Game_FactionsRelation($dataFactionsRel[key]);
        } else {
            return new Game_FactionsRelation(this.defaultFactionData(key));
        }
    }

    defaultFactionData(key) {
        const data = {};
        data.key = key;
        data.name = key;
        data.description = "Description par défaut pour " + key;
        
        // Caractéristiques intrinsèques de la faction
        data.charism = {
            brav: 0,  // Courage/Force : soumis < 0 < dominant
            nob: 0,   // Honneur : rebelle/fourbe < 0 < loyal/noble
            conv: 0,  // Tempérament : colérique < 0 < collaboratif/calme
            rank: 0   // Rang hiérarchique global
        };

        // Relation directe avec le JOUEUR
        data.diplo = {
            auth: 0,  // Autorité du Joueur sur cette faction
            loyal: 0, // Loyauté de la faction envers le Joueur
            influ: 0  // Influence culturelle/politique du Joueur sur la faction
        };

        // Menaces cosmiques
        data.menace = {
            corrupt: 0, // Corruption démoniaque / Warp
            infect: 0   // Infection Alien / Biologique
        };

        // Matrice diplomatique (Relations de CETTE faction avec les AUTRES)
        // Note: C'est ici que le Lore Space Opera est défini
        data.interact = {
            imper: 0,   // Empire galactique (40k, Star Wars, Orii)
            rebels: 0,  // Rébellion (Star Wars, Jaffa)
            yuma: 0,    // Tribal/Guerrier (Wakanda, Goa'uld gentils, Mandaloriens)
            olk: 0,     // Chaos/Dark Side (Thanos, Zorg, Sith)
            drak: 0,    // Humanoïdes Dragons/Vikings (Saiyans, Asgardiens, Chevaliers 40k)
            eleris: 0,  // Hauts Elfes de l'espace (Eldars, Kree)
            atronis: 0, // IA/Robots (Nécrons, Geth, Réplicateurs)
            elions: 0,  // Diplomates avancés (Asgard Stargate, Tau)
            grok: 0,    // Brutes (Orks, Mangalores)
            vorace: 0,  // Essaim (Tyranides, Arachnides)
            league: 0   // Commerce (Ligue marchande, Rogue Traders)
        };

        return data; // Important : retourner l'objet construit
    }
}

const $relationManager = new ActorRelationshipManager();

InteractionRegistry.register(InteractRel_Presentation);
InteractionRegistry.register(InteractRel_Flirter);
InteractionRegistry.register(InteractRel_Menacer);
        // Enregistrer d'autres interactions ici...

