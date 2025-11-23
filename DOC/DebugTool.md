# DebugTool

## Description

`DebugTool` est une classe utilitaire conçue pour faciliter le débogage du SimCraft Engine directement en jeu. Elle fournit une console visuelle affichant les logs, les avertissements et les erreurs, ainsi qu'une série de méthodes pour standardiser les messages de débogage à travers les différents modules du moteur.

Ce module est automatiquement instancié au démarrage du jeu en tant que variable globale `$debugTool`.

## Rôle et Fonctionnalités Clés

### 1. Console de Débogage Visuelle

-   **Affichage en jeu** : Le `DebugTool` peut afficher une console directement sur l'écran de jeu.
-   **Activation/Désactivation** : La visibilité de la console est contrôlée par le paramètre `show` dans le fichier de configuration `scConfig.js`. Mettre `scConfig.debug.show` à `true` pour l'afficher.
-   **Contenu** : La console affiche les messages loggés via les méthodes du `$debugTool` (`log`, `warn`, `error`).
-   **Intégration aux Scènes** : Elle s'intègre automatiquement aux scènes principales du jeu pour être visible partout où c'est nécessaire.

### 2. Système de Log Standardisé

-   **`log(message, small = false)`** : Affiche un message standard dans la console. Si `small` est `true`, la police est plus petite.
-   **`warn(message)`** : Affiche un message d'avertissement, généralement avec une couleur distinctive (jaune).
-   **`error(message, errorData = null)`** : Affiche un message d'erreur (en rouge) et peut inclure des données supplémentaires sur l'erreur.

### 3. Messages de Moteur Formatés

Le `DebugTool` inclut de nombreuses méthodes pré-formatées pour logger les événements importants du SimCraft Engine, ce qui aide à maintenir une cohérence et une lisibilité lors du débogage. Exemples :

-   `drawPluginRegistered(plugin)` : Affiche un message formaté lorsqu'un plugin a été enregistré avec succès par le `SC_SystemLoader`.
-   `drawDatafileLoaded(filename, src)` : Indique qu'un fichier de données JSON a été chargé.
-   `drawPluginSavefileSaved(plugin)` / `drawPluginSavefileLoaded(plugin)` : Confirme que les données d'un plugin ont été ajoutées à la sauvegarde ou chargées depuis celle-ci.
-   Et beaucoup d'autres concernant les erreurs de chargement, les surcharges de classes, la création d'objets, etc.

## Utilisation

Le `$debugTool` est pensé pour être utilisé par les développeurs du moteur ou de plugins additionnels.

**Pour l'activer :**
1.  Ouvrez le fichier `project/js/plugins/simcraft/core/configs/scConfig.js`.
2.  Assurez-vous que la propriété `debug: { show: true }` est définie.

**Exemple d'appel dans un autre plugin :**

```javascript
// Loguer une information simple
$debugTool.log("Le personnage a atteint le point de passage A.");

// Envoyer un avertissement
if (player.hp < 10) {
    $debugTool.warn(`La vie du joueur est dangereusement basse : ${player.hp}`);
}

// Reporter une erreur
try {
    // ... code qui pourrait échouer
} catch (e) {
    $debugTool.error("Une erreur est survenue lors de l'action XYZ.", e);
}
```

## Dépendances
- `scConfig.js`: Pour la configuration de l'affichage de la console.
