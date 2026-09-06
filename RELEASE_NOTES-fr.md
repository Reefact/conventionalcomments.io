# Notes de version — conventionalcomments.io

🌍 🇬🇧 [English](RELEASE_NOTES-en.md) · 🇫🇷 Français (ce fichier)

Ce qui a changé sur conventionalcomments.io, une section par tag `release/*`, en langage
clair — pour une visiteuse, un contributeur, ou le mainteneur qui vérifie ce qui est nouveau.
Ceci n'est pas un journal de commits : on y décrit ce qu'une lectrice remarquerait, pas
quelle pull request l'a apporté. L'historique technique reste celui du dépôt.

À ne pas confondre avec [`/fr/notes-de-version/v1/`](https://conventionalcomments.io/fr/notes-de-version/v1/),
qui porte les notes du **toolkit**. Ce fichier-ci porte celles du **site**.

Une release sans section ici ne sort pas : `scripts/release-notes.sh` refuse plutôt que de
dériver une liste depuis les commits, et le job `notes` échoue avec lui. Une release déjà
taguée est le mauvais moment pour découvrir que personne n'a écrit ce qu'elle contient.

## Unreleased

### 🐛 Corrigé

- **Le texte ne s'étale plus d'un bord à l'autre sur les grands écrans.** L'en-tête, le pied
  de page et chaque section de contenu tiennent désormais dans une colonne centrée au lieu de
  couvrir toute la largeur d'un grand écran, où une ligne de texte pouvait autrement dépasser
  largement une largeur de lecture confortable.

## release/2026-09-06T18-03-59Z — 6 septembre 2026

### ✨ Nouveautés

- **Le site existe.** conventionalcomments.io répond, en anglais à la racine et en français
  sous `/fr/`, avec des adresses traduites — `/docs/configure/` et
  `/fr/docs/configuration/` sont la même page en deux langues, et le sélecteur vous laisse
  sur la page que vous lisiez au lieu de vous renvoyer à l'accueil.
- **Quatre pages pour décider** : ce que la convention règle et pourquoi une étiquette change
  la façon dont une remarque se lit ; comment l'extension et le serveur fonctionnent ; quelles
  plateformes et quels navigateurs sont supportés ; et ce que l'extension fait — et ne fait
  pas — de ce que vous écrivez en revue.
- **Sept pages pour travailler** : installation, labels et décorations, configuration,
  adoption, le serveur, et diagnostic — chacune écrite depuis les sources du toolkit.
- **Le schéma de configuration est servi** à
  [`/schema/v1.json`](https://conventionalcomments.io/schema/v1.json). Mettez cette URL sur
  la ligne `$schema` du `.conventional-comments.json` d'un dépôt et votre éditeur complète
  les clés, décrit chacune au survol, et souligne une valeur fausse avant le commit.
- **Les notes de version du toolkit sont lisibles sur le site**, dans les deux langues, sur
  [`/fr/notes-de-version/v1/`](https://conventionalcomments.io/fr/notes-de-version/v1/) —
  dix versions, chacune disant ce qu'elle a changé pour qui s'en sert.

### 🙌 Améliorations

- **Le site sert ses propres polices.** Rien n'est récupéré chez un tiers : ouvrir une page
  n'envoie votre adresse et l'URL que vous lisez à personne d'autre qu'à ce site — ce que la
  page confidentialité affirme, et que l'onglet réseau montre désormais.
