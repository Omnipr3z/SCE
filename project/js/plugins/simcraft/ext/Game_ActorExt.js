// Sauvegarde de la méthode originale
const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
const _Game_Actor_characterIndex = Game_Actor.prototype.characterIndex;

Game_Actor.prototype.initMembers = function() {
    _Game_Actor_initMembers.call(this);
    this._visualIndex = null; // Notre nouvel index dynamique
    this._currentPose = 'default'; // La pose par défaut de chaque acteur.
};
Game_Actor.prototype.characterIndex = function() {
    // Si un index visuel dynamique est défini, on le retourne en priorité.
    if (this._visualIndex !== null && this._visualIndex >= 0) {
        return this._visualIndex;
    }
    return 1
    // Sinon, on retourne le comportement par défaut.
    //return _Game_Actor_characterIndex.call(this);
};

/* ============= CUSTOM ================ */
Game_Actor.prototype.getMetadata = function() {
    const actorData = this.actor();
    if(!actorData.meta)
        DataManager.extractMetadata(actorData);
    return actorData.meta || {};
};
Game_Actor.prototype.isVisual = function() {
    // Vérifie si les données de l'acteur existent et si le notetag est présent.
    return !!this.getMetadata().visual;
};
/**
 * [NOUVEAU] Définit un index de sprite visuel dynamique pour cet acteur.
 * @param {number | null} index Le nouvel index (de 0 à 7), ou null pour revenir à la valeur par défaut.
 */
Game_Actor.prototype.setVisualIndex = function(index) {
    this._visualIndex = index;
};
/**
 * [NOUVEAU] Définit la pose actuelle de l'acteur.
 * @param {string} poseName Le nom de la nouvelle pose (doit exister dans SC.posesConfig).
 */
Game_Actor.prototype.setPose = function(poseName) {
    if (SC.posesConfig[poseName]) {
        this._currentPose = poseName;
    } else {
        $debugTool.warn(`Tentative de définir une pose inconnue: "${poseName}"`, true);
        this._currentPose = 'default';
    }
};
/**
 * [NOUVEAU] Récupère le nom de la pose actuelle de l'acteur.
 * @returns {string}
 */
Game_Actor.prototype.getPose = function() {
    // La pose forcée par l'équipement a la priorité.
    const equipmentPose = this.getEquipmentPose();
    if (equipmentPose) {
        return equipmentPose;
    }
    
    return this._currentPose || 'default';
};
/**
 * [NOUVEAU] Vérifie les équipements de l'acteur et retourne la première pose forcée trouvée.
 * @returns {string|null} Le nom de la pose forcée, ou null si aucune n'est trouvée.
 */
Game_Actor.prototype.getEquipmentPose = function() {
    for (const item of this.equips()) {
        if (item) {
            if (!item.meta) DataManager.extractMetadata(item);
            const poseName = item.meta.forcePose ? item.meta.forcePose.trim() : null;
            if (poseName) {
                // On vérifie si la pose forcée existe bien dans la configuration.
                if (SC.posesConfig[poseName]) {
                    $debugTool.log(`Pose forcée par l'équipement détectée: "${poseName}"`, true);
                    return poseName; // La pose est valide, on la retourne.
                } else {
                    // La pose n'existe pas, on affiche une erreur et on continue de chercher.
                    $debugTool.error(`La pose forcée "${poseName}" par l'équipement "${item.name}" (ID: ${item.id}) n'a pas été configurée dans SC_CharacterPoseConfig.js.`);
                }
            }
        }
    }
    return null;
};