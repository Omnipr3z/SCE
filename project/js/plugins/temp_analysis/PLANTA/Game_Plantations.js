class Game_Plantations {
    constructor(){
        this._data = [];
        this._activeId = null;
        $dataPlants.forEach((plant, index)=>{
            if(plant)
                this.plantation(index);
        });
        this.updateEcosystem();
    }
    plantation(plantId, generateData){
        if(!this._data[plantId]){
            if($dataPlants[plantId]){
                this._data[plantId] = new Game_Plantation(plantId);
            }else if(generateData){
                this._data[plantId] = new Game_Plantation(plantId, generateData);
            }
        }
        return this._data[plantId];
    };
    updateEcosystem(){
        this._data.forEach((plant)=>{
            if(plant)
                plant.update();
        });
    };
    onMapLoad(){
        this._data.forEach((plant)=>{
            if(plant)
                plant.updateVisual();
        });
    }
    updtHr(){
        this._data.forEach((plant)=>{
            if(plant && Math.random() < 0.2) 
                plant.update();
        });
    }
    loadSavingData(savingData){
        savingData.forEach((data, index)=>{
            this._data[index] = new Game_Plantation(index, data);
        })
    }
    makeSavingData(){
        return this._data;
    }
    activePlant(){
        return this._data[this._activeId];
    }
}

class Game_Plantation{
    /** Game Clan $gamePlantation prototype constructor
     * @constructor instance $gamePlantations.plantation(plantationId) 
     */
    constructor(plantId, generateData){                                         SCMlog("\u{1F333} New Plantation " + plantId, false, false);
        if(generateData){
            this.loadGenerate(generateData);
        }else{
            this._plantId       = plantId;
            this._name          = "";
            this._eventKey      = [];
    
            this.setup();
        }
    }
    loadGenerate(plant){
        this._dryness       = plant._dryness;
        this._eventKey      = plant._eventKey;
        this._fertilizer    = plant._fertilizer;
        this._gathers       = plant._gathers;
        this._grow          = plant._grow;
        this._growBuff      = plant._growBuff;
        this._hydra         = plant._hydra;
        this._name          = plant._name;
        this._plantId       = plant._plantId;
        this._seedId        = plant._seedId;
        this._stepId        = plant._stepId;

        this.update();
    }
    setup(){
        let plant        = $dataPlants[this._plantId];

        
        this._name      = plant.name;
        //[mapId, eventId]
        this._eventKey  = plant.eventKey;

        this._hydra         = 0;
        this._stepId        = plant.stepId || 0;
        this._fertilizer    = 0;
        this._dryness       = 0;
        this._grow          = 0;
        this._growBuff      = 0;
        this._gathers       = plant.gathers?  plant.gathers : [];

        this._seedId        = plant.seedId || null;
        
        this.update();
    }
    //Update
    update(){
        if(this.needUpdate()){                                                  SCMlog("\u{1F333}Update Plantation" + this._seedId, false, false);
            this.updateGrow();
            this.updateVisual();
        }
    }
    needUpdate(){
        return (this.haveSeed() && !this.isDied() && !this.isBlank());
    }
    updateVisual(){
        if(this.isOnMap()){
            this.refreshVisual();
        }
    }
    isOnMap(){
        return $gameMap.mapId() == this._eventKey[0];
    }
    updateGrow(){                                                               SCMlog(`\u{1F333} => Plant ${this._plantId} Update seed:${this._seedId}`, false, false);
        this._growBuff = 0;
        this.updateHydra();
        this.updateFertilizer();
        this.grow();
        this.updateStep();
        this.updateGathers();
    }
    updateHydra(){                                                              
        let step = this.stepData();

        if(this._hydra >= step.needHydra){
            this._dryness = 0;
            this._hydra -= Math.random() * step.needHydra;
            this._growBuff++;
        }else{
            this._dryness++;
        }
        if(this._dryness > step.supportDryness){
            this.setDie();
        }                                                                       SCMlog(`\u{1F333} => Plant ${this._plantId} Water: ${this._hydra}hydra/${this._dryness}dryness - needHydra:${step.needHydra} - supportDryaness:${step.supportDryness}`, false, false);
    }
    updateFertilizer(){
        let step = this.stepData();

        if(this._fertilizer > 0){
            let cons = Math.max(step.fertilizerMax, this._fertilizer);;
            this._growBuff += cons;
            this._fertizer -= cons;
            this._growBuff += cons;
        }
    }
    grow(){                                                                     SCMlog("\u{1F333} => Plant Grow " + this._grow +"%", false, false);
        let step = this.stepData();
        let growVal = step.growSpeed + Math.max(this._growBuff - this._dryness, 0);

        this._grow += Math.max(growVal, 0.5);
    }
    updateStep(){
        let step = this.stepData();
        //gather={growRate}
        if(this._grow > 100){                                                   SCMlog("=> Plant Update step " + this._stepId, false, false);
            this._stepId = step.nextStep;
            this._grow = 0;
        }
    }
    updateGathers(){                                                            SCMlog("\u{1F333} => Update Gather", false, false);
        if(!this.isDied()){
            let step = this.stepData();
        
            //gather={growRate}
            step.gathers.forEach((gather, index)=>{
                if(this._grow > gather.needs || !this._gathers[gather.id]){
                    this.growGather(gather, index);
                }
            });
        }
    }
    growGather(gather, index){                                                  SCMlog("\u{1F333} => Gather grow", false, false);console.log("GATHER"); console.log(gather);

        if(!this._gathers[index])
            this.setupGather(gather, index);
            

        if(this._gathers[index].itemId != gather.itemId)
        this._gathers[index].itemId = gather.itemId;

        if(this._gathers[index].num < gather.max){
            this._grow -= Math.random() * gather.needs;
            this._gathers[index].num = Math.min(this._gathers[index].num + Math.round(Math.random() * gather.growNum), gather.max);
        }
    }
    setupGather(gather, index){
        this._gathers[index] = {
            itemId: gather.itemId,
            num:gather.min,
            max:gather.max,
            nextStep: gather.nextStep,
            growNum: gather.growNum,
            talentsReq: gather.talentsReq,
            formReq: gather.formReq
        }
    }
    refreshVisual(){
        let charData = this.character();                                        //console.log(charData); SCMlog("=> Plant Update visual " + charData.name, false, false);
        let event = $gameMap.event(this._eventKey[1]);

        event.setDirectionFix(false);
        if(this._hydra > 0){
            event.setImage(charData.name, charData.index + 4);
        }else{
            event.setImage(charData.name, charData.index);
        }
       
        event.setDirection(charData.dir);
        event.setStepAnime(charData.stepAnim);
        event.setWalkAnime(false);
        event.setDirectionFix(true);
    }

