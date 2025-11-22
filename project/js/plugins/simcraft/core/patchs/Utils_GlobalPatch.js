


Game_Player.prototype.actor = function() {
    return $gameParty.leader();
};
// =========================================================================
// Window_Base - Patch
// Ajout de la méthode drawGauge qui est normalement dans Window_StatusBase.
// =========================================================================
if (!Window_Base.prototype.drawGauge) {
    Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
        const fillW = Math.floor(width * rate);
        const gaugeY = y + this.lineHeight() - 8;
        this.contents.fillRect(x, gaugeY, width, 6, ColorManager.gaugeBackColor());
        this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
    };
}