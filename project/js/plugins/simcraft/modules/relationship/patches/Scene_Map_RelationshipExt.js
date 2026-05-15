// =============================================================================
// Scene_Map - Relationship Extension
// =============================================================================
/*:
 * @plugindesc !SC [v1.0.0] Ajoute la fenêtre d'info de relation à la Scene_Map.
 * @author SimCraft
 * @base SC_Window_RelationshipInfo
 * @orderAfter SC_Window_RelationshipInfo
 *
 * @help
 * Ce patch alias la méthode createAllWindows de Scene_Map pour y ajouter
 * la fenêtre d'information de relation.
 * La fenêtre est initialement invisible et sera gérée par le DialogManager.
 */

(() => {
    // 1. Ajout des fenêtres à la création de la scène
    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createRelationshipInfoWindow();
        this.createInteractionWindow(); // Ajout de la fenêtre d'interaction
    };

    // --- Fenêtre d'info de relation
    Scene_Map.prototype.createRelationshipInfoWindow = function() {
        const rect = this.relationshipInfoWindowRect();
        this._relationshipInfoWindow = new Window_RelationshipInfo(rect);
        this._relationshipInfoWindow.hide();
        this._relationshipInfoWindow.deactivate();
        this.addWindow(this._relationshipInfoWindow);
    };

    Scene_Map.prototype.relationshipInfoWindowRect = function() {
        // Dimensions pour une résolution de référence (ex: 1280x720)
        // Le patch de SCE se chargera de l'adapter à la résolution actuelle.
        const refWidth = 160;
        const refHeight = 160;
        const refX = 8;
        const refY = 8;
        return new Rectangle(refX, refY, refWidth, refHeight);
    };
    
    // --- Fenêtre de choix d'interaction (AJOUT)
    Scene_Map.prototype.createInteractionWindow = function() {
        // Le rect est un placeholder, DialogManager le redimensionnera et le positionnera.
        const rect = new Rectangle(320, 155, 960, 540);// Taille par défaut pour une résolution de 1280x720
        this._interactionWindow = new Window_InteractionChoice(rect);
        this._interactionWindow.setInfoWindow(this._relationshipInfoWindow); // Lien avec la fenêtre d'info
        this.addWindow(this._interactionWindow);
    };

    // 2. Accesseurs pour que les managers puissent trouver les fenêtres
    Scene_Map.prototype.getRelationshipInfoWindow = function() {
        return this._relationshipInfoWindow;
    };

    Scene_Map.prototype.getInteractionWindow = function() {
        return this._interactionWindow;
    };

})();
