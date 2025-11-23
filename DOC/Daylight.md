# Daylight System

## Description

Le `Daylight System` gère la teinte de l'écran en fonction de l'heure de la journée. Il crée et contrôle l'objet global `$gameDaylight`, qui ajuste automatiquement la couleur de l'écran pour simuler le cycle jour/nuit (aube, journée, crépuscule, nuit).

## Rôle et Fonctionnalités Clés

### 1. Teinte Automatisée Basée sur le Temps

-   **Synchronisation avec `$gameDate`** : Le système récupère en continu l'heure actuelle depuis l'objet `$gameDate`.
-   **Cycle de Teintes** : Il se base sur un tableau de teintes défini dans le fichier `data/SC/DayLight.json`. Chaque entrée de ce tableau correspond à une heure de la journée et définit une couleur de teinte (Rouge, Vert, Bleu, Gris).
-   **Interpolation Douce** : Plutôt que de changer brusquement de couleur, le système calcule une teinte intermédiaire entre la teinte de l'heure actuelle et celle de l'heure suivante. Cela garantit des transitions douces et naturelles tout au long de la journée.

### 2. Forçage Manuel de la Teinte

-   **`force(r, g, b, gray, duration)`** : Il est possible de désactiver le cycle automatique pour imposer une teinte d'écran spécifique. C'est utile pour des intérieurs, des donjons sombres, ou des événements scriptés qui nécessitent une ambiance lumineuse particulière.
-   **`release(duration)`** : Met fin à la teinte forcée et réactive le cycle jour/nuit automatisé avec une transition douce.

### 3. Mises à Jour

-   Le système met à jour la teinte de l'écran (`$gameScreen.tint()`) à chaque image pour garantir une fluidité maximale des transitions de couleur.

## Méthodes Principales

-   **`update()`** : La méthode principale appelée à chaque image. Elle vérifie si une teinte est forcée ou si elle doit calculer la teinte automatique en fonction de l'heure.
-   **`force(r, g, b, gray, duration)`** : Démarre une transition vers une teinte manuelle.
-   **`release(duration)`** : Met fin à la teinte manuelle.

## Fichier de Données : `DayLight.json`

-   **Chemin** : `data/SC/DayLight.json`
-   **Rôle** : Définit le cycle des teintes sur une journée de 24 heures.
-   **Structure attendue** : Un tableau où chaque élément est un autre tableau représentant une teinte `[r, g, b, gray]` pour une heure spécifique. L'index du tableau principal correspond à l'heure (de 0 à 23).
    ```json
    [
        [ -102, -102, -68, 102 ], // 00:00 (Nuit)
        [ -102, -102, -68, 102 ], // 01:00
        // ...
        [ -17, -17, 0, 0 ],       // 05:00 (Aube)
        [ 0, 0, 0, 0 ],           // 06:00 (Jour)
        // ...
        [ -68, -68, 0, 0 ],       // 19:00 (Crépuscule)
        // ...
        [ -102, -102, -68, 102 ]  // 23:00
    ]
    ```

## Dépendances

-   `SC_GameDate` (`$gameDate`) : Indispensable pour connaître l'heure actuelle.
-   `$dataDaylight` (`DayLight.json`) : Pour les données de couleur du cycle journalier.
