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
 * @plugindesc !SC [v0.1.0] Gestionnaire de personnages sur la carte
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help CharacterManager.js
 * 
 *   ██████╗██╗  ██╗ █████╗ ██████╗ 
 *  ██╔════╝██║  ██║██╔══██╗██╔══██╗
 *  ██║     ███████║███████║██████╔╝
 *  ██║     ██╔══██║██╔══██║██╔══██╗
 *  ╚██████╗██║  ██║██║  ██║██████╔╝
 *   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 
 * 
 * Ce fichier fournit un gestionnaire centralisé ($characterManager) pour les
 * personnages (événements dynamiques) présents sur la carte. Il permet un
 * accès rapide à un événement via l'ID de l'acteur qui lui est associé.
 * 
 * ▸ Fonctionnalités Clés :
 *   - Registre central pour les personnages dynamiques sur la carte.
 *   - Accès rapide à un Game_Event via un actorId.
 *   - Gère le cycle de vie des personnages (réinitialisation au changement de carte).
 *
 * ▸ Nécessite :
 *   - Est peuplé par Scene_ScMap.js lors du chargement de la carte.
 *
 * ▸ Historique :
 *   v0.1.0 - Version initiale.
 */
class Character_Manager{
    constructor(){
        this.initMembers();
    }
    initMembers(){
        this._characters = [];
    }
    reset(){
        this.initMembers();
    }
    actorCharacter(actorId){
        if(!this._characters[actorId])
            console.log(`actor ${actorId} dont have any chracater enabled !`);
        return this._characters[actorId];
    }
    addCharacter(character, actorId){
        this._characters[actorId] = character;
    }
}

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_CharacterManager",
    icon                : "👤",
    version             : "0.1.0",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader"],
    loadDataFiles       : [],
    createObj           : {autoCreate  : true, classProto: Character_Manager, instName: '$characterManager'},
    autoSave            : false
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);