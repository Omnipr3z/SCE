# Système de Temps ($gameDate)

## 1. Introduction

L'objet global `$gameDate` est le cœur du système temporel du SimCraft Engine. Il est responsable de la gestion du calendrier, de l'heure, des jours, des saisons et fournit un "timestamp" unique qui sert de métronome pour de nombreux autres systèmes (comme le `ActorHealthManager`).

Il est conçu pour être mis à jour à intervalles réguliers et pour fournir une interface simple pour accéder aux informations temporelles.

## 2. Propriétés Principales

L'objet `$gameDate` contient plusieurs propriétés pour représenter le temps :

*   `_timestamp` : Un compteur numérique qui s'incrémente à chaque minute virtuelle. C'est la propriété la plus importante pour synchroniser les événements basés sur le temps.
*   `_minute` : La minute actuelle (0-59).
*   `_hour` : L'heure actuelle (0-23).
*   `_day` : Le jour du mois (1-30, par exemple).
*   `_month` : Le mois de l'année (1-12).
*   `_year` : L'année en cours.
*   `_dayOfWeek` : Le jour de la semaine (ex: 1 pour Lundi, 7 pour Dimanche).
*   `_season` : La saison actuelle (ex: "printemps", "été", "automne", "hiver").

## 3. Fonctionnement

### Mise à jour

La mise à jour de `$gameDate` est généralement gérée par un patch sur `Scene_Map` ou une autre scène principale.

Une méthode `update()` est appelée régulièrement. À l'intérieur, un minuteur interne basé sur le temps réel (ou le nombre de frames) déclenche l'incrémentation du temps virtuel.

Quand une minute virtuelle passe, `_timestamp` est incrémenté, et toutes les autres propriétés (`_hour`, `_day`, etc.) sont recalculées en conséquence.

### Utilisation

D'autres systèmes peuvent "s'abonner" aux changements de temps en surveillant la propriété `_timestamp`.

Exemple dans `ActorHealthManager` :

if($gameDate._timestamp != this._lastTimeStamp){
    this.updateMin();
    this._lastTimeStamp = $gameDate._timestamp;
}

Ce code garantit que la méthode `updateMin()` est appelée une seule et unique fois par minute virtuelle, indépendamment du framerate du jeu.

## 4. Configuration

Les aspects du calendrier (nombre de jours par mois, noms des mois, noms des jours de la semaine, etc.) sont définis dans un fichier de configuration dédié, par exemple `SC_DateConfig.js`.