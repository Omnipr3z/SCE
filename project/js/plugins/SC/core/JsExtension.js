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
 * @plugindesc !SC [v1.1.0] Extension des objets standards de JS
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help JsExtension.js
 *
 *   ███████     ██████    ███████
 *  ██          ██         ██     
 *   ██████     ██         █████  
 *        ██    ██         ██     
 *  ███████      ██████    ███████
 *
 * Plugin de base pour le moteur SimCraft.
 * Utilisé pour étendre les methodes des objets standard du javascript.
 *
 * ▸ Historique :
 *      v1.1.0 - Refactor using Object.defineProperty for non-enumerable methods.
 *      v1.0.0 - Base creation
 */
/*:en
 * @target MZ
 * @plugindesc !SC [v1.1.0] Some methods added to the standard Javascript objects.
 * @author By '0mnipr3z' ©2024 licensed under CC BY-NC-SA 4.0
 * @url https://github.com/Omnipr3z/INRAL
 * @help JsExtension.js
 *
 * Base Plugin for the SimCraft Engine.
 * Contains some methods that will be added to the standard Javascript objects.
 *
 * ▸ Releases :
 *      v1.1.0 - Refactor using Object.defineProperty for non-enumerable methods.
 *      v1.0.0 - Base Création
 */

function JsExtensions() {
    throw new Error('This is not a class');
}

// ============================================================================
// UTILITY FUNCTION FOR DEFINING NON-ENUMERABLE PROPERTIES
// ============================================================================

function defineNonEnumerable(proto, name, value) {
    Object.defineProperty(proto, name, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false
    });
}

// ====================
// STRING
// ====================

defineNonEnumerable(String.prototype, 'removeAccents', function() {
    return this
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
});

defineNonEnumerable(String.prototype, 'firstToUpper', function() {
    if (this.length === 0) return this;
    return this.charAt(0).toUpperCase() + this.slice(1);
});

defineNonEnumerable(String.prototype, 'camelToSnake', function() {
    let res = this.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (res.startsWith('_')) res = res.slice(1);
    res = res.replace(/s_c/g, "SimCraft"); //Specifique a Simcraft
    res = res.replace( /G_U_I/g, "GUI"); //Specifique a Simcraft
    return res;
});

defineNonEnumerable(String.prototype, 'format', function() {
    const args = arguments;
    return this.replace(/%([0-9]+)/g, function(s, n) {
        const index = Number(n) - 1;
        if (Array.isArray(args[0])) {
            return args[0][index];
        } else {
            return args[index];
        }
    });
});

defineNonEnumerable(String.prototype, 'contains', function(string) {
    return this.includes(string);
});

defineNonEnumerable(String.prototype, 'padZero', function(length) {
    return this.padStart(length, "0");
});


// ====================
// MATH
// ====================

Math.alea = function(range = 1, negative = false) {
    let val = Math.round(Math.random() * range);
    let dir = Math.round(Math.random());
    if(negative && dir !=0) return -val;
    return val;
};

Math.randomInt = function(max) {
    return Math.floor(max * Math.random());
};


// ====================
// ARRAY
// ====================

defineNonEnumerable(Array.prototype, 'clone', function() {
    return this.slice(0);
});

defineNonEnumerable(Array.prototype, 'randomElem', function() {
    return this[Math.floor(Math.random() * this.length)];
});

// Refactored for better performance (avoids creating a new array)
defineNonEnumerable(Array.prototype, 'reverseForEach', function(callback, thisArg) {
    for (let i = this.length - 1; i >= 0; i--) {
        callback.call(thisArg, this[i], i, this);
    }
});

defineNonEnumerable(Array.prototype, 'contains', function(element) {
    return this.includes(element);
});

defineNonEnumerable(Array.prototype, 'equals', function(array) {
    if (!array || this.length !== array.length) {
        return false;
    }
    for (let i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i])) {
                return false;
            }
        } else if (this[i] !== array[i]) {
            return false;
        }
    }
    return true;
});

defineNonEnumerable(Array.prototype, 'remove', function(element) {
    for (;;) {
        const index = this.indexOf(element);
        if (index >= 0) {
            this.splice(index, 1);
        } else {
            return this;
        }
    }
});


// ====================
// NUMBER
// ====================

defineNonEnumerable(Number.prototype, 'clamp', function(min, max) {
    return Math.min(Math.max(this, min), max);
});

defineNonEnumerable(Number.prototype, 'mod', function(n) {
    return ((this % n) + n) % n;
});

defineNonEnumerable(Number.prototype, 'padZero', function(length) {
    return String(this).padZero(length);
});

defineNonEnumerable(Number.prototype, 'approach', function(target, step) {
    let res = this;
    if(!step || step == 0) step = 1;
    if(target > this){
        res = Math.min(res + step, target);
    } else {
        res = Math.max(res - step, target);
    }
    return res;
});
