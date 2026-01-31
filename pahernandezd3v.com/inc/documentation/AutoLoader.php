<?php // Converted from DOC/AutoLoader.md ?>
<h1>Engine Core & AutoLoader</h1>
<p>Ce module est le socle de l'architecture du SimCraft Engine pour RPG Maker MZ. Il transforme la manière dont les plugins sont gérés en introduisant une structure modulaire, déclarative et robuste.</p>

<h2>Philosophie</h2>
<ul>
    <li><strong>Modularité</strong> : Chaque fonctionnalité est un module indépendant.</li>
    <li><strong>Déclaration</strong> : Un module déclare ses besoins (dépendances, données, etc.).</li>
    <li><strong>Centralisation</strong> : La logique complexe (chargement, sauvegarde) est gérée par le <code>SystemLoader</code>.</li>
</ul>

<h2>Guide : Créer un Nouveau Module</h2>
<p>Pour créer un plugin compatible, vous devez déclarer ses métadonnées à la fin du fichier via <code>$simcraftLoader.checkPlugin(...)</code>. Cet objet de métadonnées inclut :</p>
<ul>
    <li><code>name</code>: L'identifiant unique du plugin.</li>
    <li><code>dependencies</code>: La liste des autres plugins requis.</li>
    <li><code>loadDataFiles</code>: Les fichiers de données JSON à charger.</li>
    <li><code>createObj</code>: Un objet global à instancier.</li>
    <li><code>autoSave</code>: Un booléen pour rendre l'objet persistant.</li>
</ul>
<p>Consultez la documentation complète pour des exemples détaillés sur la surcharge de classes et la gestion du contexte.</p>
