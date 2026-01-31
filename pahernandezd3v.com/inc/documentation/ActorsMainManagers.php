<?php // Converted from DOC/ActorsMainManagers.md ?>
<h1>ActorsMainManagers</h1>

<h2>Description</h2>
<p>Le <code>ActorsMainManagers</code> est un gestionnaire global qui sert de conteneur pour toutes les instances de <code>ActorMainManager</code>. Il fournit un point d'accès centralisé pour récupérer le "hub" de n'importe quel acteur via son ID de base de données.</p>
<p>Ce module est automatiquement instancié au démarrage du jeu en tant que variable globale <code>$actorsMainManagers</code>.</p>

<h2>Rôle</h2>
<p>L'objectif principal de ce gestionnaire est d'offrir une méthode simple et unifiée pour accéder aux données et aux gestionnaires spécifiques d'un acteur (comme sa feuille de personnage, ses actions, son visuel, etc.) à partir de n'importe où dans le code.</p>

<h2>Méthodes principales</h2>
<h3><code>actor(actorId)</code></h3>
<ul>
    <li><strong>Description :</strong> Récupère ou crée à la demande le <code>ActorMainManager</code> pour un acteur donné.</li>
    <li><strong>Paramètres :</strong> `actorId` (Number) - L'ID de l'acteur.</li>
    <li><strong>Retourne :</strong> (<code>ActorMainManager</code> | <code>null</code>) - L'instance du gestionnaire pour cet acteur.</li>
</ul>

<h2>Exemple d'utilisation</h2>
<pre><code class="language-javascript">// Récupérer le gestionnaire principal pour l'acteur avec l'ID 1
const actor1Manager = $actorsMainManagers.actor(1);

if (actor1Manager) {
    // Accéder à une propriété ou un sous-gestionnaire
    const characterSheet = actor1Manager.characterSheet();
    console.log(characterSheet.name());
}
</code></pre>
