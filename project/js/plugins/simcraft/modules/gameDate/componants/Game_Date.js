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
 * @plugindesc !SC [v1.0.0] Gestion du temps, calendrier et datation (Game_Date)
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help Game_Date.js
 * 
 *   ███████     ██████    ███████
 *  ██          ██         ██     
 *   ██████     ██         █████  
 *        ██    ██         ██     
 *  ███████      ██████    ███████
 * 
 * Ce module fournit l'objet $gameCalendar qui gère le temps de jeu.
 * Il est basé sur un timestamp en minutes et contrôle le cycle jour/nuit,
 * les saisons, et la date complète selon un calendrier personnalisable.
 * 
 * Bien qu'étant un composant réutilisable, une instance principale `$gameDate`
 * est créée au démarrage pour représenter la ligne de temps globale du jeu.
 * 
 * ▸ Fonctions principales :
 *   - Gère un timestamp continu pour une chronologie précise.
 *   - Calcule la date et l'heure (minute, heure, jour, mois, année).
 *   - Gère les parties de la journée (aube, matin, nuit...).
 *   - Synchronise ses données avec les variables et interrupteurs du jeu.
 *   - Calendrier entièrement configurable via `TimeSystem.json`.
 *   - Sauvegarde et charge automatiquement sa progression.
 * 
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *   - SC_GameDateFormatter.js
 *   - varConfig.js
 *
 * ▸ Historique :
 *   v1.0.0 - 2024-08-01 : Refactorisation majeure, séparation du formateur.
 *   v0.2.2 - Ajout de la sauvegarde et du chargement.
 *   v0.2.1 - Version initiale.
 */
class Game_Date {
    constructor(timestamp = 55657647) { // Par défaut,  
        this.timestamp = $dataTimeSystem.start_timestamp || timestamp;
        this._tick = 0;
        this._tmpScroll = 0;
        this._scrollSpeedMode = 1;
        this.updateVars()
    }
    updateVars(){
        $gameVariables.setValue(TIME_SPEED_VAR,             this.getScrollSpeedMode());
        $gameVariables.setValue(TIME_TICK_VAR,              this._tick);
        $gameVariables.setValue(TIME_TIMESTAMP_VAR,         this.timestamp);
        $gameVariables.setValue(TIME_MIN_VAR,               this.getMin());
        $gameVariables.setValue(TIME_HOUR_VAR,              this.getHr());
        $gameVariables.setValue(TIME_DAYPART_INDEX_VAR,     this.getPartOfDayIndex());
        $gameVariables.setValue(TIME_DAYDECADE_INDEX_VAR,   this.getDay());
        $gameVariables.setValue(TIME_DAYMONTH_VAR,          this.getDayMonth());
        $gameVariables.setValue(TIME_DECADE_INDEX_VAR,      this.getDecadeIndex());
        $gameVariables.setValue(TIME_MONTH_INDEX_VAR,       this.getMonth());          
        $gameVariables.setValue(TIME_MONTH_NAME_VAR,        this.getMonthName());
        $gameVariables.setValue(TIME_SEASON_INDEX_VAR,      this.getSeasonIndex());
        $gameVariables.setValue(TIME_YEAR_VAR,              this.getYear());
        $gameVariables.setValue(TIME_TIMEZONE_VAR,          0);//TODO
        $gameSwitches.setValue(TIME_NIGHT_SW,               this.getPartOfDayIndex() == 0);
    }
    isStopped(){
        return this.getScrollSpeedMode() == 0;
    }
    passTick() {
        if(this._tmpScroll != this.getScrollSpeedMode()){
            $gameVariables.setValue(TIME_SPEED_VAR, this.getScrollSpeedMode());
            this._tmpScroll = this.getScrollSpeedMode();
        }
        if (this.getScrollSpeedMode() > 0) {
            this._tick++;
            $gameVariables.setValue(TIME_TICK_VAR, this._tick);
            if (this._tick >= this.getTickPerMin()) {
                this.passMin(1);
                this._tick = 0;
            }
        }

    }
    passMin(minutes = 1) {
        this.timestamp += minutes;
        this.updateVars();
    }
    passHr(hours = 1) {
        this.passMin(hours * $dataTimeSystem.minutes_per_hour);
        this.updateVars();
    }
    setScrollSpeedMode(value){
        this._scrollSpeedMode = value.clamp(0, 4);
        this.updateVars();
    }
    getScrollSpeedMode() {
        this._scrollSpeedMode = this._scrollSpeedMode.clamp(0, 4);
        return this._scrollSpeedMode;
    }
    getTickPerMin() {
        return $dataTimeSystem.tick_per_min[this.getScrollSpeedMode()];
    }
    getMin() {
        return this.timestamp % $dataTimeSystem.minutes_per_hour;
    }
    getHr() {
        return Math.floor((this.timestamp % ($dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour)) / $dataTimeSystem.minutes_per_hour);
    }
    getHrAmPm() {
        return this.getHr() % 12;
    }
    getDay() {
        return Math.floor(this.timestamp / this.getTotalMinPerDay()) % 10; // Jour dans la décade
    }
    getTotalMinPerDay(){
        return $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;
    }
    getDayMonth() {
        const totalMinutesPerDay = $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;
        return Math.floor(this.timestamp / totalMinutesPerDay) % $dataTimeSystem.days_per_month;
    }
    getMonth() {
        const totalMinutesPerMonth = $dataTimeSystem.days_per_month * $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;
        return (Math.floor(this.timestamp / totalMinutesPerMonth) % $dataTimeSystem.months_per_year) + 1;
    }
    getMonthName(){
        return $dataTimeSystem.months_of_year[this.getMonth() - 1]
    }
    getYear() {
        const totalMinutesPerYear = $dataTimeSystem.months_per_year * $dataTimeSystem.days_per_month * $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;
        return Math.floor(this.timestamp / totalMinutesPerYear);
    }
    getPartOfDayIndex() {
        const minutes = this.timestamp % ($dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour);
        if (minutes >= 360 && minutes < 480) return 1;
        if (minutes >= 480 && minutes < 660) return 2;
        if (minutes >= 660 && minutes < 780) return 3;
        if (minutes >= 780 && minutes < 1020) return 4;
        if (minutes >= 1020 && minutes < 1200) return 5;
        if (minutes >= 1200 && minutes < 1320) return 6;
        return 7;
    }
    getDecadeIndex(){
        return Math.ceil(this.getDayMonth() / 10);
    }
    isNightTime(){
        return this.getPartOfDayIndex() > 5
            || this.getPartOfDayIndex() < 2
    }
    isLocal(){
        return ($dataMap)?$dataMap.meta.localDate:false;
    }
    getSeasonIndex() {
        return Math.floor((this.getMonth() - 1) / 3);
    }

    compare(otherDate) {
        if (!(otherDate instanceof Game_Date)) {
            throw new Error("Argument must be an instance of Game_Date.");
        }
        return this.timestamp - otherDate.timestamp;
    }
    
    makeSavefileData(){
        return {
            timestamp: this.timestamp
        };
    }
    loadSavefileData(data){
        this.timestamp = data.timestamp;
        this.updateVars();
        
    }
}

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_Game_Date",
    icon                : "\u{23F3}",
    version             : "0.2.1",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader", "SC_GameDateFormatter", "SC_VarConfig"],
    loadDataFiles       : [], // La responsabilité du chargement est sur le Formatter.
    createObj           : {autoCreate  : true, classProto: Game_Date, instName: '$gameDate'},
    autoSave            : true
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);