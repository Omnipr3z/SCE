const _window_move = Window.prototype.move;
Window.prototype.move = function(x, y, width, height) {
    const rect = SC.calculateScaledRect (x,y,width,height);
    // if(!(SceneManager._scene instanceof Scene_SpaceTravelz))
        _window_move.call(this, rect.x, rect.y, rect.width, rect.height);
    // else
    //     _window_move.call(this, x, y, width, height);
};