# Découpage en pages — conventionalcomments.io

Chosen scope: **showcase + essential documentation**, bilingual **EN + FR**, aimed at the
**tech lead**. Twelve content routes × two languages, plus the JSON schema.

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

Bypassing is acknowledged · what the extension does when a comment is sent, and what it
does not: **it never blocks a merge**, and a team that wants that constraint uses its
platform's native setting · a single `core/`, which carries the whole grammar · what the
author of a PR actually sees.

The server, A/B parity and the configuration fingerprint, which this page was meant to
explain, disappeared with the verifier (the toolkit's DEC0010).

Source: `docs/architecture-fr.md`, `README.md`, the toolkit's `docs/idr/`.

### `/platforms/` · `/fr/plateformes/`

**Travail :** répondre à « est-ce que ça marche chez nous », et à rien d'autre.

What is **available** — GitHub (github.com, Enterprise Cloud, EMU, Enterprise Server),
Azure DevOps (Services, on `dev.azure.com` only), GitLab (gitlab.com, without blocking),
the browsers · what is **not covered** (Azure DevOps Server and `{org}.visualstudio.com`,
GitLab Self-Managed and Dedicated; Bitbucket is out of scope) and the invitation to ask for
the rest · what it takes to start (the extension alone, which asks for nothing) · which
domains the extension looks at.

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

The 19 labels, in three groups — remarks, review status, replies: icon, colour, blocking by
default, aliases, example, keyboard abbreviation · **what the toolkit adds to Conventional
Comments** (seven labels, `decision` among them), stated without ambiguity · the
`blocking` / `non-blocking` / `if-minor` decorations and free decorations.

Source : `packages/core/src/config/defaults.ts`, `packages/extension/src/ui/strings.ts`.

### `/docs/configure/` · `/fr/docs/configuration/`

Rendre `.conventional-comments.json` évident. Chaque clé · les trois niveaux plancher /
organisation / dépôt · la fusion et l'épinglage · `coreMinVersion` · **le piège
`toolCommands`** (vide par défaut : un `/rebase` est rejeté en `enforce` tant que le dépôt
ne le déclare pas) · lien vers le schéma.

Source : `.conventional-comments.example.json`, `packages/core/src/config/`.

### `/docs/adoption/` · `/fr/docs/adoption/`

La page qu'un tech lead partagera à son équipe.

The path — `assist` everywhere, then `enforce` on a pilot repository, then rollout; the
`warn` mode no longer exists · the **only prerequisite for `enforce`**: a written rollback
procedure, the named person who runs it, and the list of repositories that write
`"mode": "enforce"` themselves · the three-step rollback (floor, organization
configuration, repositories) · the indicators, which cannot be computed yet.

Source : `docs/operations-fr.md`.

### `/docs/enforce/` · `/fr/docs/enforce/`

State exactly what the `enforce` mode does, and what it does not. What it blocks: sending
a non-compliant comment, by click or by keyboard, after re-reading the configuration · what
it does not do: it only applies to people who have the extension, it never blocks a merge,
and it never blocks on GitLab · where to find a merge constraint: in the platform's native
setting.

This page replaces `/docs/server/` · `/fr/docs/serveur/`, which described deploying the
server and then a roadmap; the old addresses redirect to it.

Source: `specifications-fr.md` §5.4, `docs/idr/` (DEC0010, DEC0012).

### `/docs/ai-review/` · `/fr/docs/revue-ia/`

Reviews run or assisted by an agent. The session marker `[session:<id>]` and how it is
rendered · the two skills the toolkit ships, `review-pull-request` and
`respond-to-review`.

Source: `README.md`, `specifications-fr.md` §3.6 and §5.5, `skills/`.

### `/docs/troubleshooting/` · `/fr/docs/diagnostic/`

Absorb support requests before they become issues. The status pill's "Configuration
unread" message · the configuration notices that appear after an update · comments blocked
in `enforce` · tool commands (`/rebase`, bots) · exempt users · the journal and the
diagnostic archive to attach to an issue.

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

A decision for the toolkit, not for this repository: if the schema moves, `$schema`
changes in `.conventional-comments.example.json` **and** in `specifications-fr.md`
(line 846).

Source : `packages/core/src/config/schema.ts`.

### `/release-notes/v1/` · `/fr/notes-de-version/v1/`

**Travail :** dire ce qui a changé, version après version, à qui met à jour.

Reprend le modèle de [justdummies.io](https://justdummies.io/release-notes/lib/v1/) — le
site frère, même pile Astro + Cloudflare : une colonne d'index à gauche, les versions de la
plus récente à la plus ancienne, chacune avec sa date, sa maturité, une tagline en italique,
et des rubriques `✨ Nouveautés` / `🐛 Corrections` / `🔧 Changements`.

**The source already exists and is bilingual:** `docs/release-notes-1.x-fr.md` and
`-en.md`, versions written for the reader rather than derived from commits. `CHANGELOG.md`
remains the technical record, linked from the page.

**A deliberate difference from justdummies:** there, four separate NuGet packages justify
four version "trains" in the left column. Here everything ships under a single number — the
extension and `core/` share the same version number — so inventing trains would be wrong.
The left column carries the index of the page's versions, which helps on a long page, and
the version line at the top. It will take more lines the day the components diverge, or at
v2.

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

"Install the extension" is **not** in the header: the button there invites visitors to
adopt it as a team, because the site speaks to whoever decides for a team. The original
reason — not reducing the product to an extension with an optional server — fell with the
server: the extension is now the whole product.

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
- [ ] **Decide the documentation's source of truth.** Twelve translated pages that rephrase
      `-fr.md` files will drift. Two tenable options: the site imports the repository at
      build time, or it accepts being the readable version while the repository keeps the
      normative one.
- [ ] **Confirm that the 19 hues hold on `#EEF1F5`.** They are measured against the nine
      Primer backgrounds, not against the site's paper.
