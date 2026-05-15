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
 * @plugindesc [MODULE] Talents - ActorTalentsManager
 * @author SimCraft Engine
 * @url https://github.com/Omnipr3z/SCE
 * @help
 * Classe container pour les talents d'un acteur
 */

class ActorTalentManager {
    constructor(data){
        this.initMembers(data);
    }
    get actor() {
        return $gameActors.actor(this._actorId);
    }
    initMembers(data) {
        this._actorId = data.actorId;
        this._initValues = data.intiValues || {};
        this._talents = {};
    }
    combine(talentIds) {
        let talentId, value;
        
        for(let i = 0; i < talentIds.length; i++){
            talentId = talentIds[i];
            value += this.talent(talentId).lvl;
        }
        
        return value/talentIds.length;
    }
    checkCombine(talentIds, required) {
        return this.combine(talentIds) > required;
    }
    check(talentId, required) {
        return this.talent(talentId).check(required);
    }
    addLvl (keyname, amount){
        this.talent(keyname).addLvl(amount);
    }
    gainExp(keyname, amount){
        this.talent(keyname).gainExp(amount);
    }
    talent(keyname){
        if(!this._talents[keyname]){
            const init = this._initValues[keyname];
            if(init){
                this._talents[keyname] = new Game_Talent(this.setTalentBase(init, keyname));
            }else{
                this._talents[keyname] = new Game_Talent(this.defaultValues(keyname));
            }
        }
        return this._talents[keyname];
    }
    setTalentBase(init, keyname) {
        return {
            actorId: this._actorId,
            keyname: keyname,
            name: init.name,
            lvl: init.lvl,
            exp: init.exp
        };
    }
    defaultValues(keyname) {
        return {
            actorId: this._actorId,
            name: keyname,
            keyName: keyname,
            lvl: 0,
            exp: 0
        };
    }
}

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_ActorTalentsManager",
    icon                : "\u{23F3}",
    version             : "0.2.1",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_Game_Talent"],
    loadDataFiles       : [],
    createObj           : { autoCreate: false},
    autoSave            : false
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);