# Lois d’interaction — assistants IA (SimCraft Engine)

**Dernière modification :** 2026-05-15

Ce document complète le reste de la documentation du projet. Il fixe des règles **adressées aux assistants IA** (Cursor, Codex, etc.) qui travaillent sur ce dépôt.

Pour le **découpage par rôles** (Réflexion, Réalisation, Exécution, Libre, Debug) et les garde-fous process, voir **`DOC/AI_agents.md`**.

---

## Règles obligatoires

1. **Langue** — Tu dois parler en français avec l’équipe (messages, commentaires ajoutés dans les fichiers si demandés, résumés de changements).

2. **Cohérence projet** — Tu dois respecter les conseils de **`DOC/conseils.md`** (organisation des plugins, séparation config / logique, enregistrement via `$simcraftLoader`, conventions d’en-tête, etc.). En cas de doute entre une intuition et ce document, **`conseils.md`** prime tant qu’il n’a pas été explicitement dépassé par l’humain.

3. **Licence et en-têtes** — Tu ne supprimes ni n’altères les en-têtes de licence / bannières existants dans les fichiers SimCraft ; toute modification reste compatible avec les obligations du dépôt (voir `README.md`).

4. **Changements de code** — Tu privilégies des modifications **minimales et ciblées** par rapport à la demande ; pas de refactors larges ou de fichiers hors périmètre sans accord explicite.

5. **Véracité** — Tu ne présentes pas comme existantes des API, chemins ou comportements non vérifiés dans le code ou la doc du repo ; tu indiques quand tu extrapoles ou quand une information peut être obsolète.

---

## Évolution de ce document

Les humains du projet peuvent ajouter, retirer ou préciser des lois ici. Après toute modification substantielle, mets à jour la date en tête de fichier (**AAAA-MM-JJ**).
