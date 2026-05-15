
class ActorDialsManager{
    constructor(data){
        this.initMembers(data);
    }
    get MM(){
        return $actorsMM.actor(this._actorId);
    }
    get msgWindow(){
        return SceneManager._scene._messageWindow;
    }
    get character(){
        return this.MM.character;
    }
    initMembers(data){
        this._actorId = data.actorId;
    }
    prepareWindow(posType, bgType){
        this.msgWindow.setMapTarget(this.character);
        $gameMessage.setBackground(bgType);
        $gameMessage.setPositionType(posType);
    }
    talk(messages, posType = 2, bgType = 0){
        if(SceneManager._scene instanceof Scene_Map){
            this.prepareWindow(posType, bgType);
            this.extractMessages(messages);
            this.msgWindow.open();
        }
    }
    extractMessages(messages){
        if(Array.isArray(messages)){
            this.drawMsgs(messages);
        }else if(messages.contains('\n')){
            const msgs = messages.split('\n');
            this.drawMsgs(msgs);
        }else{
            $gameMessage.add(messages.toString());
        }
    }
    drawMsgs(msgs){
        msgs.forEach(msg=>{
            $gameMessage.add(msg);
        })
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_ActorDialsManager",
    version: "1.0.0",
    icon: "👨‍💼",
    author: AUTHOR,
    license: LICENCE,
    dependencies: ["SC_SystemLoader"],
    createObj: { autoCreate: false},
    autoSave: false
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
