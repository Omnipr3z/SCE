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
 * @plugindesc !SC [v1.0.0] Gestionnaire global des données de plantation.
 * @author SimCraft
 * @url https://github.com/Omnipr3z/SCE
 * @base SC_SystemLoader
 *
 * @help
 * 
 * @historique
 * 
 */

class Game_Plantation{
    constructor(mapId, eventId, data){
        if(data){
            this.setup(data);
        }else{
            this.setup($dataPlantations[this.event().meta.plantationId]);
        }
    }
    // GETTERS
    get event(){
        if(!this._eventId || $gameMap.mapId() != this._mapId)
            return null;
        return $gameMap.event(this._eventId);
    }
    get specyData(){
        return $dataPlantSpecies[this._specyId];
    }
    get stageData(){
        return this.specyData.stages[this._stage];
    }
    get hydra(){
        return this._hydra;
    }
    isOnCurrentMap(){
        return $gameMap.mapId() == this._mapId;
    }
    needSpriteUpdate() {
        return this._oldStage != this._stage
            &&  this.isOnCurrentMap();
    }
    needUpdate(){
        return (this.haveSeed() && !this.isDied() && !this.isBlank());
    }
    needYieldUpdate() {
        return this.stageData.products
           && this.stageData.products.lenght > 0;
    }
    needProductGrowUpdate(product){
        this._products[product.itemId] = this._products[product.itemId] || 0;
        return this._products[product.itemId] < product.max;
    
    }
    needWilteredUpdate() {
        const needed = false;

        this._products.forEach((product, index)=>{
            if(!this.stageData.harvest[index])
                needed = true;
        });

        return needed;
    }
    isBlank(){
        return this._stage == 0;
    }
    haveSeed(){
        return this._specyId != null
            && this._specyId != 0;
    }
    isDied(){
        return this.stageData.name == "dead";
    }
    canGrow() {
        return this._dryness < 100
            && this.stageData.growRate > 0;
    }
    //SETUP
    setup(mapId, eventId, data){
        this._mapId = mapId;
        this._eventId = eventId;

        this._name          = data.name       || "unamed_plant";
        this._dryness       = data.dryness    || 0;
        this._fertilizer    = data.fertilizer || 0;
        this._gathers       = data.gathers    || [];
        this._grow          = data.grow       || 0;
        this._growBuff      = data.growBuff   || 0;
        this._hydra         = data.hydra      || 100;
        this._specyId       = data.specyId    || 0;
        this._stage         = data.stage      || 0;
        this._oldStage      = -1;
    }
    
