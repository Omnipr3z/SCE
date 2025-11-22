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
 * @plugindesc !SC [v1.0.0] Formatteur de date pour Game_Date.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @base SC_Game_Date
 * @orderAfter SC_Game_Date
 * @help
 * Game_DateFormatter.js
 * 
 * Ce composant est une classe utilitaire statique qui fournit des méthodes
 * pour formater une instance de Game_Date en chaînes de caractères lisibles.
 * Il est principalement utilisé pour afficher la date de l'instance globale
 * `$gameDate`.
 */

class Game_DateFormatter {
    constructor() {
        throw new Error('This is a static class and cannot be instantiated.');
    }

    /**
     * Formatte la date au style "Warhammer 40K".
     * @param {Game_Date} gameDate L'instance de Game_Date à formater.
     * @returns {string}
     */
    static format40K(gameDate) {
        const dayOfYear = (gameDate.getMonth() - 1) * 31 + gameDate.getDayMonth();
        return `2.${dayOfYear}.${gameDate.getYear()}.M41 h:${gameDate.getHr().padZero(2)}m:${gameDate.getMin().padZero(2)}`;
    }

    /**
     * Génère une chaîne de caractères complète de la date.
     * @param {Game_Date} gameDate L'instance de Game_Date à formater.
     * @returns {string}
     */
    static getWording(gameDate) {
        const dayName = this.getDecadeDayName(gameDate);
        const dayOfMonth = gameDate.getDayMonth() + 1;
        const decadeNumber = gameDate.getDecadeIndex();
        const monthName = gameDate.getMonthName();
        const year = gameDate.getYear();
        const hours = String(gameDate.getHr()).padStart(2, '0');
        const minutes = String(gameDate.getMin()).padStart(2, '0');
        const template = this.getVocab().wordingTemplate;

        return template.format([dayName, dayOfMonth, decadeNumber, this.getPartDec(decadeNumber), monthName, year, hours, minutes]);
    }

    /**
     * Génère une chaîne de caractères pour l'heure (HH:MM).
     * @param {Game_Date} gameDate L'instance de Game_Date à formater.
     * @returns {string}
     */
    static getHrWording(gameDate) {
        const hours = String(gameDate.getHr()).padStart(2, '0');
        const minutes = String(gameDate.getMin()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    /**
     * Génère une chaîne de caractères courte pour l'ATH (HUD).
     * @param {Game_Date} gameDate L'instance de Game_Date à formater.
     * @returns {string}
     */
    static getHudWording(gameDate) {
        const dayName = this.getDecadeDayName(gameDate);
        const dayOfMonth = gameDate.getDayMonth() + 1;
        const monthName = gameDate.getMonthName();
        const year = gameDate.getYear();
        const template = this.getVocab().wordingShortTemplate;

        return template.format(dayName, dayOfMonth, monthName.toUpperCase(), this.getPartDec(dayOfMonth, true), year);
    }

    /**
     * Génère une chaîne de caractères courte pour la date et l'heure.
     * @param {Game_Date} gameDate L'instance de Game_Date à formater.
     * @returns {string}
     */
    static getShortDate(gameDate) {
        return `${gameDate.getDayMonth() + 1}/${gameDate.getMonth()}/${gameDate.getYear()} - ${String(gameDate.getHr()).padStart(2, '0')}:${String(gameDate.getMin()).padStart(2, '0')} - ${this.getPartOfDayName(gameDate).toUpperCase()}`;
    }

    /**
     * Compare deux dates et retourne une chaîne de caractères décrivant l'intervalle.
     * @param {Game_Date} gameDate La date de référence.
     * @param {Game_Date} otherDate L'autre date à comparer.
     * @returns {string}
     */
    static compareToDate(gameDate, otherDate) {
        if (!(otherDate instanceof Game_Date)) {
            throw new Error("Argument must be an instance of Game_Date.");
        }

        const diff = Math.abs(gameDate.timestamp - otherDate.timestamp);
        const isPast = gameDate.timestamp < otherDate.timestamp;

        const totalMinutesPerYear = $dataTimeSystem.months_per_year * $dataTimeSystem.days_per_month * $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;
        const totalMinutesPerMonth = $dataTimeSystem.days_per_month * $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;
        const totalMinutesPerDay = $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;

        const years = Math.floor(diff / totalMinutesPerYear);
        const months = Math.floor((diff % totalMinutesPerYear) / totalMinutesPerMonth);
        const days = Math.floor((diff % totalMinutesPerMonth) / totalMinutesPerDay);
        const hours = Math.floor((diff % totalMinutesPerDay) / $dataTimeSystem.minutes_per_hour);
        const minutes = diff % $dataTimeSystem.minutes_per_hour;

        const parts = [];
        if (years) parts.push(`${years} année(s)`);
        if (months) parts.push(`${months} mois`);
        if (days) parts.push(`${days} jour(s)`);
        if (hours) parts.push(`${hours} heure(s)`);
        if (minutes) parts.push(`${minutes} minute(s)`);

        return `${isPast ? "Il y a" : "Dans"} ${parts.join(", ")}`;
    }

    /**
     * [PRIVÉ] Retourne le suffixe ordinal pour un nombre (er, ème, etc.).
     * @param {number} number Le nombre.
     * @param {boolean} male Si le suffixe doit être au masculin.
     * @returns {string}
     */
    static getPartDec(number, male) {
        let partDec = number === 1 ? "ère" : "ème";
        if (male) {
            partDec = number === 1 ? "er" : "ème";
        }
        if ($dataSystem.locale === "en_EN") {
            switch (number) {
                case 1: partDec = "st"; break;
                case 2: partDec = "nd"; break;
                case 3: partDec = "rd"; break;
                default: partDec = "th"; break;
            }
        }
        return partDec;
    }

    /**
     * Retourne le nom de la partie de la journée (Aube, Matin, etc.).
     * @param {Game_Date} gameDate L'instance de Game_Date.
     * @returns {string}
     */
    static getPartOfDayName(gameDate) {
        return this.getVocab().dayParts[gameDate.getPartOfDayIndex()];
    }

    /**
     * Retourne le nom du jour de la décade.
     * @param {Game_Date} gameDate L'instance de Game_Date.
     * @returns {string}
     */
    static getDecadeDayName(gameDate){
        return $dataTimeSystem.days_of_decade[gameDate.getDay()];
    }

    /**
     * Retourne le nom de la saison actuelle.
     * @param {Game_Date} gameDate L'instance de Game_Date.
     * @returns {string}
     */
    static getSeasonName(gameDate) {
        const seasons = gameDate.isLocal() ? $dataTimeSystem.seasons_local : $dataTimeSystem.seasons_global;
        return seasons[gameDate.getSeasonIndex()];
    }

    /**
     * [PRIVÉ] Retourne l'objet de vocabulaire pour la locale actuelle.
     * @returns {object}
     */
    static getVocab(){
        return $dataTimeSystem[$dataSystem.locale];
    }
}

// --- Enregistrement du plugin ---
SC._temp = SC._temp || {};
SC._temp.pluginRegister = {
    name: "SC_GameDateFormatter",
    version: "1.0.0",
    icon: "✒️",
    author: AUTHOR,
    license: LICENCE,
    dependencies: [], // N'a pas de dépendance, est chargé en premier.
    loadDataFiles: [{filename:"TimeSystem", instName:"$dataTimeSystem"}],
    createObj: { autoCreate: false },
};
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);