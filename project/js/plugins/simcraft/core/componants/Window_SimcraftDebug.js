
    // =========================================================================
    class Window_HealthHud extends Window_Base {
        constructor(rect) {
            super(rect);
            this._actor = null;
            this._healthManager = null;
            this._activityManager = null;
            //this.opacity = 0; // Fenêtre transparente
            this.refresh();
        }

        update() {
            super.update();
            // On rafraîchit la fenêtre si l'acteur a changé ou pour mettre à jour les valeurs.
            if (this._actor !== $gamePlayer.actor() || this.needsRefresh()) {
                this.refresh();
            }
        }

        // Détermine si un rafraîchissement est nécessaire (ex: toutes les 10 frames)
        // pour éviter de redessiner à chaque frame.
        needsRefresh() {
            return Graphics.frameCount % 10 === 0;
        }

        refresh() {
            this._actor = $gamePlayer.actor();
            if (!this._actor) return;
            this._mainManager = $actorsMM.actor(this._actor ? this._actor.actorId() : -1);

            this._healthManager = this._mainManager.health;


            this.contents.clear();

            const lineHeight = this.lineHeight();
            const gaugeWidth = this.contentsWidth() - 8;
            let y = 0;

            this.drawStat("SANTÉ", this._healthManager.getHealthScore(), y, gaugeWidth, "#66ff66", "#338033");
            y += lineHeight;
            this.drawStat("Satiété", this._healthManager.getAlim(), y, gaugeWidth, "#ffb833", "#a06c0c");
            y += lineHeight;
            this.drawStat("Forme", this._healthManager.getForm(), y, gaugeWidth, "#66ff66", "#338033");
            y += lineHeight;
            this.drawStat("Hygiène", this._healthManager.getClean(), y, gaugeWidth, "#66ccff", "#336680");
            y += lineHeight;
            this.drawStat("Hydrat.", this._healthManager.getHydra(), y, gaugeWidth, "#3399ff", "#1a4d80");
            y += lineHeight;
            this.drawStat("Souffle", this._healthManager.getBreath(), y, gaugeWidth, "#ffffff", "#808080");
            y += lineHeight;
            this.drawStat("Impulse", this._healthManager._impulse, y, gaugeWidth, "#ffffff", "#808080");

            y += lineHeight *2;
            const gd = $gameDate;
            const datetxt = `Date: ${gd.getDayMonth().padZero(2)}/${gd.getMonth().padZero(2)}/${gd.getYear()} - ${gd.getHr().padZero(2)}h${gd.getMin().padZero(2)}min`;
            this.drawText(datetxt, 6, y, this.contentsWidth() - 12, "center");
            
            y += lineHeight;
            const daypart = Game_DateFormatter.getPartOfDayName($gameDate);
            this.drawText(daypart, 6, y, this.contentsWidth() - 12, "center");

            y += lineHeight;
            const weatherTxt = `WEATHER ${$dataTimeSystem.seasons_global[$gameDate.getSeasonIndex()].toLowerCase()}: ${$gameWeather.type} ${Math.round($gameWeather.intensity*100)/100} (${$gameWeather.isForced?"F":"A"})
                ${$gameWeather.overlayName?$gameWeather.overlayName + '(' + $gameWeather.scrollX + '/' + $gameWeather.scrollY + ')':''} nxtUpt:${15 - $gameDate.timestamp + $gameWeather._lastLogicUpdateTime} frames`;
            const weatherArray = weatherTxt.split("\n").map(line => line.trim());
            for (let i = 0; i < weatherArray.length; i++) {
                this.drawText(weatherArray[i], 6, y, this.contentsWidth() - 12, "center");
                y += lineHeight;
            }

            const actionText = this._mainManager.animator.getRealActionName();
            this.drawText(actionText, 6, y, this.contentsWidth() - 12, "center");    

            if( $dataMap && $dataMap.meta && $dataMap.meta.inner){
                y += lineHeight;
                this.drawText("inside", 6, y, this.contentsWidth() - 12, "center");    
            }

            
            this._activityManager = this._mainManager.activity;
            if (!this._activityhManager){
                $debugTool.log("no activityManager", this._mainManager)
                return;
            }

            if(this._activityManager._currentActivity){
                const current = this._activityManager._currentActivity.constructor.name.replace("Activity", "");
                y += lineHeight;
                this.drawText(`${current}`, 6, y, this.contentsWidth() - 12, "center");    
            }
        }

        drawStat(name, value, y, width, color1, color2) {
            const rate = value / 100;
            const label = `${name} : ${Math.floor(value)}%`;
            
            this.drawGauge(4, y, width, rate, color1, color2);
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(name, 6, y, 80);
            this.changeTextColor(ColorManager.normalColor());
            this.drawText(`${Math.floor(value)}%`, 0, y, width - 4, "right");
        }

        // On réduit la taille de la police pour que tout rentre bien.
        makeFontSmaller() {
            if (this.contents.fontSize > 20) {
                this.contents.fontSize -= 4;
            }
        }
    }