ImageManager.loadWorldmap = function(filename){
    this.loadBitmap("img/GUI/HudWorldmap/", filename)
}
ImageManager.loadFaceNano = function(actorId){
    this.loadBitmap("img/faces/nano/", actorId)
}
ImageManager.preloadMapSceneImages = function(){
    this.preloadGUI()
    //this.preloadImportantCharacters();
}
ImageManager.preloadGUI = function(){
    this.preloadGUIFolderImages('HudActor');
    this.preloadGUIFolderImages('HudEquips');
    this.preloadGUIFolderImages('HudDate');
    this.preloadGUIFolderImages('HudInteractions');
    this.preloadGUIFolderImages('HudTalents');
    this.preloadGUIFolderImages('HudPlant');
    this.preloadGUIFolderImages('HudStats');
    this.preloadGUIFolderImages('HudTcgDeck');
    this.preloadGUIFolderImages('HudWorldmap');
    this.preloadGUIFolderImages('HudKingdomSelect');
    this.preloadGUIFolderImages('factions');
}
ImageManager.preloadImportantCharacters = function(){
    for(let i = 1; i < 6; i++){
        ImageManager.loadBitmap("img/characters/", `gather_${i}`);
    }
    for(let i = 1; i < 2; i++){
        ImageManager.loadBitmap("img/characters/composite/", `SC_body${i}`);
        ImageManager.loadBitmap("img/characters/composite/", `SC_face${i}`);
    }
}
ImageManager.preloadGUIFolderImages = function(folderName, extension = '.png') {
    if (!window.require) return; // Sécurité si pas en mode NW.js
    const fs = require('fs');
    const path = require('path');
    const basePath = path.join('img/GUI/', folderName);
    const files = fs.readdirSync(basePath);

    files.forEach(file => {
        if (file.endsWith(extension)) {
            const imageName = file.replace(extension, '');
            ImageManager.loadBitmap(`img/GUI/${folderName}/`, imageName);
            //console.log(`[Preload] img/GUI/${folderName}/${file} réservé.`);
        }
    });
}