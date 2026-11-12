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

_Rien en attente pour l'instant._

## release/2026-11-12T12-59-00Z — 12 novembre 2026

### ✨ Nouveautés

- **Chaque section de la page des labels a désormais son lien.** `/fr/docs/labels/#added-labels`,
  `#replies`, `#review-status`, `#decision` et les autres sont des ancres stables, les mêmes
  dans les deux langues. La page de configuration explique aussi l'ordre personnel des
  boutons.
- **Les notes de version du toolkit vont désormais jusqu'à la 1.0.0-rc.2.**
  `/fr/notes-de-version/v1/` gagne onze versions, de la 1.0.0-beta.13 à la version
  candidate : les labels pour répondre à une revue, la prise en charge de GitLab, les
  marqueurs de session de revue, un mode `enforce` qui bloque vraiment, et le retrait du
  vérificateur. Son introduction ne parle plus d'un serveur : l'extension ne bloque jamais
  une fusion.
- **La page des labels présente les dix-neuf labels que livre le toolkit.**
  `/fr/docs/labels/` les range comme la barre d'outils — remarques, état de la revue,
  réponses — et dit lesquels viennent de Conventional Comments et lesquels sont ajoutés par
  le toolkit. De nouvelles sections expliquent comment répondre à une remarque (`thanks`,
  `done`, `ack`, `disagree`, `decision`), comment dire où en est une revue (`summary`,
  `reviewed`), et comment une équipe qui veut s'en tenir à la liste d'origine désactive le
  reste.
- **La page Enforce décrit désormais le mode tel qu'il est livré.** `/fr/docs/enforce/`
  remplace l'ancienne page de feuille de route : quand l'extension bloque un commentaire,
  pourquoi elle relit d'abord la configuration, et pourquoi elle ne bloque jamais une
  fusion. L'ancienne adresse `/fr/docs/serveur/` y redirige.
- **Une nouvelle page est consacrée à la revue assistée par IA.** `/fr/docs/revue-ia/`
  présente le marqueur de session, qui permet de distinguer les commentaires de plusieurs
  sessions de revue, et les deux skills que le toolkit fournit aux agents qui relisent une
  pull request ou répondent à une revue.
- **GitLab figure parmi les plateformes prises en charge.** gitlab.com reçoit la barre
  d'outils, la validation en direct, les badges, le filtre des fils et le bandeau ;
  l'extension n'y bloque jamais un commentaire.
- **« Comment ça marche » décrit ce que l'extension a gagné :** la barre d'outils en trois
  groupes et l'ordre personnel des boutons, les avis de configuration, le bandeau replié, le
  filtre des fils et les marqueurs de session.
- **Le guide d'adoption suit le parcours que recommande le toolkit.** `/fr/docs/adoption/`
  va d'`assist` à `enforce` sur un dépôt pilote, puis partout ; il indique ce qu'il faut
  préparer avant la bascule et comment revenir en arrière en quelques minutes.
- **La page de configuration explique ce que l'extension vous signale.**
  `/fr/docs/configuration/` gagne deux sections : le moment où un changement prend effet, et
  les avis de configuration affichés dans la pastille d'état.
- **La page d'installation couvre GitLab.com et le déploiement à l'échelle d'une
  organisation :** l'installation forcée, les domaines autorisés d'avance, le plancher et le
  point de collecte de la télémétrie.
- **La page Diagnostic couvre ce qu'apporte la mise à jour vers la 1.0.0-rc.1.** Deux
  nouvelles entrées — les avis de configuration qui apparaissent dans la pastille d'état, et
  les commentaires soudain bloqués en `enforce` — et une dernière section pour télécharger
  l'archive de diagnostic et la joindre à un ticket.

### 🐛 Corrections

- **Le site n'annonce plus de contrôle de fusion au niveau de la plateforme.** L'accueil,
  « Comment ça marche », la page des plateformes, le guide d'adoption, le sommaire de la
  documentation et la page de confidentialité le présentaient tous comme étant sur la
  feuille de route. Le toolkit en a décidé autrement : l'extension est tout le produit,
  elle signale les fils bloquants non résolus et ne bloque jamais une fusion. L'étape
  `warn` disparaît avec lui.
- **Azure DevOps est annoncé pour dev.azure.com seulement.** La page des plateformes
  présentait Azure DevOps Server comme pris en charge ; l'extension agit sur dev.azure.com
  et nulle part ailleurs. Bitbucket n'est plus annoncé comme à venir.
- **L'accueil n'affirme plus que l'extension n'envoie jamais rien.** Son bloc de
  confidentialité disait « Rien n'est envoyé. Pas de télémétrie. », alors que la page de
  confidentialité décrit la télémétrie qu'une organisation peut mettre en place, avec
  l'accord de chacun. Il dit désormais que rien n'est envoyé par défaut. Le bloc voisin ne
  range plus les navigateurs parmi les plateformes, et ne renvoie plus à des « limitations
  documentées » que le site ne documentait nulle part.
- **L'accueil affiche les bonnes icônes et le bon raccourci.** `praise` porte 👏, `decision`
  porte ⚖️, et `nitpick:` se tape `?ni`.
