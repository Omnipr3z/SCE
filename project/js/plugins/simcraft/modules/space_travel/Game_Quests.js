class Game_Quest{
    constructor(data){
        this._id = data.id;
        this._name = data.name;
        this._description = data.description;
        this._iconName = data.iconName;
        this._pos = data.pos;
        this._active = data.active;
        this._success = false;
        this._failed = false;
        this._alertTxt = data.alertTxt || [{ txt:"Signal Suspect", style:"info"}];
    }
    get id(){
        return this._id;
    }
    get name(){
        return this._name;
    }
    get description(){
        return this._description;
    }
    get iconName(){
        return this._iconName;
    }
    get pos(){
        return this._pos;
    }
    get active(){
        return this._active;
    }
    get alertTxt(){
        return this._alertTxt;
    }
    activate(){
        this._active = true;
    }
    deactivate(){
        this._active = false;
    }
    success(){
        return this._success;
    }
    failed(){
        return this._failed;
    }
    ended(){
        return this._failed || this._success;
    }
    validate(result){
        if(result){
            this._success = true;
        }else{
            this._failed = true;
        }
    }
};
class Game_Quests{
    constructor(data){
        this._data = [];
        this.load(data)
    }
    quests(){
        return this._data;
    }
    alerts(){
        return this._data;
    }
    quest(questId) {
        return this._data.find(quest => quest.id === questId);
    }
    addQuest(quest){
        this._data[quest.id] = new Game_Quest(quest);
    }
    load(data){
        data.forEach((quest, index) => {
            this._data[index] = new Game_Quest(quest);
        })
    }
};
const $gameQuests = new Game_Quests($dataQuests);