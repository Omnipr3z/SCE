# SimCraft Engine - Gestionnaire d'Entrées Tactiles (TouchInput Manager)

![Version](https://img.shields.io/badge/Version-1.0.2-blue)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

Le module **Gestionnaire d'Entrées Tactiles** étend les capacités de la classe `TouchInput` de RPG Maker MZ pour offrir un contrôle plus fin et des fonctionnalités modernes, notamment pour les jeux destinés à être joués à la souris.

---

## ➤ Philosophie

Le `TouchInput` de base est fonctionnel mais limité. Il ne gère pas nativement le survol de la souris et son comportement pour le clic droit est codé en dur (il déclenche toujours une annulation). Ce module a pour but de rendre ces interactions plus flexibles et puissantes.

1.  **Interactivité** : Permettre de détecter le survol de la souris pour créer des interfaces plus riches (infobulles, effets de surbrillance).
2.  **Flexibilité** : Donner au développeur le contrôle sur le comportement du clic droit, pour qu'il ne soit plus systématiquement synonyme d'annulation.
3.  **API Complète** : Fournir un ensemble de méthodes claires (`isRightPressed`, `isRightTriggered`, `isHover`) pour gérer toutes les facettes des interactions à la souris.

---

## ➤ Fonctionnalités Clés

*   **Détection de Survol (`isHover`)** : Une nouvelle méthode `TouchInput.isHover(rect)` permet de savoir si le curseur de la souris se trouve au-dessus d'une zone rectangulaire, sans qu'un clic soit nécessaire.
*   **Gestion Avancée du Clic Droit** :
    *   `isRightPressed()`: Vérifie si le bouton droit est maintenu enfoncé.
    *   `isRightTriggered()`: Vérifie si le bouton droit vient d'être pressé.
    *   `isRightRepeated()`: Gère l'appui répété du bouton droit.
*   **Annulation Conditionnelle** : Le clic droit ne déclenche plus systématiquement une annulation. Son comportement est désormais contrôlé par la méthode `isCancelOnRightClick()`, qui peut être surchargée pour s'adapter au contexte du jeu.

---

## ➤ Guide d'Utilisation

Après avoir activé le plugin, la classe `TouchInput` globale est étendue avec les méthodes suivantes.

### Détecter le survol

Pour afficher une infobulle quand la souris passe sur un bouton, vous pouvez utiliser `isHover` dans la méthode `update` de votre scène ou fenêtre.

```javascript
const myButtonRect = new Rectangle(100, 100, 200, 50);

if (TouchInput.isHover(myButtonRect)) {
    // Afficher l'infobulle
} else {
    // Cacher l'infobulle
}
```

### Utiliser le clic droit

Vous pouvez désormais utiliser le clic droit pour des actions personnalisées, comme ouvrir un menu contextuel.

```javascript
if (TouchInput.isRightTriggered()) {
    // Ouvrir un menu contextuel à la position de la souris
}
```

### Activer l'annulation par clic droit

Par défaut, ce module désactive l'annulation par clic droit pour laisser la place à des actions personnalisées. Pour la réactiver (par exemple, uniquement dans les scènes de menu), vous pouvez surcharger la méthode `isCancelOnRightClick` dans un autre plugin.

```javascript
// Dans un autre plugin chargé après TouchInputManager
const _alias_TouchInput_isCancelOnRightClick = TouchInput.isCancelOnRightClick;
TouchInput.isCancelOnRightClick = function() {
    // Réactive le clic droit pour annuler uniquement dans les scènes de menu
    return SceneManager._scene instanceof Scene_MenuBase;
};
```