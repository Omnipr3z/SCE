# ActorsMainManagers

## Description

Le `ActorsMainManagers` est un gestionnaire global qui sert de conteneur pour toutes les instances de `ActorMainManager`. Il fournit un point d'accès centralisé pour récupérer le "hub" de n'importe quel acteur via son ID de base de données.

Ce module est automatiquement instancié au démarrage du jeu en tant que variable globale `$actorsMainManagers`.

## Rôle

L'objectif principal de ce gestionnaire est d'offrir une méthode simple et unifiée pour accéder aux données et aux gestionnaires spécifiques d'un acteur (comme sa feuille de personnage, ses actions, son visuel, etc.) à partir de n'importe où dans le code.

Au lieu de recréer ou de rechercher une instance de `ActorMainManager` à chaque fois, on peut simplement appeler `$actorsMainManagers.actor(actorId)` pour l'obtenir. Le gestionnaire crée l'instance à la volée si elle n'existe pas et la conserve en cache pour les appels futurs.

## Méthodes principales

### `actor(actorId)`

-   **Description :** Récupère ou crée à la demande le `ActorMainManager` pour un acteur donné.
-   **Paramètres :**
    -   `actorId` (Number) : L'ID de l'acteur tel que défini dans la base de données.
-   **Retourne :** (`ActorMainManager` | `null`) - L'instance du gestionnaire pour cet acteur, ou `null` si l'ID de l'acteur n'est pas valide.

## Exemple d'utilisation

```javascript
// Récupérer le gestionnaire principal pour l'acteur avec l'ID 1
const actor1Manager = $actorsMainManagers.actor(1);

if (actor1Manager) {
    // Accéder à une propriété ou un sous-gestionnaire
    const characterSheet = actor1Manager.characterSheet();
    console.log(characterSheet.name());
}
```

## Dépendances

-   `SC_SystemLoader` : Pour l'enregistrement et le chargement du plugin.
-   `ActorMainManager` : La classe que ce gestionnaire instancie et gère.
