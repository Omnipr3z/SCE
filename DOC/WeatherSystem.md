# Weather System

## Description

Le `Weather System` est un module qui gère la simulation météorologique dans le jeu. Il crée et contrôle l'objet global `$gameWeather`, qui peut fonctionner de manière automatisée ou être contrôlé manuellement par des commandes.

Ce système est capable de simuler des changements météorologiques naturels en fonction de la saison et du climat de la région, tout en permettant aux développeurs de forcer une météo spécifique pour des besoins scénaristiques.

## Rôle et Fonctionnalités Clés

### 1. Météo Automatisée

-   **Logique Périodique** : Pour des raisons de performance, la logique météo n'est pas calculée à chaque image, mais à intervalles réguliers basés sur le temps en jeu (via `$gameDate`).
-   **Basée sur le Climat et la Saison** : Le système détermine la météo actuelle en se basant sur :
    -   Le **climat** de la carte (ex: "tempéré", "désertique"). Cette information sera à terme lue depuis les métadonnées de la carte.
    -   La **saison** actuelle (ex: "printemps", "hiver"), obtenue via `$gameDate`.
-   **Probabilités** : Les transitions météorologiques sont choisies aléatoirement à partir d'une liste de possibilités pondérées, définies dans `data/SC/Weather.json`.

### 2. Forçage Manuel de la Météo

-   Il est possible de désactiver la météo automatique pour imposer des conditions spécifiques.
-   Ceci est utile pour les cinématiques ou les événements scriptés.
-   Le retour à la normale se fait en "relâchant" la météo forcée, ce qui réactive le système automatique.

### 3. Gestion des Visuels

-   **Superposition (Overlay)** : Le système peut afficher une image de superposition (par exemple, un filtre de pluie) dont le nom est défini dans la configuration de chaque type de météo. Les propriétés de défilement (`scrollX`, `scrollY`) sont également gérées.
-   **Météo Native RMMZ** : Le système peut également déclencher les effets météorologiques natifs de RPG Maker (pluie, tempête, neige) en parallèle de ses propres effets de superposition.

## Commandes de Plugin

-   **`ForceWeather type intensity duration`**
    -   **Description** : Force une météo spécifique.
    -   **`type`** : Le nom du type de météo (ex: `rain`, `cloudy`), tel que défini dans la configuration.
    -   **`intensity`** : L'opacité de l'effet de superposition (0-255).
    -   **`duration`** : La durée de la transition en images (frames).
    -   **Exemple** : `ForceWeather rain 200 120`

-   **`ReleaseWeather duration`**
    -   **Description** : Met fin à la météo forcée et retourne au système automatisé.
    -   **`duration`** : La durée de la transition pour revenir à la météo normale.
    -   **Exemple** : `ReleaseWeather 300`

## Fichier de Données : `Weather.json`

-   **Chemin** : `data/SC/Weather.json`
-   **Rôle** : Contient toutes les probabilités de météo, organisées par climat et par saison.
-   **Structure attendue** :
    ```json
    {
        "climates": {
            "temperate": {
                "spring": [
                    { "type": "clear", "weight": 70 },
                    { "type": "cloudy", "weight": 20 },
                    { "type": "rain", "weight": 10 }
                ],
                "summer": [ /* ... */ ]
            },
            "desert": { /* ... */ }
        }
    }
    ```

## Dépendances

-   `SC_GameDate` (`$gameDate`) : Pour obtenir la saison et le temps de jeu.
-   `SC_WeatherConfig` : Pour charger les définitions de chaque type de météo.
-   `$dataWeather` (`Weather.json`) : Pour les données de probabilités.