    //setter and getter
    isDied(){
        if(this._stepId == 0) return true;
        return this._stepId == this.stepsData().length - 1;
    }
    setDie(){
            this._stepId    = this.stepsData().length - 1;
            this._gathers   = [];
            this._hydra     = 0;
            this._ferlizer  = 0;
            this._growBuff  = 0;
    }
    character(){
        //{name, index, direction, stepAnim}
        if(this._stepId > 0){
            let char = this.stepData().character;
            return char;
        }else{
            return {name:"", "index":0, "dir":2, "stepAnim":false};
        } 
    }
    stepData(){
        return this.stepsData()[this._stepId];
    }
    stepsData(){
        return $dataSeeds[this._seedId].steps;
    }
    isBlank(){
        return this._stepId == 0;
    }
    haveSeed(){
        return this._seedId != null;
    }
    
    //usage
    use(){
        if(this.isBlank()){
            this.plantSeed();
        }else if(this.isDied()){
            this.weed();
        }else{
            this.useAtStep()
        }
    }

    //plant
    plantSeed(){
        //$guiManager.hud('hudTime').deactiveBtnTouch('timeSpeed');
        $gameParty.leader().startActivity(7);
        this.makeSeedChoice();
    }
    prepareChoice(){
        $gameMessage.clear();
        $gameMessage._popTarget = null;
        $gameMessage.setPositionType(2);
        $gameMessage.setChoicePositionType(1);
        $gameMessage.setBackground(0);

        this._callBackItem = [];
    }
    makeSeedChoice(){
        this.prepareChoice()
        let choices = [], choiceTxt = "";

        $dataSeeds.forEach(seed=>{
            if($gameParty.hasItem($dataItems[seed.itemId])){
                let item = $dataItems[seed.itemId];

                choiceTxt = `\\i[${item.iconIndex}] ${Voc.data("itemNames")[item.name]}`;
                choices.push(choiceTxt);
                this._callBackItem.push(seed.id);
            }
        });

        $gameMessage.setChoices(choices, 0, -1);
        let that = this;
        $gameMessage.setChoiceCallback(function(n){
            if(that._callBackItem[n])
                that.choicesSeedCallback(that._callBackItem[n]);
        });
    }
    choicesSeedCallback(seedId){                                                SCMlog("\u{1F333} => Seed Selected " + seedId, false, false);    console.log(this)
        this._seedId = Number(seedId);
        this._stepId = 1;
        $gameParty.leader().startActivity(8);
        let seedItem = $dataItems[$dataSeeds[seedId].itemId];
        $gameParty.gainItem(seedItem, -1);
        this.update();
        $gameMap.event(this._eventKey[1]).refresh()
    }

