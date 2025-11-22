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
 * @plugindesc !SC [v1.0.0] Gestion de la luminosité ambiante (Game_DayLight)
 * @author By '0mnipr3z' ©2025 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help Game_DayLight.js
 * 
 *   ██████╗  █████╗ ██╗   ██╗  ██╗     ██╗ ██████╗ ██╗  ██╗
 *  ██╔═══██╗██╔══██╗╚██╗ ██╔╝  ██║     ██║██╔════╝ ██║  ██║
 *  ██║   ██║███████║ ╚████╔╝   ██║     ██║██║  ███╗███████║
 *  ██║   ██║██╔══██║  ╚██╔╝    ██║     ██║██║   ██║██╔══██║
 *  ╚██████╔╝██║  ██║   ██║     ███████╗██║╚██████╔╝██║  ██║
 *   ╚═════╝ ╚═╝  ╚═╝   ╚═╝     ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═╝
 * 
 * Ce module fournit l'objet $gameDayLight qui gère la teinte de l'écran
 * en fonction de l'heure du jour fournie par $gameDate.
 * 
 * Le système est actif uniquement sur les cartes possédant un notetag spécifique
 * dans leurs métadonnées : <light:type>
 * 
 * 'type' peut être un mot-clé (ex: 'outside', 'inside') ou une couleur
 * hexadécimale (ex: '#9165ba').
 * 
 * ▸ Fonctions principales :
 *   - S'active au chargement d'une carte avec le notetag <light:type>.
 *   - Observe $gameDate pour les changements d'heure.
 *   - Calcule et applique une teinte d'écran interpolée en continu.
 *   - Les teintes sont définies dans `data/SC/DayLight.json`.
 * 
 * ▸ Nécessite :
 *   - SC_SystemLoader.js
 *   - Game_Date.js
 *
 * ▸ Historique :
 *   v1.0.0 - 2025-11-22 : Version initiale.
 */

class Game_DayLight {
    constructor() {
        this._active = false;
        this._type = null;
        this._lastHour = -1;
        this._currentTone = [0, 0, 0, 0];
        this._periodTones = [];
        this._periodTimes = [
            { period: "dawn",     hour: 6  },
            { period: "morning",  hour: 8  },
            { period: "day",      hour: 11 },
            { period: "dusk",     hour: 17 },
            { period: "twilight", hour: 20 },
            { period: "night",    hour: 22 }
        ];
    }

    // Called from Scene_Map.prototype.onMapLoaded
    initializeForMap() {
        if(!$dataMap.meta) {
            DataManager.extractMetadata($dataMap);
        }
        const lightTag = $dataMap.meta.light;
        if (lightTag) {
            this._active = true;
            this._type = lightTag;
            this._lastHour = -1; // Force update on first frame
            if (this._type.startsWith('#')) {
                this._periodTones = null; // Direct color
            } else {
                this.loadPeriodTones();
            }
            this.update(true); // Initial update
        } else {
            this._active = false;
            $gameScreen.startTint([0, 0, 0, 0], 30);
        }
    }

    loadPeriodTones() {
        if ($dataDayLight && $dataDayLight.tones[this._type]) {
            this._periodTones = $dataDayLight.tones[this._type];
        } else {
            this._active = false;
            console.warn(`SimCraft Engine: Daylight type "${this._type}" not found in DayLight.json.`);
        }
    }

    update(force = false) {
        if (!this._active || !$gameDate) {
            return;
        }

        const currentHour = $gameDate.getHr();
        if (currentHour !== this._lastHour || force) {
            this._lastHour = currentHour;
            
            if (this._type.startsWith('#')) {
                const tone = ColorManager.hexToTone(this._type);
                this._currentTone = tone;
            } else {
                this.calculateTone();
            }
            $gameScreen.startTint(this._currentTone, 60);
        }
    }

    calculateTone() {
        if (!this._periodTones || this._periodTones.length === 0) {
            return;
        }

        const nowInMinutes = $gameDate.getHr() * 60 + $gameDate.getMin();

        // Find current and next periods
        let currentPeriodIndex = -1;
        for (let i = this._periodTimes.length - 1; i >= 0; i--) {
            if (nowInMinutes >= this._periodTimes[i].hour * 60) {
                currentPeriodIndex = i;
                break;
            }
        }
        // If before the first period (e.g., before 6am), it's the last period of the previous day (night)
        if (currentPeriodIndex === -1) {
            currentPeriodIndex = this._periodTimes.length - 1;
        }

        const nextPeriodIndex = (currentPeriodIndex + 1) % this._periodTimes.length;

        const currentPeriodInfo = this._periodTimes[currentPeriodIndex];
        const nextPeriodInfo = this._periodTimes[nextPeriodIndex];

        const currentToneData = this._periodTones.find(t => t.period === currentPeriodInfo.period);
        const nextToneData = this._periodTones.find(t => t.period === nextPeriodInfo.period);

        if (!currentToneData || !nextToneData) return;

        const currentTone = currentToneData.tone;
        const nextTone = nextToneData.tone;

        let periodStartMinutes = currentPeriodInfo.hour * 60;
        let periodEndMinutes = nextPeriodInfo.hour * 60;

        // Handle wrap-around for night -> dawn
        if (periodEndMinutes < periodStartMinutes) {
            periodEndMinutes += 24 * 60;
            // Adjust nowInMinutes if it's in the early morning part of the wrapped period
            const adjustedNow = (nowInMinutes < periodStartMinutes) ? nowInMinutes + 24 * 60 : nowInMinutes;
            const duration = periodEndMinutes - periodStartMinutes;
            const progress = (adjustedNow - periodStartMinutes) / duration;
            this.interpolateTone(currentTone, nextTone, progress);

        } else {
            const duration = periodEndMinutes - periodStartMinutes;
            if (duration === 0) {
                this._currentTone = currentTone;
                return;
            }
            const progress = (nowInMinutes - periodStartMinutes) / duration;
            this.interpolateTone(currentTone, nextTone, progress);
        }
    }

    interpolateTone(tone1, tone2, progress) {
        progress = Math.max(0, Math.min(1, progress)); // Clamp progress
        const r = tone1[0] + (tone2[0] - tone1[0]) * progress;
        const g = tone1[1] + (tone2[1] - tone1[1]) * progress;
        const b = tone1[2] + (tone2[2] - tone1[2]) * progress;
        const gray = tone1[3] + (tone2[3] - tone1[3]) * progress;
        this._currentTone = [r, g, b, gray].map(Math.round);
    }
}


SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_Game_DayLight",
    icon                : "\u{1F316}",
    version             : "1.0.0",
    author              : "0mnipr3z",
    license             : "CC BY-NC-SA 4.0",
    dependencies        : ["SC_SystemLoader", "SC_Game_Date"],
    loadDataFiles       : [{filename:"DayLight", instName:"$dataDayLight"}],
    createObj           : {autoCreate  : true, classProto: Game_DayLight, instName: '$gameDayLight'},
    autoSave            : false // State is derived from map and time
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);