- **La page des labels donne les réglages par défaut que livre le toolkit.** `typo` et
  `polish` sont activés, seul `quibble` ne l'est pas ; et la page ne cite plus
  `formatSeverity`, ni de groupe habilité à poser une `decision`, tous deux retirés.
- **« Comment ça marche » donne les deux vraies conditions du blocage d'un commentaire.** La
  date d'activation a disparu, et la page précise que l'extension relit la configuration
  avant de bloquer.
- **La documentation ne décrit plus des réglages et un mode qui ont disparu.** `warn`,
  `formatSeverity` et `resolverOverrideGroup` sortent des pages de configuration et
  d'adoption, qui disent maintenant ce qu'il advient d'un fichier qui les contient encore.
- **La documentation dit ce que `toolCommands` et `coreMinVersion` acceptent vraiment.**
  Elle invitait à exempter une seule commande comme `"/rebase"`, ce que l'extension ignore :
  seuls `"/*"`, pour toutes les commandes commençant par `/`, et les identifiants exacts
  `@compte` fonctionnent. Et `coreMinVersion` était présenté comme exigeant une version
  minimale, alors que seule la majeure est comparée : avec une extension 1.x, `1.99.0` est
  appliqué et `2.0.0` ne l'est pas. Les pages Enforce, configuration, adoption et diagnostic,
  ainsi que les indications du schéma dans l'éditeur, le disent désormais.
- **La page d'installation ne propose plus d'autoriser Azure DevOps Server ni
  `visualstudio.com`,** où l'extension ne fait rien.
- **La page de confidentialité recense tout ce que l'extension conserve.** Trois préférences
  synchronisées au lieu de deux, les avis de configuration et le journal de diagnostic tels
  qu'ils sont stockés, et une date de révision. Le journal était décrit comme « les
  50 dernières entrées » ; il garde une ligne par règle, avec la page où la règle a échoué.
- **La page Diagnostic décrit l'extension telle qu'elle est aujourd'hui.** « Configuration
  non lue » est un message de la pastille d'état, permanent sur GitLab ; un fil bloquant se
  résout sur la plateforme, sans groupe habilité ; et le journal est décrit tel que
  l'extension le tient.
- **Les pages ne s'expliquent plus par contraste avec une version que vous n'avez pas
  connue.** L'accueil, la page des plateformes et celle d'installation mentionnaient chacune
  github.com dans une phrase qui énonçait déjà la règle : l'extension n'accède qu'aux
  domaines que vous avez autorisés. Nommer un domaine à l'intérieur de cette règle ne parle
  qu'à ceux qui savaient que github.com était intégré auparavant ; pour les autres, cela
  laisse croire que ce domaine fait exception, soit l'inverse de ce que la phrase dit.
  L'incise disparaît dans les trois pages ; la page de diagnostic la garde, car quelqu'un qui ne voit
  pas sa barre de labels sur github.com a besoin que cette exception soit explicitement
  écartée.
- **Aucune des deux langues ne parle plus d'accorder un domaine.** Ce qui s'accorde, c'est
  l'accès à un domaine, pas le domaine lui-même, et les deux langues avaient perdu cette
  distinction. En français, la page de diagnostic disait « tant que vous ne lui accordez pas
  un premier domaine » ; en anglais, les pages d'installation et de plateformes disaient
  « every domain is granted one at a time » et celle de diagnostic « until you grant a first
  domain ». Les quatre nomment désormais ce qui est réellement accordé. La même passe a
  repris la deuxième phrase de la section d'autorisation des domaines, sur chacune des deux
  pages d'installation : en français, « ne dispose d'aucun accès permanent » remplace « ne
  détient d'accès permanent à aucun site » ; en anglais, « has no permanent access to any
  site » remplace « holds no permanent access to any site ». La revue avait relevé la
  tournure française dans les notes de la release précédente et elle y a été corrigée ; la
  page d'origine a échappé à la correction et a été mise en ligne telle quelle.

### 🔧 Améliorations

- **Les phrases qui sentaient la traduction se lisent désormais naturellement, dans les
  deux langues.** Une relecture complète a repris les pages des labels, « Comment ça
  marche », adoption, configuration, installation, diagnostic et revue assistée par IA, le
  sommaire de la documentation et quelques notes de version du toolkit : un fil se marque
  désormais « comme résolu avec la commande de la plateforme », et le pilote est « concluant »
  plutôt que de « tenir ».
- **Le schéma de configuration suit la 1.0.0-rc.2 du toolkit.** `/schema/v1.json` connaît
  désormais `sessionIcon`, les propriétés `kind`, `description` et `usage` d'un label, et le
  diagnostic `W-SESSION-MULTIPLE`. Il ne propose plus les sept clés que le toolkit a retirées
  avec le vérificateur — `formatSeverity`, `overrideLabel`, `resolverOverrideGroup`,
  `activation`, `docUrl`, `server` et `exemptionLog` : votre éditeur les souligne désormais.
  `"mode": "warn"` reste accepté, et signalé comme obsolète.
- **La page des plateformes ne range plus les navigateurs parmi les plateformes.** Chrome,
  Edge, Brave et Firefox figuraient dans la même grille que GitHub et Azure DevOps, comme
  s'ils répondaient à la même question. Ils ont désormais leur propre rubrique, sous les
  plateformes : d'un côté là où vous faites vos revues, de l'autre là où l'extension
  s'installe.

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
