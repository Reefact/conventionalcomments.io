# Découpage en pages — conventionalcomments.io

Périmètre retenu : **vitrine + documentation essentielle**, bilingue **EN + FR**, cible
**tech lead**. Onze routes de contenu × deux langues, plus le schéma JSON.

Ce qui relève de la spécification normative, de la matrice `CA-01…CA-39` ou de
l'architecture interne **reste sur GitHub** : le site n'a pas vocation à devenir un
miroir du dépôt.

---

## 1. Vitrine — convertir un responsable

Quatre pages, une par objection.

### `/` · `/fr/` — Accueil

**Travail :** faire admettre qu'une convention peut devenir une contrainte tenue.

Hero (« La convention ne tient pas toute seule ») accompagné du **check de conformité en
échec puis vert** — pas d'une capture de l'extension · le problème · les deux composants
(A assiste / B tranche) · la trajectoire `assist → warn → enforce` · la garantie de
confidentialité · les plateformes · double CTA.

- CTA principal : **« Adopter dans votre équipe »** → `/docs/adoption/`
- CTA secondaire : « Installer l'extension » → `/docs/install/`
- Lien sortant vers `conventionalcomments.org` dans la **première** section (§1.1 de
  l'identité).

Source : `README.md`.

### `/how-it-works/` · `/fr/comment-ca-tient/`

**Travail :** lever l'objection « une extension, ça se désinstalle ».

Le contournement est assumé · le serveur est la source de vérité · la parité A/B **par
construction** (même `core/` des deux côtés) · l'empreinte de configuration et ce qui se
passe en cas d'écart · ce que voit concrètement l'auteur d'une PR.

Source : `docs/architecture-fr.md`, `README.md` §2.

### `/platforms/` · `/fr/plateformes/`

**Travail :** répondre à « est-ce que ça marche chez nous ».

Matrice GitHub.com / GHEC / EMU / GHES et Azure DevOps Services / Server · Chromium et
Firefox · **ce qui diffère sur Azure DevOps** : repli étiquettes du §6.3.2, latence de
détection et la NFR 60 s.

Source : `README.md`, `spikes/p1-prime/`.

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

Les 13 labels : icône, couleur, bloquant par défaut, alias, exemple, abréviation clavier ·
les décorations `blocking` / `non-blocking` / `if-minor` et les décorations libres ·
**pourquoi `decision` existe** (ajout du toolkit, absent de la spécification d'origine).

Source : `packages/core/src/config/defaults.ts`, `packages/extension/src/ui/strings.ts`.

### `/docs/configure/` · `/fr/docs/configuration/`

Rendre `.conventional-comments.json` évident. Chaque clé · les trois niveaux plancher /
organisation / dépôt · la fusion et l'épinglage · `coreMinVersion` · **le piège
`toolCommands`** (vide par défaut : un `/rebase` est rejeté en `enforce` tant que le dépôt
ne le déclare pas) · lien vers le schéma.

Source : `.conventional-comments.example.json`, `packages/core/src/config/`.

### `/docs/adoption/` · `/fr/docs/adoption/`

La page qu'un tech lead partagera à son équipe.

Le calendrier (2 semaines `assist`, 2 à 4 `warn`) · les **trois prérequis à `enforce`** —
`resolverOverrideGroup` désigné, procédure de retour arrière écrite et son exécutant
nommé, check déclaré obligatoire avec interdiction de contournement · les **deux prérequis
Azure DevOps** · le rollback en trois étapes (et pourquoi le repli est `warn`, pas `off`) ·
les indicateurs.

Source : `docs/operations-fr.md`.

### `/docs/server/` · `/fr/docs/serveur/`

Passer du « ça marche chez moi » au « c'est tenu chez nous ». Déployer (Docker) · déclarer
le check obligatoire côté GitHub · la branch policy côté Azure DevOps
(`conventional-comments/compliance`, *Block* et non *Warn*) · l'endpoint d'administration ·
l'exemption gouvernée et auditable.

Source : `docs/deployment-fr.md`, `packages/server/`.

### `/docs/troubleshooting/` · `/fr/docs/diagnostic/`

Absorber le support avant qu'il n'arrive en issue. La bannière « configuration non lue » ·
l'écart d'empreinte avec le serveur · les commandes outils (`/rebase`, bots) · les
utilisateurs exemptés · le statut neutre `grace-expired`.

Source : `packages/extension/src/ui/strings.ts`, `docs/store-listing-en.md`.

---

## 3. Ressources machine — pas des pages

### `/schema/v1.json`

**Le seul contenu du site qui serve tous les jours.** Aujourd'hui le `$schema` du toolkit
pointe vers `https://conventional-comments-toolkit.dev/schema/v1.json`, un domaine qui ne
répond pas. L'héberger ici donne l'autocomplétion et la validation dans l'éditeur à tout
dépôt configuré.

Décision à prendre côté toolkit, pas ici : si le schéma déménage, `$schema` change dans
`.conventional-comments.example.json` **et** dans `specifications-fr.md` (ligne 1005).

Source : `packages/core/src/config/schema.ts`.

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

**En-tête :** marque · `how it holds:` · `platforms:` · `docs:` · GitHub · sélecteur EN/FR
· bouton **« Adopt it in your team »**.

« Installer l'extension » n'est **pas** dans l'en-tête. L'y placer ferait du produit une
extension de navigateur avec un serveur en option — soit l'inverse exact de ce que dit le
§2 du dépôt.

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

- [ ] **Valider ou rejeter le verrou nominal** `toolkit: conventional comments` (§2.2 de
      l'identité). Seul choix qui ne se rattrape pas plus tard.
- [ ] **Décider du sort de `conventional-comments-toolkit.dev`** et du déménagement du
      schéma.
- [ ] **Arbitrer la source de vérité de la doc.** Onze pages traduites qui reformulent des
      fichiers `-fr.md` divergeront. Deux options tenables : le site importe le dépôt au
      build, ou il assume d'être la version lisible et le dépôt garde la version
      normative.
- [ ] **Confirmer que les 13 teintes tiennent sur `#EEF1F5`.** Elles sont mesurées contre
      les neuf fonds Primer, pas contre le papier du site.
