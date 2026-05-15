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
 * @plugindesc [MODULE] Talents - Game_Talent Component
 * @author SimCraft Engine
 * @url https://github.com/Omnipr3z/SCE
 * @help
 * Composant de gestion d'un talent individuel pour le module Talents.
 */

var Imported = Imported || {};
Imported.SCE_GameTalent = true;

class Game_Talent {
    constructor(data){
        this.initMembers(data);
    }
    get lvl() {
        return this._lvl;
    }
    get exp() {
        return this._exp;
    }
    get name() {
        return this._name;
    }
    get actor() {
        return $gameActors.actor(this._actorId);
    }
    set lvl(value) {
        this._lvl = value;
    }
    set exp(value) {
        this._exp = value;
    }
    set name(value) {
        this._name = value;
    }
    get keyName() {
        return this._keyName;
    }
    maxLvl(){
        return this.actor.lvl;
    }
    get talentBaseData(){
        return $dataTalents[this.keyName] || null;
    }
    initMembers(data) {
        this._actorId = data.actorId;
        this._keyName = data.keyName;
        this._name = data.name;
        this._exp = data.exp || 0;
        this._lvl = data.lvl || 0;
    }
    check(requiredLvl) {
        return this._lvl >= requiredLvl;
    }
    checkTalentLvlUp() {
        if(this.lvl < this.maxLvl()){
            let seuilNxtLvl	= this.seuilNxtLvl(this.lvl);
            if(this.exp > seuilNxtLvl){
                this.addLvl(1);
                return true;
            }
        }
        return false;
    }
    seuilNxtLvl(lvl, value = 0) {

        for(let i = 1; i <= lvl; i++){
            value += this.seuilLvl(i);
        }
        
        return value;
    }
    seuilTalentLvl(lvl) {
        return Math.round(lvl * 12 *  lvl);
    }
    addLvl(lvl) {
        this._lvl += lvl;
    }
    amountExpForLvlAction(actionLvl) {
        return Math.round(this.seuilTalentLvl(actionLvl) / (20 + actionLvl));
    }
    gainExpForAction(actionLvl){
        this.gainExp(this.amountExpForLvlAction(actionLvl));
    }
    gainExp(exp) {
        this.exp += exp;
        if(this.checkTalentLvlUp())
            return true;
    }
}


SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_Game_Talent",
    icon                : "\u{23F3}",
    version             : "0.2.1",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : [],
    loadDataFiles       : [{filename:"Talents", instName:"$dataTalents"}], // La responsabilité du chargement est sur le Formatter.
    createObj           : {autoCreate  : false},
    autoSave            : false
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);