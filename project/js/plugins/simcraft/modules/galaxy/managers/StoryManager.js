class StoryManager{
    constructor(timeline){
        this._timeline = timeline;
    }
    update(){
        this.updateForce();
    }
    updateForce(){
        if($gameDate.timestamp >= 124655787 && !$gameQuests.quest(0).active){
            this.StartQuest(0);
        }
    }
    StartQuest(questId){
        const quest = $gameQuests.quest(questId);
        if(!quest.active && !quest.ended()){
            if(quest.alertTxt){
                quest.alertTxt.forEach((txt)=>{
                    SceneManager._scene._eventWindow.addNews(txt);
                })
                
            }
            quest.activate();
        }
    }
}
$storyManager = new StoryManager();
