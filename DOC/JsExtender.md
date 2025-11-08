JsExtender.js : Extensions des Objets JavaScript Standards
Le fichier JsExtender.js est un composant fondamental du SimCraft Engine, partie intégrante du projet INRAL, spécifiquement conçu pour RPG Maker MZ. Ce module enrichit les prototypes des objets JavaScript natifs (String, Number, Array, Math) avec des méthodes utilitaires additionnelles.

En étendant directement ces prototypes, JsExtender.js favorise une écriture de code plus fluide, lisible et idiomatique. Plutôt que d'utiliser des fonctions externes nécessitant des arguments explicites (ex: maFonction(maVariable)), vous pouvez appeler ces nouvelles méthodes directement sur les instances des objets (ex: maVariable.maNouvelleMethode()).

Fonctionnalités Clés et Extensions
Extensions de String.prototype
Ces méthodes facilitent la manipulation et le formatage des chaînes de caractères.

**removeAccents()** : Supprime les accents et les signes diacritiques d'une chaîne, utile pour la normalisation de texte et les comparaisons insensibles aux accents.

**firstToUpper()** : Convertit la première lettre de la chaîne en majuscule.

**camelToSnake()** : Transforme une chaîne de format camelCase en snake_case. Inclut des règles spécifiques pour les acronymes "SimCraft" et "GUI" afin de maintenir leur capitalisation appropriée.

**format(...args)** : Remplace les placeholders %1, %2, etc., par les arguments fournis. Cette méthode est très puissante pour l'interpolation de chaînes dynamiques.

**contains(string)** : Vérifie si la chaîne contient une sous-chaîne donnée. Note : Cette méthode est dépréciée au profit de String.prototype.includes() pour la conformité aux standards JavaScript.

**padZero(length)** : Prépare la chaîne avec des zéros en tête pour atteindre une longueur spécifiée (par exemple, pour afficher des nombres formattés comme "007").

Extensions de Math
Ces utilitaires améliorent les capacités de génération de nombres aléatoires.

**Math.alea(range = 1, negative = false)** : Génère un entier aléatoire dans une plage définie, avec une option pour inclure des valeurs négatives.

**Math.randomInt(max)** : Retourne un entier aléatoire entre 0 (inclus) et max (exclus).

Extensions de Array.prototype
Ces méthodes optimisent la manipulation et l'interrogation des tableaux.

**clone()** : Crée une copie superficielle du tableau.

**randomElem()** : Renvoie un élément aléatoire du tableau, pratique pour les logiques de jeu variées.

**reverseForEach(callback, thisArg)** : Exécute une fonction de rappel pour chaque élément du tableau, en commençant par le dernier et en remontant jusqu'au premier. Utile pour les opérations nécessitant un ordre inversé.

**contains(element)** : Vérifie si le tableau contient un élément donné. Note : Cette méthode est dépréciée au profit de Array.prototype.includes().

**equals(array)** : Compare le contenu de deux tableaux pour vérifier s'ils sont identiques en termes d'éléments et d'ordre.

**remove(element)** : Supprime toutes les occurrences d'un élément spécifique du tableau (modification en place).

Note : Les méthodes clone, contains, equals et remove des prototypes d'Array sont définies comme non-énumérables via Object.defineProperty, évitant ainsi leur apparition lors d'itérations non intentionnelles (ex: for...in).

Extensions de Number.prototype
Ces ajouts simplifient les opérations numériques courantes dans le contexte du jeu.

**clamp(min, max)** : Limite la valeur numérique à une plage spécifiée (min et max). Essentiel pour gérer les bornes de statistiques, de positions, etc.

**mod(n)** : Renvoie le résultat du modulo, garantissant toujours une valeur positive, même pour les nombres négatifs.

**padZero(length)** : Convertit le nombre en chaîne de caractères et le formate avec des zéros en tête, en utilisant la méthode String.prototype.padZero().

**approach(target, step)** : Déplace progressivement le nombre vers une valeur cible, par incréments définis par step, sans jamais la dépasser. Idéal pour des transitions douces, des animations ou des ajustements de valeurs dans le temps.

Avantages pour le Développement
L'intégration de JsExtender.js au SimCraft Engine offre plusieurs avantages :

Réduction de la verbosité : Le code est plus concis et expressif.

Cohérence : Centralise les utilitaires communs, promouvant des pratiques de codage uniformes.

Efficacité : Les méthodes sont directement accessibles sur les objets, optimisant la logique de jeu et l'interaction avec l'interface utilisateur dans RPG Maker MZ.

En somme, ce fichier établit une base solide de fonctionnalités utilitaires, essentielles pour un développement efficace et maintenable au sein du projet INRAL.