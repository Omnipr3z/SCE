# Idées et Stratégie pour un Launcher Externe

## Problématique

La configuration de la fenêtre du jeu (résolution, mode plein écran, suppression de la barre de titre) est difficile à gérer depuis les plugins RMMZ à cause de deux problèmes majeurs :
1.  Le fichier `package.json`, qui contrôle l'apparence initiale de la fenêtre, est écrasé par l'éditeur de RMMZ à chaque sauvegarde.
2.  Les tentatives de modification de la fenêtre par script au démarrage se heurtent à des problèmes de timing (le script s'exécute trop tard).

## Solution : Un Launcher Externe

L'approche la plus professionnelle et la plus robuste est de créer un **launcher externe**.

### Principe

1.  **Application Indépendante :** Le launcher est une petite application (par exemple, en NW.js, Electron, etc.) qui se lance avant le jeu.
2.  **Configuration :** Il présente à l'utilisateur des options (résolution, plein écran, etc.) et sauvegarde ces choix dans un fichier de configuration externe (ex: `user_config.json`).
3.  **Lancement du Jeu :** Une fois la configuration terminée, le launcher exécute le fichier `Game.exe` du jeu.
4.  **Lecture de la Config :** Au démarrage, le `GraphicsManager` du jeu lit le fichier `user_config.json`. S'il existe, il applique ses paramètres. Sinon, il utilise les paramètres par défaut du plugin `SC_GraphicsConfig`.

### Avantages

- **Contrôle Total :** Résout tous les problèmes de timing et de configuration de la fenêtre.
- **Professionnalisme :** Permet d'ajouter des fonctionnalités avancées (mises à jour, news, etc.).
- **Flexibilité :** Sépare la configuration de l'utilisateur de la configuration par défaut du développeur.