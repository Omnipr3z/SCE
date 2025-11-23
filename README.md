# SimCraft Engine (SCE)
![Simcraft Engine](https://img.shields.io/badge/Engine-Simcraft-blue)  
![Version](https://img.shields.io/badge/Version-1.2.0-orange)  
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

# Licence

![Licence CC BY-NC-SA  4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)

Ce projet est sous licence **Creative Commons Attribution - Non Commercial - Share Alike 4.0 International (CC BY-NC-SA 4.0)**.

Voir le texte complet ici : [https://creativecommons.org/licenses/by-nc-sa/4.0/](https://creativecommons.org/licenses/by-nc-sa/4.0/)

### **Restrictions Supplémentaires**
En plus des termes de la licence CC BY-NC-SA 4.0, l’utilisation de ce code est soumise aux conditions suivantes :

1. **Conservation de l’En-Tête** :
   - **Tous les fichiers** doivent conserver **intact** l’en-tête original (bannière ASCII, auteur, licence, etc.).
   - **Interdiction formelle** de supprimer, modifier ou altérer l’en-tête, sous peine de violation de licence.

2. **Obligation d’Afficher le Splash Screen** :
   - Tout projet commercial utilisant ce code **doit afficher le logo "Sim Craft Engine"** au démarrage du jeu.
   - Le logo, disponible dans le dossier `/DOC/logo.png`, doit rester visible pendant **au moins 3 secondes**.

3. **Attribution Claire** :
   - Tout projet dérivé doit **mentionner explicitement** :
     - Le nom **"Sim Craft Engine"** dans les crédits.
     - Un lien vers le dépôt officiel : [https://github.com/Omnipr3z/SCE](https://github.com/Omnipr3z/SCE).

Aussi, certains scripts mentionnés ci-dessous sont dérivés du **code source de RPG Maker MZ**.
Ces scripts sont conçus pour fonctionner avec le moteur RPG Maker MZ et restent soumis à la **licence propriétaire de Gotcha Gotcha Games / Degica**.

Par conséquent, **l'utilisation de ces scripts nécessite que vous possédiez une copie légale de RPG Maker MZ**.
Ils ne peuvent pas être redistribués séparément ou utilisés en dehors du cadre autorisé par la licence utilisateur du logiciel.

Veuillez consulter le [EULA officiel de RPG Maker MZ](https://www.rpgmakerweb.com/eula) pour plus d'informations.

[![Licence RPG Maker MZ](https://img.shields.io/badge/Licence-RPG_Maker_MZ_EULA-red)](https://www.rpgmakerweb.com/eula)  

Si vous utiliser le code de Simcraft partager une démo de votre projet serait très apprécié.

# SIMCRAFT ENGINE

SimCraft est un sous-engine maison qui pousse RPG Maker bien plus loin. 🔥

🛠️ SimCraft apporte :
- 🌍 Temps & météo dynamique (jour/nuit, saisons, lunaisons)
- 📆 Calendrier & événements impactant le monde et les PNJs
- 💰 Économie et commerce évolutifs (offre/demande, rareté, production)
- 🏡 Gestion d’infrastructures & diplomatie entre clans et factions
- 🎭 Talents, compétences & équipements visibles sur le sprite
- 🩺 Besoins type Sims (faim, soif, fatigue, hygiène, maladies, soins)
- 🔄 Plugins auto-chargés & DebugTool avancé

Je suis en pleine refonte de SimCraft pour le rendre compatible avec MZ, donc peu de contenu dispo sur Git pour l’instant, mais ça arrive vite.

Ce projet combine plusieurs standalone. Choisissez la documentation qui vous intéresse :

# Documentation

- **Tree & Ordre de chargement**
  - [Arborescence des repertoires](DOC/Arbo.md)
  - [Ordre des Plugins](DOC/PluginsOrder.md)
- **Guides & Core**
  - [Conseils de Développement](DOC/conseils.md)
  - [JsExtender](DOC/JsExtender.md)
  - [Engine Core & Autoloader](DOC/AutoLoader.md)
  - [DebugTool (Outils de debug avancés)](DOC/DebugTool.md)
  - [Data Manager](DOC/DataManager.md)
  - [Idées pour le launcher](DOC/launcher_ideas.md)
- **Systèmes de Personnage**
  - [Système Visuel (Paper-Doll)](DOC/CharacterVisual.md)
  - [Animations Dynamiques](DOC/CharacterAnim.md)
  - [Système d'Actions](DOC/CharacterAction.md)
  - [Système de Poses](DOC/CharacterPose.md)
  - [Système de Santé (Survie,atheltisme,etc)](DOC/HealthSystem.md)
- **Temps & Météo**
  - [Luminosité / Daylight (Jour/Nuit)](DOC/Daylight.md)
  - [Date de Jeu & Calendrier](DOC/GameDate.md)
  - [Système de Météo](DOC/WeatherSystem.md)
- **Effets Visuels**
  - [Système d'Ombres Dynamiques](DOC/CharacterShadow.md)
- **Managers**
  - [Actors Main Managers](DOC/ActorsMainManagers.md)
  - [Input Manager](DOC/InputEx.md)
  - [TouchInput Manager](DOC/TouchInputEx.md)
  - [Graphics Manager](DOC/GraphicsEx.md)
- **Scènes**
  - [Scène de Cinématiques](DOC/Scene_Cinematic.md)

# TODO ROADMAP

La feuille de route complète du projet est désormais disponible dans un document dédié.
- [Consulter la Roadmap](DOC/Roadmap.md)

# Contacts et Liens
<span style="font-size:24px;">
<!-- Website Icon -->
<a href="https://pahernandezd3v.com" style="color:#555">
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 2048 2048" fill="#555">
  <path d="M1024 0q141 0 272 36t245 103t207 160t160 208t103 245t37 272q0 141-36 272t-103 245t-160 207t-208 160t-245 103t-272 37q-141 0-272-36t-245-103t-207-160t-160-208t-103-244t-37-273q0-141 36-272t103-245t160-207t208-160T751 37t273-37m0 1920q123 0 237-32t214-90t182-141t140-181t91-214t32-238q0-123-32-237t-90-214t-141-182t-181-140t-214-91t-238-32q-123 0-237 32t-214 90t-182 141t-140 181t-91 214t-32 238q0 123 32 237t90 214t141 182t181 140t214 91t238 32m597-880l48-144h75l-85 256h-75l-48-144l-48 144h-75l-85-256h75l48 144l48-144h74zm-464-144h75l-85 256h-75l-48-144l-48 144h-75l-85-256h75l48 144l48-144h74l48 144zm-512 0h75l-85 256h-75l-48-144l-48 144h-75l-85-256h75l48 144l48-144h74l48 144z"/>
</svg> https://pahernandezd3v.com</a> <span style="font-size:16px;">**(en cours de maintenance)**</span>
<br><br>
<!-- Discord Icon -->
<a href="https://discord.gg/2U3mqfKG" style="color:#5865f2">
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
  <g fill="none">
    <rect width="256" height="256" fill="#5865f2" rx="60"/>
    <g clip-path="url(#SVGYhWcPcwn)">
      <path fill="#fff" d="M197.308 64.797a165 165 0 0 0-40.709-12.627a.62.62 0 0 0-.654.31c-1.758 3.126-3.706 7.206-5.069 10.412c-15.373-2.302-30.666-2.302-45.723 0c-1.364-3.278-3.382-7.286-5.148-10.412a.64.64 0 0 0-.655-.31a164.5 164.5 0 0 0-40.709 12.627a.6.6 0 0 0-.268.23c-25.928 38.736-33.03 76.52-29.546 113.836a.7.7 0 0 0 .26.468c17.106 12.563 33.677 20.19 49.94 25.245a.65.65 0 0 0 .702-.23c3.847-5.254 7.276-10.793 10.217-16.618a.633.633 0 0 0-.347-.881c-5.44-2.064-10.619-4.579-15.601-7.436a.642.642 0 0 1-.063-1.064a86 86 0 0 0 3.098-2.428a.62.62 0 0 1 .646-.088c32.732 14.944 68.167 14.944 100.512 0a.62.62 0 0 1 .655.08a80 80 0 0 0 3.106 2.436a.642.642 0 0 1-.055 1.064a102.6 102.6 0 0 1-15.609 7.428a.64.64 0 0 0-.339.889a133 133 0 0 0 10.208 16.61a.64.64 0 0 0 .702.238c16.342-5.055 32.913-12.682 50.02-25.245a.65.65 0 0 0 .26-.46c4.17-43.141-6.985-80.616-29.571-113.836a.5.5 0 0 0-.26-.238M94.834 156.142c-9.855 0-17.975-9.047-17.975-20.158s7.963-20.158 17.975-20.158c10.09 0 18.131 9.127 17.973 20.158c0 11.111-7.962 20.158-17.973 20.158m66.456 0c-9.855 0-17.974-9.047-17.974-20.158s7.962-20.158 17.974-20.158c10.09 0 18.131 9.127 17.974 20.158c0 11.111-7.884 20.158-17.974 20.158"/>
    </g>
    <defs>
      <clipPath id="SVGYhWcPcwn">
        <path fill="#fff" d="M28 51h200v154.93H28z"/>
      </clipPath>
    </defs>
  </g>
</svg> https://discord.gg/2U3mqfKG</a>
<br><br>
<!-- Patreon Icon -->
<a href="https://www.patreon.com/c/omnipr3z" style="color:#FF424D">
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
  <path fill="#FF424D" d="M232 93.17c0 41-29.69 52.47-53.55 61.67c-8.41 3.24-16.35 6.3-22.21 10.28c-11.39 7.72-18.59 21.78-25.55 35.38c-9.94 19.42-20.23 39.5-43.17 39.5c-12.91 0-24.61-11.64-33.85-33.66s-14.31-51-13.61-77.45c1.08-40.65 14.58-62.68 25.7-74c14.95-15.2 35.24-25.3 58.68-29.2c21.79-3.62 44.14-1.38 62.93 6.3C215.73 43.6 232 65.9 232 93.17"/>
</svg> https://www.patreon.com/c/omnipr3z</a>
<br><br>
<!-- GitHub Icon -->
<a href="https://github.com/Omnipr3z/SCE" style="color:#555">
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20">
  <path fill="#555" d="M13.18 11.309c-.718 0-1.3.807-1.3 1.799c0 .994.582 1.801 1.3 1.801s1.3-.807 1.3-1.801c-.001-.992-.582-1.799-1.3-1.799m4.526-4.683c.149-.365.155-2.439-.635-4.426c0 0-1.811.199-4.551 2.08c-.575-.16-1.548-.238-2.519-.238c-.973 0-1.945.078-2.52.238C4.74 2.399 2.929 2.2 2.929 2.2c-.789 1.987-.781 4.061-.634 4.426C1.367 7.634.8 8.845.8 10.497c0 7.186 5.963 7.301 7.467 7.301l1.734.002l1.732-.002c1.506 0 7.467-.115 7.467-7.301c0-1.652-.566-2.863-1.494-3.871m-7.678 10.289h-.056c-3.771 0-6.709-.449-6.709-4.115c0-.879.31-1.693 1.047-2.369C5.537 9.304 7.615 9.9 9.972 9.9h.056c2.357 0 4.436-.596 5.664.531c.735.676 1.045 1.49 1.045 2.369c0 3.666-2.937 4.115-6.709 4.115m-3.207-5.606c-.718 0-1.3.807-1.3 1.799c0 .994.582 1.801 1.3 1.801s1.301-.807 1.301-1.801c0-.992-.582-1.799-1.301-1.799"/>
</svg> https://github.com/Omnipr3z/SCE</a>
<br><br>
<!-- YouTube Icon -->
<a href="https://www.youtube.com/@Omnipr3z" style="color:#FF0000">
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20">
  <path fill="#FF0000" d="M10 2.3C.172 2.3 0 3.174 0 10s.172 7.7 10 7.7s10-.874 10-7.7s-.172-7.7-10-7.7m3.205 8.034l-4.49 2.096c-.393.182-.715-.022-.715-.456V8.026c0-.433.322-.638.715-.456l4.49 2.096c.393.184.393.484 0 .668"/>
</svg> https://www.youtube.com/@Omnipr3z</a>
 </span>
<br><br>

# Credits

 * icones réseaux sociaux des documentations https://icon-sets.iconify.design/
