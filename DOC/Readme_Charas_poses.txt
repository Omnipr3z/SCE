Voici la liste finale :

## DEPLACEMENTS
# Debout
WALK                Mouvement de base
BREATH              Reprendre son souffle
RUN                 Mouvement de course
JUMP                Sauter
SNEAK	            Mouvement furtif, souvent accroupi.
TRANSPORT           Transort d'objet lourd dans les bras
BACKPACK            Transport d'objet lourd sur le dos (utile pour les cadavres notament)
MOVE_GUARD          Mouvement en guard
MOVE_PUSH           Mouvement de pousser / tirer un element de terrain
MOVE_FOCUS          Bouge en visant ou preparant une action spéciale
MOVE_AFFECTED       Mouvement bléssé
# Speciaux
LADDER	            Animer la montée et descente des échelles ou d'une paroi.
WATER	            Marcher dans l'eau peu profonde (jusqu'aux genoux).
SWIM	            Nager dans l'eau profonde.
CRAWL	            Ramper sous des obstacles.



## POSITIONS FIXES (ANIMATIONS BOUCLEES OU POSES FIGEES)
#Debout
IDLE                (Repos)	Rendre le personnage vivant lorsqu'il est immobile. utilise une alternanece de GUARD et FOCUS
FOCUS	            Pour une pose préparatoire générique (ex: prêt à tirer). utilise MOVE_FOCUS
GUARD	            Le personnage se protège ou parade. utilise MOVE_GUARD
#couché
KO/SLEEP	        Inconscient ou mort.
COVER               Position à couvert utilise SNEAK
SIT                 (Assi) : Sur une chaise, un banc, etc.
SNIPE	            Cruciale pour la classe. Le personnage s'agenouille ou se met en position stable pour augmenter sa précision. Cette pose remplace souvent la pose IDLE ou WAITING lorsqu'il a son arme de tir équipée.
VICTORY	            Pose de célébration.

## ANIMATION D'ACTIONS UNIQUES
THROW	            Lancement d'un objet (grenade, couteau, etc.).
INTERACT	        Utiliser un levier, ouvrir une porte. UTILISE MOVE_PUSH
CONSUME	            Boire/manger un objet de soin.
DROPDOWN            Poser/ramasser (mine, item) UTILISE INTERACT
CROUCHFIRE	        L'animation du tir réel dans cette position. Doit être distincte du simple utilise MOVE_FOCUS
RELOAD	            Une animation courte et nécessaire après avoir tiré (surtout si le Sniper a une capacité limitée par tour, comme dans un TRPG).
TAKE	            Sortir ou ranger l'arme spécifique (fusil, arc, etc.). Donne du style aux cinématiques.
DAMAGE	            Pose lors de l'encaissement d'un coup.
ATTACK	            Animation d'attaque (mêlée) lié au skills et au equipements.
SHOT                Attaque distante liée au skills et au equipements.
CAST	            Lancer un sort/ action speciale ou incanter lié au skills et au equipements.

## ANIMATION D'EFFETS UNIQUES (S'EXECUTE UNE FOIS)
AFFECTED	        Peut être une pose de "faiblesse" ou de "maladie". Une aniim type breath/courbé pour l'essoufflement Se lance à interval
BUFFED	            Pose de "force" ou de "concentration" au moment ou l'effet est activé. 
SURPRISE            (Surprise)	La réaction à un événement inattendu (yeux écarquillés, recul). Au moment ou une unité infiltrée est repérée par exemple

## ANIMATION DIALOGUE ET COMMUNICATION
SPEAK               (Parler) Cruciale. Le personnage bouge la tête, la bouche, ou gesticule légèrement pendant les dialogues. Cela brise la monotonie de la pose IDLE pendant les longues conversations et rend les PNJs (et le héros) plus vivants.
POINT               (Pointer/Indiquer)	Indiquer une direction, un objet, ou un PNJ. Très utile pour les cinématiques ou les quêtes.
GREET               (Saluer)	Lever la main pour dire bonjour ou au revoir, ajoutant du caractère aux interactions.
CRY                 (Tristesse/Pleurs)	Pour les moments dramatiques de l'histoire.
HAPPY               (Rire/Joie)
FURIOUS             (Colere)

Pour la version de base je vais limiter les anim pour completer par la suite en rutilisant certaine a plusieurs fins en ajoutant une anim au dessus pou des indicateur pour les differencer

Voici les anims pour la version de base et ce qu'il advient des autres :

Concervés:
WALK, RUN, SNEAK, LADDER, CRAWL,JUMP,MOVE_PUSH, IDLE, MOVE_GUARDGUARD, KO, VICTORY, THROW, RELOAD, DAMAGE, ATTACK, SHOT, POINT

Utilise d'autre anims ou certaine frames de celles ci provisoirement
WATER (utiilise WALK)
GUARD (Utilise WALK)
FOCUS Utilise  de l'anim d'attack (a priori la premiere)
COVER Utilise  de sneak
SNIPE Utilise  de l'anim d'attack (a priori la premiere)
INTERACT Utilise  de MOVE_PUSH
CONSUME Utilise de VICTORY
DROPDOWN  Utilise de sneak
CROUCHFIRE Utilise ATTACK_DISTANT
CAST Utilise VICTORY
AFFECTED Utilise de sneak
BUFFED Utilise de VICTORY
SURPRISE Utilise Jump pou Point
ANIMATION DIALOGUE ET COMMUNICATION remplacé par victory ou Point ou autre... Pas très utile pour l'instant...

Inutilisé dans la Version pour le moment:
SWIM, TRANSPORT, BACKPACK,SIT, TAKE, TALK










