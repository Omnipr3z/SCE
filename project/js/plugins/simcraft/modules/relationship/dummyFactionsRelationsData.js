var $dataFactionsRel = {
    "imper": {
        "key": "imper",
        "name": "L'Imperium",
        "description": "Empire galactique totalitaire, militariste et religieux. Inspiré de l'Imperium (40k) et de l'Empire (Star Wars). Ils prônent l'ordre par la force.",
        "charism": {
            "brav": 80,   // Puissants et dominants
            "nob": 50,    // Loyaux envers l'Empereur, mais impitoyables
            "conv": -30,  // Autoritaires, peu ouverts à la discussion
            "rank": 10    // Rang suprême
        },
        "diplo": { "auth": 0, "loyal": 0, "influ": 0 },
        "menace": { "corrupt": 10, "infect": 0 },
        "interact": {
            "imper": 100,
            "rebels": -100, // Ennemis jurés
            "yuma": -20,    // Considérés comme primitifs mais utiles
            "olk": -100,    // Hérétiques
            "drak": 10,     // Respect mutuel de la force militaire
            "eleris": -50,  // Xenos arrogants
            "atronis": -80, // Abominations technologiques
            "elions": -40,  // Philosophie incompatible (paix vs guerre)
            "grok": -90,    // Vermine à exterminer
            "vorace": -100, // Menace existentielle
            "league": 30    // Partenaires commerciaux nécessaires
        }
    },
    "rebels": {
        "key": "rebels",
        "name": "L'Alliance Rebelle",
        "description": "Coalition de résistants, combattants de la liberté. Inspiré des Rebelles (Star Wars) et de la Rébellion Jaffa.",
        "charism": {
            "brav": 40,   // Courageux mais moins équipés
            "nob": 90,    // Idéalistes, noblesse de cœur
            "conv": 60,   // Cherchent à convaincre et rallier
            "rank": 3
        },
        "diplo": { "auth": 0, "loyal": 0, "influ": 0 },
        "menace": { "corrupt": 0, "infect": 0 },
        "interact": {
            "imper": -100,
            "rebels": 100,
            "yuma": 50,     // Alliance naturelle contre l'oppression
            "olk": -80,     // Ennemis de la liberté
            "drak": 20,     // Alliés circonstanciels
            "eleris": 40,   // Soutien diplomatique
            "atronis": -10, // Mefiance
            "elions": 80,   // Idéaux partagés
            "grok": -30,    // Gêneurs
            "vorace": -100,
            "league": 20    // Fournisseurs (marché noir)
        }
    },
    "yuma": {
        "key": "yuma",
        "name": "Royaume Yuma",
        "description": "Société tribale avancée, guerriers spirituels. Inspiré du Wakanda, des Mandaloriens et des Goa'uld bienveillants.",
        "charism": {
            "brav": 90,   // Guerriers d'élite
            "nob": 80,    // Code d'honneur strict
            "conv": 0,    // Neutres, isolationnistes
            "rank": 6
        },
        "diplo": { "auth": 0, "loyal": 0, "influ": 0 },
        "menace": { "corrupt": 0, "infect": 0 },
        "interact": {
            "imper": -20,   // Refusent la soumission
            "rebels": 50,
            "yuma": 100,
            "olk": -100,    // Haine de la magie noire/corruption
            "drak": 70,     // Fraternité guerrière
            "eleris": 10,   // Respect distant
            "atronis": -40, // "Sans âme"
            "elions": 30,
            "grok": -60,    // Combat sans honneur
            "vorace": -100,
            "league": 0     // Commerce limité
        }
    },
    "olk": {
        "key": "olk",
        "name": "Culte d'Olk",
        "description": "Fanatiques du chaos et du côté obscur. Inspiré de Thanos, Sith et du Chaos (40k).",
        "charism": {
            "brav": 70,   // Puissance terrifiante
            "nob": -100,  // Traîtres, cruels
            "conv": -80,  // Fous furieux ou manipulateurs sombres
            "rank": 8
        },
        "diplo": { "auth": 0, "loyal": 0, "influ": 0 },
        "menace": { "corrupt": 100, "infect": 0 },
        "interact": {
            "imper": -100,
            "rebels": -80,
            "yuma": -100,
            "olk": 100,
            "drak": -50,
            "eleris": -90,  // Ennemis ancestraux
            "atronis": 20,  // Utilisation possible comme outils
            "elions": -100,
            "grok": 40,     // Manipulables pour la guerre
            "vorace": 0,    // Concurrents dans la destruction
            "league": -10   // Commerce illicite d'artefacts
        }
    },
    "drak": {
        "key": "drak",
        "name": "Clans Drak",
        "description": "Humanoïdes dragons/sauriens, culture viking spatiale. Inspiré des Saiyans, Asgardiens (MCU) et Space Wolves.",
        "charism": {
            "brav": 100,  // La force avant tout
            "nob": 60,    // Loyaux si on prouve sa valeur
            "conv": -40,  // Têtus et bagarreurs
            "rank": 7
        },
        "diplo": { "auth": 0, "loyal": 0, "influ": 0 },
        "menace": { "corrupt": 0, "infect": 0 },
        "interact": {
            "imper": 10,    // Respectent la puissance de feu
            "rebels": 20,
            "yuma": 70,     // Respectent les guerriers
            "olk": -50,     // Lâches qui utilisent la magie
            "drak": 100,
            "eleris": -30,  // Trop fragiles et hautains
            "atronis": -20, // Pas de plaisir à combattre du métal
            "elions": 0,    // Ennuyeux
            "grok": 50,     // Bons partenaires de baston
            "vorace": -100, // La chasse ultime
            "league": 10    // Pour acheter des armes
        }
    },
    "eleris": {
        "key": "eleris",
        "name": "Synode Eleris",
        "description": "Ancienne race avancée et hautaine. Inspiré des Eldars, Hauts-Elfes et Kree.",
        "charism": {
            "brav": 20,   // Préfèrent la ruse et la distance
            "nob": 40,    // Nobles mais arrogants
            "conv": 80,   // Maîtres de la diplomatie et manipulation
            "rank": 9
        },
        "diplo": { "auth": 0, "loyal": 0, "influ": 0 },
        "menace": { "corrupt": 0, "infect": 0 },
        "interact": {
            "imper": -50,   // Singes brutaux
            "rebels": 40,   // Pions utiles
            "yuma": 10,     // Primitifs amusants
            "olk": -90,     // La grande menace
            "drak": -30,    // Brutes sans cervelle
            "eleris": 100,
            "atronis": -60, // L'anti-vie
            "elions": 50,   // Égaux intellectuels (presque)
            "grok": -80,    // Dégoûtants
            "vorace": -100, // Horreur biologique
            "league": 0     // Indifférence
        }
    },
    "atronis": {
        "key": "atronis",
        "name": "Le Collectif Atronis",
        "description": "Civilisation robotique IA. Inspiré des Nécrons, Réplicateurs, Geths.",
        "charism": {
            "brav": 100,  // Sans peur (machines)
            "nob": 0,     // Pas de morale
            "conv": -100, // Logique froide, impossible à émouvoir
            "rank": 8
        },
        "diplo": { "auth": 0, "loyal": 0, "influ": 0 },
        "menace": { "corrupt": 0, "infect": 0 },
        "interact": {
            "imper": -80,
            "rebels": -10,
            "yuma": -40,
            "olk": 20,
            "drak": -20,
            "eleris": -60,
            "atronis": 100,
            "elions": 10,   // Curiosité technologique
            "grok": -50,    // Inefficaces
            "vorace": -100, // Incompatibilité totale (Biomasse vs Métal)
            "league": 50    // Échanges de données/minerais
        }
    },
    "elions": {
        "key": "elions",
        "name": "Alliance Elions",
        "description": "Diplomates technologiques, les 'Gris' bienveillants. Inspiré des Asgards (Stargate) et Tau.",
        "charism": {
            "brav": -20,  // Faibles physiquement
            "nob": 100,   // Altruistes, protecteurs
            "conv": 100,  // Pacificateurs
            "rank": 9
        },
        "diplo": { "auth": 0, "loyal": 0, "influ": 0 },
        "menace": { "corrupt": 0, "infect": 0 },
        "interact": {
            "imper": -40,   // Tentent de civiliser l'Imperium
            "rebels": 80,   // Protègent les faibles
            "yuma": 30,
            "olk": -100,    // Opposés au mal
            "drak": 0,
            "eleris": 50,   // Respect intellectuel
            "atronis": 10,  // Tentative de compréhension
            "elions": 100,
            "grok": -40,    // Difficiles à éduquer
            "vorace": -100, // Doivent être contenus
            "league": 60    // Prospérité commune
        }
    },
    "grok": {
        "key": "grok",
        "name": "Horde Grok",
        "description": "Barbares de l'espace, mercenaires brutaux. Inspiré des Orks (40k) et Mangalores.",
        "charism": {
            "brav": 60,   // Aiment la bagarre
            "nob": -40,   // Vendus au plus offrant
            "conv": -50,  // Stupides et agressifs
            "rank": 2
        },
        "diplo": { "auth": 0, "loyal": 0, "influ": 0 },
        "menace": { "corrupt": 20, "infect": 0 },
        "interact": {
            "imper": -90,
            "rebels": -30,
            "yuma": -60,
            "olk": 40,      // Souvent enrôlés par le mal
            "drak": 50,     // "Bons pour la bagarre"
            "eleris": -80,
            "atronis": -50,
            "elions": -40,
            "grok": 100,    // (Sauf quand ils se tapent dessus)
            "vorace": -20,  // "Pas bon à manger"
            "league": 40    // Achètent des gros flingues
        }
    },
    "vorace": {
        "key": "vorace",
        "name": "L'Essaim Vorace",
        "description": "Prédateurs biologiques, esprit de ruche. Inspiré des Tyranides et Zerg.",
        "charism": {
            "brav": 100,  // Peur de rien
            "nob": 0,     // Concept inexistant
            "conv": 0,    // On ne négocie pas avec la faim
            "rank": 10
        },
        "diplo": { "auth": 0, "loyal": 0, "influ": 0 },
        "menace": { "corrupt": 0, "infect": 100 },
        "interact": {
            // En guerre avec absolument tout le monde
            "imper": -100, "rebels": -100, "yuma": -100, "olk": 0, 
            "drak": -100, "eleris": -100, "atronis": -100, 
            "elions": -100, "grok": -20, "vorace": 100, "league": -100
        }
    },
    "league": {
        "key": "league",
        "name": "La Ligue Marchande",
        "description": "Conglomérat commercial neutre. Inspiré de la Fédération du Commerce et Rogue Traders.",
        "charism": {
            "brav": -10,  // Préfèrent payer que se battre
            "nob": -20,   // L'argent n'a pas d'odeur
            "conv": 90,   // Négociateurs hors pair
            "rank": 5
        },
        "diplo": { "auth": 0, "loyal": 0, "influ": 0 },
        "menace": { "corrupt": 10, "infect": 0 },
        "interact": {
            "imper": 30,    // Gros client
            "rebels": 20,   // Client discret
            "yuma": 0,
            "olk": -10,     // Client risqué
            "drak": 10,     // Vente d'armes
            "eleris": 0,
            "atronis": 50,  // Partenariat technologique
            "elions": 60,   // Commerce stable
            "grok": 40,     // Vente de ferraille
            "vorace": -100, // Mauvais pour le business
            "league": 100
        }
    }
};