    //Update
    update(){
        if(this.needUpdate()){
            this.updateGrow();
            if(this.needSpriteUpdate()){
                this.updateVisual();
            }
        }
    }
    updateGrow(){
        this._growBuff = 0;
        this.updateHydra();
        this.updateFertilizer();
        this.grow();
        this.updateYield();
        this.updateStage();
    }
    updateHydra(){                                                              
        let step = this.stageData;
        if($gameWeather && $gameWeather.isRaining()){
            this._hydra += 20;
        }
        if(this._hydra >= step.hydratationRate){
            this._dryness = 0;
            this._hydra -= step.hydratationRate;
            this._growBuff++;
        }else{
            this._dryness++;
        }
    }
    updateFertilizer(){
        if(this._fertilizer > 0){
            this._growBuff++;
            this._fertilizer--;
        }
    }
    grow(){
        const step = this.stageData;
        if(this.canGrow()){
            const growSpeed = this._growBuff + step.growRate;
            this._grow = this._grow.approach(100, growSpeed);
        } 
    }
    updateYield(){
        if(!this.needYieldUpdate()){
            let step = this.stageData;
        
            //gather={growRate}
            step.products.forEach((product)=>{
                if(this.needProductGrowUpdate(product)){
                    this.growProduct(product);
                }
            });
        }else if(this.needWilteredUpdate()) {
            this.witherProducts();
        }
    }
    growProduct(product){
        if(this._grow >= product.growRate){
            if(product.needTransform){
                const productToTransform = this._products[product.srcItemId]
                if(productToTransform){
                    productToTransform.num--;
                    this.addProduct(product, 1);
                    this.consumeGrow(product.growRate);
                }
            }else{
                this.addProduct(product, 1);
                this.consumeGrow(product.growRate);
            }
        }
    }
    addProduct (product, amount) {
        if(!this._products[product.itemId]){
            this._products[product.itemId] = 0;
        }
        this._products[product.itemId].num += amount;
    }
    consumeGrow(value){
        this._grow -= value;
        if(this._grow < 0)
            this._grow = 0;
    }
    witherProducts(){
        this._products.forEach((product, index)=>{
            const gatherItem = this.stageData.products.find((item)=>{
                item.itemId == product.itemId
            });
            const transformItem = this.stageData.products.find((item)=>{
                item.needTransform && item.srcItemId == product.itemId
            });

            if(product.num > 0 && !gatherItem && !transformItem){
                
                this._fadedProducts[product.itemId] += product;
                product = 0;
            }
            if(this._fadedProducts[product.itemId] > 0){
                this._fadedProducts[product.itemId]--;

            }

        });
    }       
    updateStage() {
        let step = this.stageData;
        if(this._dryness > 100){
            this._stage = this.stageData.onDryness;
        } else if(this._grow > 100){
            this._stage = this.stageData.onGrowUp;
            this._grow = 0;
        }
    }
    updateVisual(){
        if(this.isOnCurrentMap()){
            this.refreshVisual();
        }
    }
    refreshVisual(){
        const event = this.event();
        if(event){
            const charData = this.stageData.character;
            if(this._charData != charData){
                this.setVisual(event, charData);
            }
            this._oldStage = this._stage;
        }
    }
    setVisual(event, charData){
        event.setDirectionFix(false);
        event.setWalkAnime(true);

        if(this._bitmapName != charData.bitmapName || this._charIndex != charData.index){
            event.setImage(charData.bitmapName, charData.index);
        }
        if(this._hydra > 0){
            event.setPattern(2);
        }else{
            event.setPattern(1);
        }
       
        event.setDirection(charData.dir);
        event.setStepAnime(charData.stepAnim);

        event.setWalkAnime(false);
        event.setDirectionFix(true);
        this._charData = charData;
    }

    //usage
    // use(){
    //     if(this.isBlank()){
    //         this.plantSeed();
    //     }else if(this.isDied()){
    //         this.weed();
    //     }else{
    //         this.useAtStep()
    //     }
    // }
    // //plant
    // plantSeed(){
    //     //$guiManager.hud('hudTime').deactiveBtnTouch('timeSpeed');
    //     $gameParty.leader().startActivity(7);
    //     this.makeSeedChoice();
    // }
    // prepareChoice(){
    //     $gameMessage.clear();
    //     $gameMessage._popTarget = null;
    //     $gameMessage.setPositionType(2);
    //     $gameMessage.setChoicePositionType(1);
    //     $gameMessage.setBackground(0);

    //     this._callBackItem = [];
    // }
    // makeSeedChoice(){
    //     this.prepareChoice()
    //     let choices = [], choiceTxt = "";

    //     $dataSeeds.forEach(seed=>{
    //         if($gameParty.hasItem($dataItems[seed.itemId])){
    //             let item = $dataItems[seed.itemId];

    //             choiceTxt = `\\i[${item.iconIndex}] ${Voc.data("itemNames")[item.name]}`;
    //             choices.push(choiceTxt);
    //             this._callBackItem.push(seed.id);
    //         }
    //     });

    //     $gameMessage.setChoices(choices, 0, -1);
    //     let that = this;
    //     $gameMessage.setChoiceCallback(function(n){
    //         if(that._callBackItem[n])
    //             that.choicesSeedCallback(that._callBackItem[n]);
    //     });
    // }
    // choicesSeedCallback(seedId){
    //     this._seedId = Number(seedId);
    //     this._stepId = 1;
    //     $gameParty.leader().startActivity(8);
    //     let seedItem = $dataItems[$dataSeeds[seedId].itemId];
    //     $gameParty.gainItem(seedItem, -1);
    //     this.update();
    //     $gameMap.event(this._eventKey[1]).refresh()
    // }

