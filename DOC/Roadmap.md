# Roadmap du SimCraft Engine

## Tâches Prioritaires

1.  **[ ] Révision des Ressources et Licences**
    -   **[ ]** Remplacer les sprites basés sur "hine" par un nouveau pack basé sur "LCP Universal" (licence MIT).
    -   **[ ]** Remplacer les ressources de la cinématique d'exemple (inspirées de 40k) par un contenu plus générique.
    -   **[ ]** Créer une scène de crédits dynamique qui récupère les données du `SystemLoader` et d'un fichier de configuration pour les contributeurs.
    -   **[ ]** Mettre à jour le `README.md` en conséquence.

2.  **[ ] Amélioration du Système d'Animation**
    -   **[X]** **Séquenceur d'actions :** Ajouter une file d'attente (`_animQueue`) pour enchaîner dynamiquement plusieurs animations. Créer une méthode et une configuration pour définir et lancer des séquences complètes.
    -   **[ ]** **Intégration aux "Move Routes" :** Ajouter un paramètre `waitEnd` à la commande `this.anim('nom', waitEnd)`. Si `true`, le système calculera automatiquement la durée de l'animation et mettra en pause l'interpréteur de l'événement, évitant d'avoir à ajouter des commandes "Attendre" manuelles.

3.  **[ ] Évolution du `VisualCharacter` (Paper-Doll)**
    -   **[X]** **Couches pour le visage/cheveux :** Intégrer un système de couches pour le visage (`face`) et les cheveux (`hair`) sur le sprite du personnage.
    -   **[ ]** **Masquage dynamique :** Permettre à un équipement (casque, chapeau) de masquer certaines couches (ex: les cheveux) via un notetag pour éviter les superpositions disgracieuses.
    -   **[ ]** **Adaptation aux Facesets :** Étendre le système de Paper-Doll pour qu'il s'applique également aux `facesets` dans les dialogues, en utilisant `Bitmap_Composite`.

## Améliorations et Nouveaux Systèmes

4.  **[ ] Création d'un `ActorMainManager`**
    -   **[X]** Développer un "hub" central pour lier `actorId` -> `Game_Event` -> `Sprite_Character`.
    -   **[ ]** Intégrer l'accès au `Game_Actor` et aux managers de composants (Anim, Health...).
    -   **[ ]** **Refactorisation :** Modifier les composants existants (`ActorHealthManager`, etc.) pour qu'ils utilisent `ActorMainManager` afin de récupérer les informations sur les personnages et autres managers, supprimant ainsi les accès directs et le couplage fort.
    -   Ce manager servira à orchestrer des actions complexes qui affectent plusieurs aspects d'un acteur simultanément.

5.  **[ ] Création d'un `ActorHealthManager` (Système de survie)**
    -   **[X]** Créer la classe `ActorHealthManager` et son conteneur `$actorHealthManagers`.
    -   **[X]** Implémenter le système de souffle (`breath`) pour le joueur.
    -   **[ ]** Implémenter la logique de dégradation des stats (`updateMin`, `updateHr`).
    -   **[ ]** Implémenter les actions de base (manger, boire, dormir).

6.  **[ ] Amélioration du `CharacterShadow`**
    -   **[X]** Ajouter un paramètre de plugin `offsetY` pour permettre un réglage fin de la position verticale de l'ombre.

## Tâches Techniques et de Fond

7.  **[ ] Optimisation du Chargement des Bitmaps**
    -   Rechercher et implémenter une solution pour fiabiliser le chargement des images et éviter les problèmes de "pop-in" ou d'images non chargées, notamment sur les configurations moins puissantes ou lors de la perte de focus de la fenêtre.
    -   Pistes : Surcharger `ImageManager` avec un système de `Promise` ou d'`EventListener` pour mieux suivre l'état du chargement.

8.  **[ ] Finalisation de la Gestion de la Résolution**
    -   Gérer la différence entre la taille de la "box" de l'interface et la taille réelle de l'écran, un comportement spécifique à RMMZ.
    -   Mettre en place la stratégie pour le mode "fenêtre sans bordures" en production (via `package.json`), en documentant clairement que cela ne fonctionne pas lors des tests depuis l'éditeur.

# Idea
-   Gestion de l'image du curseur
-   systeme de popup Mouse Hover

## Révisions Architecturales et Standards

9.  **[ ] Standardisation de l'Architecture et du Nommage**
    -   **[ ]** **Implémentation des Espaces de Noms (Namespacing) :** Refactoriser le code pour utiliser un espace de noms global unique (ex: `SC` ou `SimCraft`) au lieu d'exposer les classes directement sur l'objet `window`. Cela améliorera l'organisation, la lisibilité et préviendra les conflits potentiels.
    -   **[ ]** **Révision des Standards de Nommage :** Définir et appliquer des conventions de nommage cohérentes pour les classes, les fichiers, les variables et les fonctions à travers tout le moteur pour assurer une meilleure lisibilité et maintenabilité.