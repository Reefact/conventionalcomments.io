# Identité — conventionalcomments.io

Proposition v1. Rendu visuel complet (marque, palette, spécimens typographiques,
composants montés, mockup du premier écran) :
<https://claude.ai/code/artifact/70e2f349-e416-41f3-8cce-0215c71dd668>

Ce document est la version opposable ; l'artifact est la version regardable.

---

## 1. Positionnement

Le site est la vitrine de [`Reefact/conventional-comments-toolkit`](https://github.com/Reefact/conventional-comments-toolkit).
Il s'adresse en priorité au **tech lead** qui doit décider si Conventional Comments
devient une contrainte tenue dans son organisation — pas au développeur curieux, qui
arrive par l'extension et repart avec.

**La tension à porter, pas à lisser.** Le produit est asymétrique et son README le dit
sans détour : l'extension *assiste* et se contourne **par construction** ; le compagnon
serveur *tranche* et publie un check obligatoire. C'est cette asymétrie qui distingue le
toolkit d'un énième linter de commentaires. Le site doit l'exposer, pas la simplifier en
« un outil qui aide à écrire de meilleurs commentaires ».

**Phrase d'accueil.**

> « La convention ne tient pas toute seule. »
> *Le toolkit l'assiste dans l'éditeur, et la vérifie sur le serveur. Un fil bloquant non
> résolu empêche la fusion — que l'extension soit installée ou non.*

Version anglaise : *“A convention doesn't hold on its own.”*

### 1.1 Filiation `.org` / `.io`

Deux domaines à une lettre d'écart : c'est la première chose qu'un visiteur doit
comprendre, et la première qu'une identité mal réglée rend ambiguë. Le site ne parle
jamais au nom de la spécification. Trois règles opposables :

1. **Mention d'indépendance en pied de chaque page** — « Outillage indépendant. La
   spécification vit sur conventionalcomments.org. »
2. **Lien sortant vers la spec dans la première section de l'accueil**, pas enterré en bas.
3. **Aucun mimétisme visuel du `.org`** — ni ses avatars *Alice* / *Cheshire*, ni sa mise
   en page. La proximité de nom se compense par une distance graphique nette.

---

## 2. Marque

### 2.1 Le signe

Hérité de `assets/branding/cct-icon-*-base.png` du dépôt toolkit — bulle, chevrons, coche
cerclée — aplati pour l'écran : ni dégradé, ni volume, ni fond bleu. Objectif : que
l'extension dans une barre d'outils et l'onglet du site se lisent comme la même chose.

Trois rendus, comme dans le toolkit, parce que le dessin se simplifie quand la surface
diminue :

| Taille    | Dessin                                                     |
| --------- | ---------------------------------------------------------- |
| ≥ 48 px   | complet — bulle, chevrons, trois barres, coche cerclée      |
| 32 px     | intermédiaire — bulle, chevrons, coche cerclée              |
| ≤ 16 px   | silhouette pleine + pastille de coche, sans détail interne  |

La coche est **le seul élément vert de la marque** : c'est un verdict, pas une couleur
d'accompagnement. La découpe derrière la pastille prend la couleur de surface du thème
(`--mark-knock`) — la marque ne transporte jamais de blanc en dur.

### 2.2 Le verrou nominal (le pari de cette proposition)

> **`toolkit:` conventional comments**

Le nom s'écrit dans la grammaire que le produit enseigne : une étiquette encadrée, un
deux-points, un sujet. `toolkit` est rendu comme un badge de label ; `conventional
comments` comme le sujet, en mono.

C'est **le seul choix de cette proposition qui ne se rattrape pas plus tard** : palette,
typographie et composants tiennent sans lui. À valider ou rejeter en premier.

Le verrou d'en-tête, lui, reste sobre : marque + `conventionalcomments` en Archivo 700 +
`.io` en gris.

---

## 3. Les quatre règles

Aucune n'est un goût personnel : chacune existe déjà dans le code du toolkit. L'identité
se contente de les tenir à l'échelle d'un site.

### 3.1 La couleur cerne, jamais elle ne remplit

Au repos, une teinte de label ne touche que `border-color`. C'est littéralement ce que
fait `packages/extension/src/styles.css`, et `packages/core/src/config/defaults.ts`
explique pourquoi : le texte reste la couleur de la page, donc le critère applicable n'est
pas le 4,5:1 du texte mais le **3:1 de bordure (WCAG 2.1 SC 1.4.11)**.

Conséquence de design : treize couleurs cohabitent sans qu'aucune ne crie. Le remplissage
est réservé aux verdicts.

### 3.2 Le mono est la part machine

Tout ce qu'une machine parse est en IBM Plex Mono : labels, décorations, clés de
configuration, routes, hexadécimaux, références `§`, ligne `cc/1`. Tout ce qu'un humain lit
est en Plex Sans.

**Jamais de mono décoratif.** Sinon la distinction cesse de vouloir dire quelque chose — et
c'est précisément la promesse du produit qui s'abîme.

### 3.3 Trois états, pas un de plus

`conforme` · `avertissement` · `bloquant`. Pas de « nouveau », pas de « bientôt », pas de
pastille d'ambiance. Si un élément porte un état, c'est l'un de ces trois, avec sa forme
(fond teinté + bordure, angles droits) et sa couleur fixes. C'est le vocabulaire que
l'utilisateur retrouvera dans sa PR.

### 3.4 Le deux-points est le pivot

Dans la grammaire, `:` sépare l'étiquette du propos. Sur le site il devient la ponctuation
de service : chaque sur-titre s'y termine, chaque entrée de navigation aussi
(`how it holds:`, `platforms:`, `docs:`). Signature typographique gratuite, exacte, et
impossible à confondre avec un autre site d'outillage.

---

## 4. Palette

### 4.1 Châssis — cinq teintes

| Nom          | Hex       | Rôle                                                        |
| ------------ | --------- | ----------------------------------------------------------- |
| Encre        | `#0B1522` | Texte, et fond du thème sombre. Noir bleuté, jamais neutre.  |
| Papier       | `#EEF1F5` | Fond clair, gris tiré vers l'accent — choisi, pas hérité.    |
| Bleu chevron | `#1E44C8` | Accent unique. Outremer pigmentaire, pas le bleu SaaS.       |
| Conforme     | `#1F8A4C` | Verdict vert. Jamais employé comme couleur de marque.        |
| Bloquant     | `#E04E45` | Le hex exact du label `issue`. Reprise, pas invention.       |

### 4.2 Spectre — les treize labels

Ce ne sont **pas** des couleurs redessinées : ce sont exactement celles de
`packages/core/src/config/defaults.ts`, déjà mesurées contre neuf fonds Primer (clair,
sombre, *dark-dimmed*) au seuil 3:1 de bordure. Elles sont donc réutilisables telles
quelles dans les deux thèmes du site.

| Label        | Icône | Hex       | Défaut                | Abrév. |
| ------------ | :---: | --------- | --------------------- | ------ |
| `praise`     | 🎉    | `#36933B` | —                     | `?pr`  |
| `nitpick`    | 🔍    | `#76818E` | toujours non-bloquant | `?ni`  |
| `suggestion` | 💡    | `#B07600` | —                     | `?su`  |
| `issue`      | 🔨    | `#E04E45` | bloquant par défaut   | `?i`   |
| `todo`       | 📌    | `#D95800` | bloquant par défaut   | `?to`  |
| `question`   | ❓    | `#197EF5` | —                     | `?que` |
| `thought`    | 💭    | `#9368E3` | toujours non-bloquant | `?th`  |
| `chore`      | 🧹    | `#A97735` | bloquant par défaut   | `?ch`  |
| `note`       | 📝    | `#1F8E96` | toujours non-bloquant | `?no`  |
| `decision`   | 🏁    | `#936DD4` | toujours non-bloquant | `?de`  |
| `typo`       | 🔤    | `#CC549C` | désactivé             | `?ty`  |
| `polish`     | ✨    | `#0C8E9A` | désactivé             | `?po`  |
| `quibble`    | 🫶    | `#61896C` | désactivé             | `?qui` |

Les émojis sont le champ `icon` de chaque label : **de la donnée produit, pas de
l'ornement**. Ils n'apparaissent nulle part ailleurs sur le site.

`decision` est un **ajout du toolkit**, absent de la spécification d'origine. Il mérite sa
propre explication en page de référence, pas une ligne de tableau.

### 4.3 Réserve

Les treize teintes sont mesurées contre les fonds Primer, **pas contre `#EEF1F5`**. Porter
dans le site un test équivalent à celui de `packages/core/test/config.test.ts` avant la
mise en ligne.

---

## 5. Typographie

Trois voix, parce que le produit en distingue trois. Les trois familles sont sur Google
Fonts.

| Rôle                        | Famille            | Emploi                                              |
| --------------------------- | ------------------ | ---------------------------------------------------- |
| Titres, signalétique        | **Archivo** 600–700 | `h1` `clamp(30–42px)/−0.028em` · `h2` `clamp(23–31px)/−0.022em` |
| Prose, interface            | **IBM Plex Sans** 400–600 | corps 16px/1,62, mesure 68ch · chapô 18px |
| La part machine (§3.2)      | **IBM Plex Mono** 400–600 | sur-titres 11,5px/0,13em caps · code 14px · navigation |

Archivo écarte volontairement Inter et Space Grotesk, devenus le défaut de tout outil pour
développeurs. Plex Sans et Plex Mono forment une superfamille : elles s'alignent
nativement, ce qui rend la règle §3.2 lisible plutôt que bruyante.

---

## 6. Composants

Cinq objets suffisent à tout le site. Ils reprennent l'interface réelle du toolkit : un
lecteur qui les voit sur le site les retrouve à l'identique dans sa pull request.

| Composant             | Forme                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **Badge de label**    | Pilule, bordure teintée, fond transparent, texte à la couleur de page. Les décorations sont des marqueurs neutres accolés — jamais des badges concurrents. |
| **Verdict**           | Angles droits, fond teinté + bordure. *Le seul composant autorisé à porter un fond coloré (§3.1).* La forme le distingue d'un label avant même la couleur. |
| **Trajectoire**       | `assist` → `warn` → `enforce`, trois colonnes, filet de couleur en tête. Seule séquence numérotable du site : l'ordre y porte une information réelle. |
| **Bloc de grammaire** | Label en accent, décoration en gris, **deux-points en rouge bloquant** — le pivot est la seule ponctuation colorée du site. |
| **Check de conformité** | Deux lignes (échec / succès) + la ligne machine `cc/1 core=… mode=… blocking=… configFingerprint=…`. |

**Le check, pas l'extension, doit occuper le premier écran de l'accueil.** C'est la seule
preuve visuelle que la convention est *tenue* et pas seulement *suggérée*.

---

## 7. Voix

La documentation du toolkit est précise, se corrige à voix haute et nomme ses limites.
C'est un actif de crédibilité rare ; le site le perdrait en basculant dans le registre
commercial. Trois arbitrages, à appliquer aux deux langues.

| Jamais | Plutôt | Pourquoi |
| --- | --- | --- |
| « Révolutionnez vos revues de code ! » | « Un fil bloquant non résolu empêche la fusion. » | Promettre un changement d'état d'esprit quand le produit promet un statut de PR. |
| « Fonctionne partout, sans configuration. » | « Sur Azure DevOps, la provenance des étiquettes n'est pas établie : le repli documenté s'applique. » | Faux : deux prérequis AzDO restent ouverts. Nommer une limite est ce qui rend le reste croyable. |
| « Vos données sont en sécurité. » | « Aucun contenu de commentaire, de code ou de diff ne quitte le navigateur. Les préférences, elles, se synchronisent si Chrome Sync est actif. » | Formule creuse — et le dépôt a déjà corrigé une version trop absolue de cette phrase. |

---

## 8. Jetons

Voir [`tokens.css`](./tokens.css) : palette complète en trois états de thème (clair,
`prefers-color-scheme: dark` non stampé, `[data-theme]` explicite), prêt à importer dans
le projet Astro.
