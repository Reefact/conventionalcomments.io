# Découpage en pages — conventionalcomments.io

Périmètre retenu : **vitrine + documentation essentielle**, bilingue **EN + FR**, cible
**tech lead**. Douze routes de contenu × deux langues, plus le schéma JSON.

Ce qui relève de la spécification normative, de la matrice `CA-01…CA-39` ou de
l'architecture interne **reste sur GitHub** : le site n'a pas vocation à devenir un
miroir du dépôt.

---

## 1. Vitrine — convertir un responsable

Quatre pages, une par objection.

### `/` · `/fr/` — Accueil

**Travail :** faire comprendre à quelqu'un qui ne connaît rien à la convention pourquoi
elle existe — en partant du malentendu humain, pas du mécanisme (§1 de l'identité).

Hero « C'est une remarque, ou un reproche ? » avec le bloc **avant / après** : la même
phrase seule, puis précédée de `nitpick (non-blocking)` · les quatre malentendus réels ·
la convention expliquée par *ce que l'auteur entend* · **l'effort demandé au relecteur** ·
l'objection « ça va rendre les revues molles » · la proportion visible d'une revue ·
**puis seulement** l'outil, sous « une bonne habitude s'oublie en trois jours » · la
trajectoire · confidentialité · plateformes.

- CTA principal : **« Voir les étiquettes »** → `/docs/labels/`
- CTA secondaire : « Installer l'extension » → `/docs/install/`
- Lien sortant vers `conventionalcomments.org` dans la section « la convention », pas en
  pied (§1.1 de l'identité).

Source : `README.md`, et le §1 de l'identité pour l'angle.

### `/how-it-works/` · `/fr/comment-ca-marche/`

**Travail :** lever l'objection « une extension, ça se désinstalle ».

Le contournement est assumé · ce que l'extension fait à l'envoi d'un commentaire, et ce
qu'elle ne fait pas : **elle ne bloque jamais une fusion**, et une équipe qui veut cette
contrainte utilise le réglage natif de sa plateforme · un seul `core/`, qui porte toute la
grammaire · ce que voit concrètement l'auteur d'une PR.

Le serveur, la parité A/B et l'empreinte de configuration, que cette page devait expliquer,
ont disparu avec le vérificateur (DEC0010 du toolkit).

Source : `docs/architecture-fr.md`, `README.md`, `docs/idr/` du toolkit.

### `/platforms/` · `/fr/plateformes/`

**Travail :** répondre à « est-ce que ça marche chez nous », et à rien d'autre.

Ce qui est **disponible** — GitHub (github.com, Enterprise Cloud, EMU, Enterprise Server),
Azure DevOps (Services, sur `dev.azure.com` seulement), GitLab (gitlab.com, sans blocage),
les navigateurs · ce qui **n'est pas couvert** (Azure DevOps Server et
`{org}.visualstudio.com`, GitLab Self-Managed et Dedicated ; Bitbucket est hors périmètre)
et l'invitation à demander le reste · ce qu'il faut pour démarrer (l'extension seule, qui
ne demande rien) · sur quels domaines l'extension regarde.

**Une page de disponibilité, pas une page d'aveux.** Une première version y étalait les
hypothèses ouvertes du spike P1′ sous forme de matrice à trois états. C'était une lecture
fausse du dépôt — le spike dit que « l'implémentation reste correcte tant qu'elles ne sont
pas tranchées » — et surtout une faute commerciale : sur la page qui doit rassurer, écrire
« une partie a été vérifiée pour de vrai » laisse entendre que le reste ne marche pas.

Les limites réelles ont leur place, mais pas ici : elles vont en documentation, là où
quelqu'un qui a déjà décidé vient chercher des faits.

Source : `README.md`, `manifest.json`.

### `/privacy/` · `/fr/confidentialite/`

**Travail :** passer une revue sécurité, **et** servir d'URL de politique de
confidentialité pour les stores (aujourd'hui la fiche pointe vers un fichier GitHub).

Ce qui ne sort jamais du navigateur · ce qui sort réellement (préférences via
`chrome.storage.sync`) · chaque permission et sa justification · télémétrie désactivée par
défaut · aucun token stocké.

Source : `PRIVACY.md`, `docs/store-permissions-justification-fr.md`.

---

## 2. Documentation essentielle

### `/docs/` · `/fr/docs/` — Sommaire

Orienter en dix secondes. Trois parcours nommés — « j'essaie », « je configure », « je
déploie ». Pas une liste de liens.

### `/docs/install/` · `/fr/docs/installation/`

Store Chromium · store Firefox · zip de release (sans Node ni Git) · chargement non
empaqueté · build depuis les sources. Dire explicitement qu'un zip ne se met **pas** à jour
tout seul.

Source : `docs/extension-setup-en.md`.

### `/docs/labels/` · `/fr/docs/labels/`

La page la plus consultée, et la vitrine de l'identité.

Les 19 labels, en trois groupes — remarques, états de la revue, réponses : icône, couleur,
bloquant par défaut, alias, exemple, abréviation clavier · **ce que le toolkit ajoute à
Conventional Comments** (sept labels, dont `decision`), dit sans ambiguïté · les
décorations `blocking` / `non-blocking` / `if-minor` et les décorations libres.

Source : `packages/core/src/config/defaults.ts`, `packages/extension/src/ui/strings.ts`.

### `/docs/configure/` · `/fr/docs/configuration/`

Rendre `.conventional-comments.json` évident. Chaque clé · les trois niveaux plancher /
organisation / dépôt · la fusion et l'épinglage · `coreMinVersion` · **le piège
`toolCommands`** (vide par défaut : un `/rebase` est rejeté en `enforce` tant que le dépôt
ne le déclare pas) · lien vers le schéma.

Source : `.conventional-comments.example.json`, `packages/core/src/config/`.

### `/docs/adoption/` · `/fr/docs/adoption/`

La page qu'un tech lead partagera à son équipe.

Le parcours — `assist` partout, puis `enforce` sur un dépôt pilote, puis généralisation ;
le mode `warn` n'existe plus · le **seul prérequis à `enforce`** : une procédure de retour
arrière écrite, son exécutant nommé, et la liste des dépôts qui écrivent eux-mêmes
`"mode": "enforce"` · le retour arrière en trois étapes (plancher, configuration
d'organisation, dépôts) · les indicateurs, qui ne sont pas encore calculables.

Source : `docs/operations-fr.md`.

### `/docs/enforce/` · `/fr/docs/enforce/`

Dire exactement ce que fait le mode `enforce`, et ce qu'il ne fait pas. Ce qu'il bloque :
l'envoi d'un commentaire non conforme, au clic comme au clavier, après avoir relu la
configuration · ce qu'il ne fait pas : il ne vaut que pour qui a l'extension, il ne bloque
jamais une fusion, et jamais sur GitLab · où trouver la contrainte de fusion : dans le
réglage natif de la plateforme.

Cette page remplace `/docs/server/` · `/fr/docs/serveur/`, qui décrivait le déploiement du
serveur puis une feuille de route ; les anciennes adresses y redirigent.

Source : `specifications-fr.md` §5.4, `docs/idr/` (DEC0010, DEC0012).

### `/docs/ai-review/` · `/fr/docs/revue-ia/`

La revue menée ou assistée par un agent. Le marqueur de session `[session:<id>]` et son
rendu · les deux skills fournis par le toolkit, `review-pull-request` et
`respond-to-review`.

Source : `README.md`, `specifications-fr.md` §3.6 et §5.5, `skills/`.

### `/docs/troubleshooting/` · `/fr/docs/diagnostic/`

Absorber le support avant qu'il n'arrive en issue. Le message « Configuration non lue » de
la pastille d'état · les avis de configuration qui apparaissent après une mise à jour · les
commentaires bloqués en `enforce` · les commandes outils (`/rebase`, bots) · les
utilisateurs exemptés · le journal et l'archive de diagnostic à joindre à un ticket.

Source : `packages/extension/src/ui/strings.ts`, `docs/store-listing-en.md`.

---

## 3. Ressources machine — pas des pages

### `/schema/v1.json`

**Le seul contenu du site qui serve tous les jours.** Aujourd'hui le `$schema` du toolkit
pointe vers `https://conventional-comments-toolkit.dev/schema/v1.json` : un domaine qui ne
répond pas — une requête y échoue comme vers un domaine inventé, quand
`conventionalcomments.org` répond 200 par le même chemin — et le dépôt du toolkit ne
contient aucun fichier de schéma. L'héberger ici donne l'autocomplétion et la validation
dans l'éditeur à tout dépôt configuré.

Servi avec `Access-Control-Allow-Origin: *` (`public/_headers`), sans quoi un éditeur qui
tourne dans un navigateur ne peut pas le lire. Détails : [`schema-fr.md`](./schema-fr.md).

Décision à prendre côté toolkit, pas ici : si le schéma déménage, `$schema` change dans
`.conventional-comments.example.json` **et** dans `specifications-fr.md` (ligne 846).

Source : `packages/core/src/config/schema.ts`.

### `/release-notes/v1/` · `/fr/notes-de-version/v1/`

**Travail :** dire ce qui a changé, version après version, à qui met à jour.

Reprend le modèle de [justdummies.io](https://justdummies.io/release-notes/lib/v1/) — le
site frère, même pile Astro + Cloudflare : une colonne d'index à gauche, les versions de la
plus récente à la plus ancienne, chacune avec sa date, sa maturité, une tagline en italique,
et des rubriques `✨ Nouveautés` / `🐛 Corrections` / `🔧 Changements`.

**La source existe déjà et est bilingue :** `docs/release-notes-1.x-fr.md` et
`-en.md`, des versions rédigées pour le lecteur plutôt que dérivées des commits. Le
`CHANGELOG.md` reste le relevé technique, lié depuis la page.

**Différence assumée avec justdummies :** là-bas quatre paquets NuGet distincts justifient
quatre « trains » de version dans la colonne de gauche. Ici tout sort sous un numéro unique
— l'extension et `core/` partagent le même numéro de version — donc inventer des trains
serait faux. La colonne de gauche porte l'index des versions de la page, ce qui est utile
sur une page longue, et la ligne de version en tête. Elle accueillera des lignes
supplémentaires le jour où les composants divergeront, ou à la v2.

Le schéma de justdummies vaut d'être copié si la génération arrive : `index.json` +
`majors/{train}-v{major}.{locale}.json`, avec `summaryHtml`, `sections[].label`,
`sections[].anchor` et `items[]` en HTML.

Source : `docs/release-notes-1.x-{fr,en}.md`, `CHANGELOG.md`.

### `/version` · `/fr/version` — non liée, volontairement

**Travail :** répondre à « qu'est-ce qui est en ligne, exactement ». Reprise de la page
équivalente de justdummies.io.

**Aucun lien du site n'y mène** — ni en-tête, ni pied de page, ni plan du site. On y arrive
en tapant l'adresse. C'est une page d'exploitation, pas de contenu : elle sert à un
mainteneur qui vérifie ce qu'un visiteur reçoit, pas à un visiteur.

Trois faits, dans cet ordre : le **tag de release** dont vient ce build, le **commit** en
entier avec ses sept premiers caractères lisibles, et l'**heure de build** en UTC. Puis ce
que la dernière release a changé, puis les cinq précédentes, puis un lien vers les suivantes
sur GitHub.

**Deux règles reprises de justdummies, et qui sont l'essentiel :**

1. **Le fichier est écrit par le build, depuis git — jamais par le job de déploiement.**
   Le déploiement publie l'artefact qu'il a téléchargé et ne reconstruit rien, précisément
   pour que rien n'atteigne la production sans avoir été vérifié. Un fichier écrit après la
   vérification serait le seul octet de l'envoi qu'aucun contrôle n'aurait jamais vu.
2. **La page et l'endpoint `/version.json` servent le même fichier.** Une page qui affiche
   la version et un endpoint qui la sert ne doivent pas pouvoir nommer deux builds
   différents.

Corollaire : **chaque** build en produit un, pas seulement un build de release. Un fichier
qui n'existe que parfois est un fichier que chaque lecteur doit tester ; et `release: null`
dit « ceci n'est pas une release » plus utilement qu'un 404.

Rien du site n'y mène, et un invariant le vérifie plutôt que de s'en remettre à la
vigilance : on tape l'adresse, ou on ne la trouve pas. C'est une page d'exploitation.

### `/sitemap-index.xml` · `/robots.txt` · `/404`

Sitemap généré par Astro, alternats `hreflang` inclus. La 404 renvoie vers `/docs/`, pas
vers l'accueil.

---

## 4. Bilinguisme

Astro i18n, `defaultLocale: "en"`, `prefixDefaultLocale: false` : l'anglais sert `/`, le
français `/fr/`.

Trois exigences qui coûtent cher si on les ajoute après coup :

1. **Les segments d'URL sont traduits** (`/docs/configure/` ↔ `/fr/docs/configuration/`).
   Sans cela le site est bilingue en surface seulement.
2. **Le sélecteur de langue conserve la page courante** — jamais un renvoi à l'accueil.
3. **Alternats `hreflang` + `x-default` vers l'anglais** dès la première mise en ligne.

Les identifiants de labels restent en anglais dans les deux versions : c'est déjà la règle
du toolkit (§10, Internationalisation), et ce sont des jetons de grammaire, pas du texte.

---

## 5. Navigation

**En-tête :** marque · `how it works:` · `platforms:` · `docs:` · GitHub · sélecteur EN/FR
· bouton **« Adopt it in your team »**.

Écarté : `how it holds:`. Joli, et incompréhensible pour qui découvre le site.

« Installer l'extension » n'est **pas** dans l'en-tête : le bouton y invite à l'adopter en
équipe, parce que le site s'adresse à qui décide pour une équipe. La raison donnée à
l'origine — ne pas réduire le produit à une extension avec un serveur en option — est
tombée avec le serveur : l'extension est désormais tout le produit.

**Pied de page :** mention d'indépendance, licence Apache-2.0, Reefact, lien dépôt, lien
schéma.

---

## 6. Réservé pour plus tard

Hors périmètre, mais à garder libre dans l'arborescence.

### `/playground/` — le verdict en direct

On colle un commentaire, on voit le verdict, les codes de diagnostic et la correction
proposée.

L'argument décisif : **c'est gratuit sur un site statique**. `@cct/core` ne fait aucune
entrée-sortie et ne touche pas au DOM — l'architecture en fait une garantie explicite —
donc le parseur et le validateur tournent tels quels dans le navigateur, sans serveur ni
API. Aucune démonstration ne convainc un tech lead aussi vite que de voir sa propre
formulation refusée, puis corrigée.

### `/changelog/` — versions et compatibilité

Généré depuis `CHANGELOG.md` au build. Sa vraie utilité n'est pas l'historique : c'est de
donner une adresse stable à `coreMinVersion`, la clé par laquelle une organisation impose
une version de `core/` — donc la seule page qu'un administrateur reviendra consulter.

---

## 7. À trancher avant d'écrire du code

- [ ] **Décider du sort de `conventional-comments-toolkit.dev`** et du déménagement du
      schéma.
- [ ] **Arbitrer la source de vérité de la doc.** Douze pages traduites qui reformulent des
      fichiers `-fr.md` divergeront. Deux options tenables : le site importe le dépôt au
      build, ou il assume d'être la version lisible et le dépôt garde la version
      normative.
- [ ] **Confirmer que les 19 teintes tiennent sur `#EEF1F5`.** Elles sont mesurées contre
      les neuf fonds Primer, pas contre le papier du site.
