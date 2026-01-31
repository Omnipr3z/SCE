<?php // Converted from DOC/CharacterAction.md ?>
<h1>Character Action System</h1>
<p>Le système d'Actions est une surcouche qui permet de déclencher de manière <strong>impérative</strong> des séquences d'animation spécifiques sur un personnage (ex: "activer un levier", "miner"), indépendamment de son état.</p>

<h2>Philosophie</h2>
<ul>
    <li><strong>Contrôle Explicite</strong> : Les actions sont déclenchées par une commande de script.</li>
    <li><strong>Configuration Data-Driven</strong> : Les actions sont définies dans un fichier de configuration, pas en dur dans le code.</li>
    <li><strong>Gestion d'État Prioritaire</strong> : Une action en cours a la priorité sur les animations de base (marche, etc.).</li>
</ul>

<h2>Guide d'Utilisation</h2>
<h3>Étape 1 : Configurer les Actions</h3>
<p>Dans le plugin `SC_CharacterActionConfig`, ajoutez des entrées et définissez leur nom, spritesheet, séquence de frames, vitesse, etc.</p>

<h3>Étape 2 : Déclencher une Action</h3>
<p>Utilisez une commande de script pour appeler la méthode sur un personnage :</p>
<pre><code>$gamePlayer.playAction('votre_action');</code></pre>

<h3>Étape 3 : Vérifier si une action est en cours</h3>
<p>Cette méthode est utile dans les branches conditionnelles :</p>
<pre><code>$gamePlayer.isActionPlaying()</code></pre>