    // //maintenance
    // useAtStep(){
    //     $gameParty.leader().startActivity(7);
    //     this.makeGatherChoice();
    // }
    // makeGatherChoice(){
        
    //     let choices = [];
    //     let gatherChoices = [];
    //     let choicesTxt = [];
    //     let actor = $gameParty.leader();

    //     this.prepareChoice();
    //     this._callBackItem = [];

    //     if(actor.haveHydraTool())
    //         choices.push(this.hydraToolChoice());

    //     if(actor.haveFertilizer())
    //         choices.push(this.fertilizerChoice());

    //     this._gathers.forEach((gather, index)=>{
    //         console.log(gather);
    //         if(actor.canGather(gather)){    console.log(gather)
    //             gatherChoices.push(gather);
    //         }
    //     })

    //     if(gatherChoices.length > 0)
    //         choices.push(this.gatherChoice(gatherChoices));

    //     $gamePlantations._activeId = this._plantId;

    //     if(choices.length >0){
    //         choices.forEach((choice, index)=>{
    //             choicesTxt[index] = (choice.txt);
    //             this._callBackItem[index] = (choice.callback);
    //         });


    //         $gameMessage.setChoices(choicesTxt, 0, -1);
    //         let that = this;
    //         $gameMessage.setChoiceCallback(function(n){
    //             if(that._callBackItem[n])
    //                 that.choicesGatherCallback(that._callBackItem[n]);
    //         });
    //     }else{
    //         actor.stopActivity();
    //     }
    // }
    // hydraToolChoice(){
    //     let actor   = $gameParty.leader(),
    //         tool    = actor.equips()[0],
    //         iconId  = tool.iconIndex;
    //     return {
    //         "txt":Voc("actWaterPlant").format([iconId]),
    //         "callback":{action:"waterize"} 
    //     };
    // }
    // fertilizerChoice(){
    //     return {
    //         "txt":Voc("actFertilizePlant"),
    //         "callback":{action:"fertilize"}
    //     };
    // }
    // gatherChoice(gatherChoice){
    //     let choice = {},
    //         itemsList = [];
    //     if($gameParty.leader().equips[0])
    //         choice.txt = `\\i[${$gameParty.leader().equips[0].iconIndex}] `;
    //     else
    //         choice.txt = `\\i[${Voc("handIconIndex")}] `;
    //     choice.txt += Voc("actCollecter");

    //     gatherChoice.forEach(gather=>{
    //         itemsList.push(gather.id);
    //         let item = $dataItems[gather.itemId];
    //         choice.txt += ` \\i[${item.iconIndex}]${Voc.data("itemNames")[item.name]}`;
    //     })
    //     choice.txt += ".";
    //     choice.callback = {
    //         action: "gather",
    //         itemIds:itemsList
    //     }

    //     return choice;
    // }
    // choicesGatherCallback(data){
    //     let actor = $gameParty.leader();
    //     switch(data.action){
    //         case "waterize":
    //             actor.startActivity(9);
    //             this.refreshVisual();
    //             break;
    //         case "gather":
    //             this.gatherItems(data.itemIds);
    //             break;
    //         default:
    //             console.log(data);
    //             break;
    //     }                                      
    // }
    // gatherItems(itemList){
    //     $gamePlantations._itemsGather = itemList; 
    //     $gameParty.leader().startActivity(11);
    // }
    // gainHydra(value){
    //     this._hydra = (this._hydra + value).clamp(0,4);
    // }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_Game_Plantation",
    version: "1.0.0",
    icon: "🌳",
    author: "0mnipr3z",
    license: "CC BY-NC-SA 4.0",
    dependencies: ["SC_SystemLoader"],
    loadDataFiles: [],
    createObj: {
        autoCreate: false
    },
    autosave: true
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);