/*:
 * @plugindesc v1.0.0 - Manages flora growth and interaction.
 * @author SimCrafters
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin introduces a flora system, allowing plants to grow on maps
 * based on various factors like weather and temperature.
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * This plugin does not provide any plugin commands.
 *
 */

/*~struct~PlantSpecies:
 * @param id
 * @type number
 * @param name
 * @type string
 * @param growthStages
 * @type number
 * @param growthRate
 * @type number
 * @param idealTemperature
 * @type number
 * @param idealWeather
 * @type string
 * @param harvest
 * @type struct<Harvest>
 */

/*~struct~Harvest:
 * @param itemId
 * @type item
 * @param quantity
 * @type number
 */

var Imported = Imported || {};
Imported.SC_Flora = true;

var SimCrafters = SimCrafters || {};
SimCrafters.Flora = SimCrafters.Flora || {};

(function($) {
    "use strict";

    // We will add other classes and managers here.

})(SimCrafters.Flora);