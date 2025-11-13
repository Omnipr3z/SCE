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
 * @plugindesc !SC [v1.0.0] Scène de combat tactique sur la carte.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * Scene_TrpgMapBattle.js
 * 
 * Ce fichier définit la classe Scene_TrpgMapBattle, qui hérite de Scene_Map.
 * C'est la scène principale pour les combats tactiques (TRPG).
 * 
 * Elle est conçue pour être lancée via un "transfert sur place" du joueur,
 * en utilisant un patch sur SceneManager pour la substituer à Scene_Map
 * lorsque le jeu est en mode combat.
 */

class Scene_TrpgMapBattle extends Scene_Map {
    constructor() {
        // Le constructeur se contente d'appeler super(), comme dans RMMZ.
        super();
    }

    initialize() {
        // On exécute notre logique AVANT d'appeler l'initialisation parente.
        this._battleMode = true;
        $debugTool.log("[Scene_TrpgMapBattle] Méthode initialize() appelée.");
        // On appelle la méthode initialize de Scene_Map.
        super.initialize();
    }

    create() {
        $debugTool.log("[Scene_TrpgMapBattle] Méthode create() appelée.");
        // On appelle la méthode create de Scene_Map pour construire toute la base (tilemap, spriteset, etc.)
        super.create();
    }

    start() {
        $debugTool.log("[Scene_TrpgMapBattle] Méthode start() appelée.");
        super.start();
        // Ici, nous ajouterons plus tard la logique de démarrage du combat,
        // comme l'affichage de la grille et des fenêtres de combat.
    }

    update() {
        super.update();
        $gameTRPGBattle.update();
    }

    /**
     * [SURCHARGE] Prépare la scène pour le combat.
     */
    onMapLoaded() {
        super.onMapLoaded();
        // Pour l'instant, on lance un combat de test avec la troupe 1.
        $gameTRPGBattle.setup(1, false, false);
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Scene_TrpgMapBattle",
    version: "1.0.0",
    icon: "⚔️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false } // C'est une classe de scène, pas une instance globale.
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);