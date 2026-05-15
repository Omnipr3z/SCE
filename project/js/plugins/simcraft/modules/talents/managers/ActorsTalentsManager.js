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
 * @plugindesc [MODULE] Talents - ActorsTalentsManager
 * @author SimCraft Engine
 * @url https://github.com/Omnipr3z/SCE
 * @help
 * Classe container pour les container des talents des acteurs
 */

class ActorsTalentsManager{
    constructor(){
        this._data = [];
    }
    actorTalents(actorId){
        if(!this._data[actorId]){
            this._data[actorId] = new ActorTalentManager(this.defaultValues(actorId));
        }

        return this._data[actorId];
    
    }
    defaultValues(actorId){
        const data = {
            actorId: actorId,
            intiValues: {
            }
        }
        return data;
    }
    makeSavefileData() {
        return this._data;
    }

}

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_ActorsTalentsManager",
    icon                : "\u{23F3}",
    version             : "0.2.1",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader", "SC_ActorTalentsManager"],
    loadDataFiles       : [],
    createObj           : { autoCreate: true, classProto: ActorsTalentsManager, instName: '$actorsTalentsManager' },
    autoSave            : true
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);