    //maintenance
    useAtStep(){                                                                console.log("use")
        $gameParty.leader().startActivity(7);
        this.makeGatherChoice();
    }
    makeGatherChoice(){
        
        let choices = [];
        let gatherChoices = [];
        let choicesTxt = [];
        let actor = $gameParty.leader();

        this.prepareChoice();
        this._callBackItem = [];

        if(actor.haveHydraTool())
            choices.push(this.hydraToolChoice());

        if(actor.haveFertilizer())
            choices.push(this.fertilizerChoice());

        this._gathers.forEach((gather, index)=>{
            console.log(gather);
            if(actor.canGather(gather)){    console.log(gather)
                gatherChoices.push(gather);
            }
        })

        if(gatherChoices.length > 0)
            choices.push(this.gatherChoice(gatherChoices));

        $gamePlantations._activeId = this._plantId;

        if(choices.length >0){
            choices.forEach((choice, index)=>{
                choicesTxt[index] = (choice.txt);
                this._callBackItem[index] = (choice.callback);
            });


            $gameMessage.setChoices(choicesTxt, 0, -1);
            let that = this;
            $gameMessage.setChoiceCallback(function(n){
                if(that._callBackItem[n])
                    that.choicesGatherCallback(that._callBackItem[n]);
            });
        }else{
            actor.stopActivity();
        }
    }
    hydraToolChoice(){
        let actor   = $gameParty.leader(),
            tool    = actor.equips()[0],
            iconId  = tool.iconIndex;
        return {
            "txt":Voc("actWaterPlant").format([iconId]),
            "callback":{action:"waterize"} 
        };
    }
    fertilizerChoice(){
        return {
            "txt":Voc("actFertilizePlant"),
            "callback":{action:"fertilize"}
        };
    }
    gatherChoice(gatherChoice){
        let choice = {},
            itemsList = [];
        if($gameParty.leader().equips[0])
            choice.txt = `\\i[${$gameParty.leader().equips[0].iconIndex}] `;
        else
            choice.txt = `\\i[${Voc("handIconIndex")}] `;
        choice.txt += Voc("actCollecter");

        gatherChoice.forEach(gather=>{
            itemsList.push(gather.id);
            let item = $dataItems[gather.itemId];
            choice.txt += ` \\i[${item.iconIndex}]${Voc.data("itemNames")[item.name]}`;
        })
        choice.txt += ".";
        choice.callback = {
            action: "gather",
            itemIds:itemsList
        }

        return choice;
    }
    choicesGatherCallback(data){                                                SCMlog("\u{1F333} => Gather Selected " + data.action, false, false);
        let actor = $gameParty.leader();
        switch(data.action){
            case "waterize":
                actor.startActivity(9);
                this.refreshVisual();
                break;
            case "gather":
                this.gatherItems(data.itemIds);
                break;
            default:
                console.log(data);
                break;
        }                                      
    }
    gatherItems(itemList){
        $gamePlantations._itemsGather = itemList; 
        $gameParty.leader().startActivity(11);
    }
    gainHydra(value){
        this._hydra = (this._hydra + value).clamp(0,4);
    }
    get hydra(){
        return this._hydra;
    }
}
Game_Actor.prototype.haveHydraTool= function(){
    let equipTool = this.equips()[0];
    if(!equipTool) return false;
    return equipTool.meta.water
        && $gameParty.hasItem($dataItems[Voc("waterItemId")]);
}
Game_Actor.prototype.haveFertilizer = function(){
    $gameParty.hasItem($dataItems[Voc("fertilizerItemId")])
}
Game_Actor.prototype.canGather = function(gather){
    let item = $dataItems[gather.itemId];
    let toolIdsList = ["0"];
    let can = false;
    let actor = $gameParty.leader();

    if(item.meta.gathertools)
        toolIdsList = item.meta.gathertools.split(',').map(Number);

    if((!actor.equips()[0] || actor.equips()[0].id == 1)  && toolIdsList.contains(0)){
        console.log("no tools")
        can =  true;
    }else if( toolIdsList.contains( actor.equips()[0].id ) ){
        can = true;
    }

    gather.talentsReq.forEach(talentReq=>{
        if(actor.talent(talentReq.name).lvl < talentReq.lvl){
            can = false;
        }
    })

    if(actor._health.form < gather.formReq)
        can = false;

    return can;
}

SC._temp = SC._temp || {};
SC._temp.pluginName         = "Game PLANTATIONS";
SC._temp.pluginParams       = PluginManager.parameters('Game_Plantations');
SC._temp.pluginRegister     = {
    name            : "Game_Plantation",
    version         : "0.0.1",
    author          : AUTHOR,
    copyright       : AUTHOR,
    license         : LICENCE,
    dependencies    : [
        "SimCraft_CORE"
    ],
    requires        : [
        {
            name:'$dataSeeds',
            src: 'Seeds.json',
            needObj:false,
            needSave:false
        },
        {
            name:'$dataPlants',
            src: "Plants.json",
            needObj:true,
            objName:'$gamePlantations',
            obj:Game_Plantations,
            needSave:true
        }
    ],
    useParams: String(SC._temp.pluginParams['Use plugin params'] || false)
};
$scm.checkPlugin(SC._temp.pluginRegister);