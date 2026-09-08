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

### 🐛 Corrections

- **Les pages ne s'expliquent plus par contraste avec une version que vous n'avez pas
  connue.** L'accueil, la page des plateformes et celle d'installation distinguaient chacune
  github.com dans une phrase qui énonçait déjà la règle : l'extension n'atteint que les
  domaines que vous avez autorisés. Nommer un domaine à l'intérieur de cette règle ne parle
  qu'à ceux qui savaient que github.com était intégré auparavant ; pour les autres, cela
  laisse croire que ce domaine fait exception, soit l'inverse de ce que la phrase dit.
  L'incise disparaît des trois ; la page de diagnostic la garde, car quelqu'un qui ne voit
  pas sa barre de labels sur github.com a besoin que cette exception soit explicitement
  écartée.
- **La page de diagnostic ne parle plus d'accorder un domaine.** Sous « la barre de labels
  n'apparaît pas », elle disait « tant que vous ne lui accordez pas un premier domaine » :
  on n'accorde pas un domaine à une extension, on l'autorise à y accéder. La revue avait
  relevé la même tournure dans les notes de la release précédente et elle y a été corrigée ;
  la page d'origine a échappé à la correction et a été mise en ligne telle quelle.

## release/2026-09-08T10-40-39Z — 8 septembre 2026

### ✨ Nouveautés

- **Les notes de version du toolkit couvrent désormais la 1.0.0-beta.12.**
  `/fr/notes-de-version/v1/` gagne la version qui rend la visite guidée lisible dans les deux
  thèmes et empêche la section « État » de la page d'options d'affirmer plus que ce que
  l'extension sait.
- **Les notes de version du toolkit couvrent désormais la 1.0.0-beta.11.**
  `/fr/notes-de-version/v1/` gagne la version où toutes les plateformes — `github.com`
  compris — sont autorisées de la même façon, où la page d'options s'ouvre d'elle-même à la
  première installation avec une visite guidée, et où GitHub Enterprise Cloud avec résidence
  des données fonctionne, tout simplement.

### 🐛 Corrections

- **Le site n'affirme plus que l'extension fonctionne sur github.com dès l'installation.**
  C'était vrai jusqu'au toolkit 1.0.0-beta.10 ; depuis la 1.0.0-beta.11, une extension
  fraîchement installée n'est active nulle part tant que vous n'avez pas autorisé l'accès à
  un premier domaine, github.com comme un autre. Les pages d'installation, de plateformes, de
  diagnostic et l'accueil affirmaient le contraire, dans les deux langues — le genre de
  promesse qui envoie quelqu'un sur une pull request où rien ne se passe, et le laisse
  chercher un bug plutôt qu'un bouton. La page d'installation détaille désormais comment
  autoriser un domaine, et prévient quiconque met à jour depuis une version antérieure que
  github.com se taira jusque-là.
- **La page de diagnostic n'affirme plus que la plateforme a changé son balisage.** Sous
  « la barre de labels n'apparaît pas », la deuxième cause s'intitulait « La structure de la
  page a changé » — l'excès que le toolkit vient précisément de retirer de l'extension en
  1.0.0-beta.12. Ce qui est réellement enregistré, c'est qu'un sélecteur de l'extension n'a
  rien trouvé, ce qui peut signifier que le balisage a changé ou simplement que l'élément est
  légitimement absent, comme le bouton de fusion sur une pull request fermée. Envoyer
  quelqu'un chercher un changement de plateforme qui n'a jamais eu lieu est la pire réponse
  que puisse donner une page de diagnostic.
- **La page `/version` ne nomme plus deux fois la même release.** Sur un build issu d'un tag
  de release, le titre situé juste sous les informations de build répétait le titre de la
  page elle-même, « Dernière release ». Il affiche désormais « Ce qui a été livré », sur tout
  build — nommant le contenu de la section plutôt que la release elle-même, et conservant un
  vrai titre entre le h1 de la page et les titres propres à la carte de release, dans les
  deux cas.

## release/2026-09-07T10-06-13Z — 7 septembre 2026

### 🔧 Améliorations

- **Le site présente désormais l'extension telle qu'elle existe aujourd'hui, sans serveur
  à déployer.** Assist et warn sont disponibles dès aujourd'hui via l'extension navigateur.
  Enforce — c'est-à-dire, à terme, un contrôle de fusion exécuté au niveau de la plateforme
  — est désormais clairement présenté comme une évolution prévue et non comme un backend
  déjà disponible ou nécessaire. L'ancienne page consacrée au déploiement du serveur devient
  une page de feuille de route qui explique l'objectif d'Enforce sans imposer d'architecture
  à ce stade.
- **Le schéma de configuration reflète désormais clairement les capacités actuelles du
  produit.** Les descriptions de `mode` distinguent ce que l'extension sait déjà faire de
  ce qui relève encore de la feuille de route. Les paramètres `server`, conservés pour les
  évolutions futures, sont maintenant clairement identifiés comme sans effet dans
  l'extension actuelle.

## release/2026-09-07T08-30-31Z — 7 septembre 2026

### ✨ Nouveautés

- **`/version` affiche maintenant l'historique des releases de ce site**, à la place du texte
  d'attente qu'elle montrait depuis avant même qu'une release existe. La dernière release et
  jusqu'à cinq précédentes sont lues directement depuis ce fichier, dans votre langue.

### 🐛 Corrections

- **Deviner l'adresse d'une page dans la mauvaise langue, ou sous `/en/`, ne tombe plus sur
  une 404.** `/fr/docs/install/`, `/docs/installation/` (sans le préfixe `/fr/`), et toute
  adresse préfixée par `/en/` — que le site n'utilise jamais — redirigent désormais vers la
  bonne page au lieu d'une impasse.
- **Les pages de configuration et d'adoption ne décrivent plus un historique de
  `toolCommands` qui n'a jamais existé.** Elles disaient que les commandes slash « étaient
  auparavant reconnues grâce à une liste intégrée » qui « n'existe plus » — une affirmation
  sur une version passée que l'extension n'a jamais connue. Elles se contentent désormais
  d'indiquer le comportement actuel.

## release/2026-09-07T05-34-29Z — 7 septembre 2026

### 🔧 Amélioré

- **La table des matières de la doc reste en place pendant le défilement.** La navigation de
  gauche, sur les pages de documentation et de notes de version, reste désormais visible
  quand on lit une page longue, au lieu de disparaître avec le reste de la colonne.

## release/2026-09-06T21-44-09Z — 6 septembre 2026

### 🐛 Corrections

- **Le texte ne s'étale plus d'un bord à l'autre sur les grands écrans.** L'en-tête, le pied
  de page et chaque section de contenu tiennent désormais dans une colonne centrée au lieu
  d'occuper toute la largeur disponible, sur laquelle les lignes de texte pouvaient devenir
  bien trop longues pour rester confortables à lire.

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
