# Identité — conventionalcomments.io

Proposition v1. Rendu visuel complet (marque, palette, spécimens typographiques,
composants montés, mockup du premier écran) :
<https://claude.ai/code/artifact/70e2f349-e416-41f3-8cce-0215c71dd668>

Ce document est la version opposable ; l'artifact est la version regardable.

---

## 1. Positionnement

Le site est la vitrine de [`Reefact/conventional-comments-toolkit`](https://github.com/Reefact/conventional-comments-toolkit).
Il vise le **tech lead** qui décide pour son équipe — mais l'argument qui le convainc n'est
pas celui qu'on croit.

**Le sujet est humain avant d'être procédural.** Ce qui abîme une revue de code, ce n'est
pas l'absence de format : c'est que *le ton ne s'écrit pas*. « Ce nom de variable ne veut
rien dire » n'a pas d'intonation, pas de visage, pas de haussement d'épaules. Lu un
vendredi soir après deux jours sur la PR, ça s'entend comme un reproche. Quatre
malentendus reviennent sans cesse, et aucun ne vient d'un désaccord technique :

> « Il m'engueule ? » · « Je dois le faire, ou pas ? » · « Je suis si mauvais que ça ? » ·
> « Je n'ose plus rien dire. »

**Ce que la convention règle.** Elle ne demande pas d'arrondir ses phrases. Elle demande
d'écrire devant chaque commentaire le mot qui dit à quel titre on le dit. D'où la formule
qui tient lieu de thèse au site :

> **L'étiquette ne change pas ce que vous dites. Elle dit comment le lire.**

**Le point qu'on ne voit pas tout de suite, et qui mérite sa propre section.** L'effort est
demandé au **relecteur**, pas à celui qui reçoit. Écrire `nitpick:` devant sa propre
remarque, c'est admettre soi-même que c'est un détail : le relecteur se désarme avant
d'être lu. Écrire `praise:` demande de s'arrêter trois secondes sur ce qui va bien, ce que
personne ne fait spontanément. C'est pour ça que la convention adoucit les revues **sans
les édulcorer** — et c'est l'argument le plus fort du site.

**Phrase d'accueil.**

> « C'est une remarque, ou un reproche ? »
> *En revue de code, le ton ne s'écrit pas. La même phrase peut être un coup de main ou une
> pique, selon l'humeur de celui qui la lit. Conventional Comments règle ça d'une façon
> presque bête : chaque commentaire dit d'abord ce qu'il est.*

Version anglaise : *“Is that feedback, or a dig?”*

**Deux versions écartées, et pourquoi.**

| Version | Ce qui n'allait pas |
| --- | --- |
| « La convention ne tient pas toute seule. » | Ouvre sur la thèse du produit. Suppose qu'on sait déjà ce qu'est la convention. Parle à quelqu'un qui a lu la spécification. |
| « Ce commentaire bloque la PR, ou pas ? » | Correcte et compréhensible, mais procédurale : elle réduit le sujet à une question de fusion. Le lecteur n'a pas mal parce qu'une PR est bloquée ; il a mal parce qu'il croit qu'on lui en veut. |

**L'outil arrive après la convention, et il n'est jamais la thèse.** Il entre en sixième
section, sous un titre qui dit à quoi il sert : *une bonne habitude s'oublie en trois
jours*. L'extension — qui est désormais tout le produit : le serveur et le vérificateur
ont été abandonnés — y est présentée comme **un pense-bête qui ne se fatigue pas**, jamais
comme une police. Elle signale, elle n'empêche pas une fusion ; l'accueil doit donner
envie d'essayer la convention, pas peur de l'outil.

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

#### L'icône d'onglet, et la carte sociale

La marque complète ne descend pas à 16 px : rendue côte à côte avec une variante
simplifiée à 16, 20, 24 et 32 px, elle s'y effondre en bouillie — les chevrons se ferment,
la pastille de validation devient une tache. L'icône d'onglet est donc **la bulle et les
chevrons seuls**, plus épais et plus près des bords. La pastille revient sur
`apple-touch-icon.png`, où 180 px lui laissent la place. C'est de l'optique, pas une
deuxième marque : la même forme, dessinée pour la taille où elle sera vue.

`favicon.svg` porte un `prefers-color-scheme`, qui suit le thème du navigateur — donc
celui de sa barre d'onglets. L'icône ne peut pas disparaître dans son propre fond.

La **carte sociale** (`og-en.png`, `og-fr.png`) ne montre pas un logo : elle montre la
thèse. Le bandeau, la question en Archivo, et dessous le commentaire préfixé
`nitpick (non-blocking):` — c'est-à-dire la démonstration du site en une image. Une par
langue, parce qu'une question posée en anglais sous un lien français ne pose rien.

### 2.2 Le verrou-grammaire (gardé, non employé)

> **`toolkit:` conventional comments**

Le nom s'écrit dans la grammaire que le produit enseigne : une étiquette encadrée, un
deux-points, un sujet. `toolkit` est rendu comme un badge de label ; `conventional
comments` comme le sujet, en mono.

**Il n'est employé nulle part sur le site**, et c'est délibéré : l'en-tête utilise le
verrou sobre — marque + `conventionalcomments` en Archivo 700 + `.io` en gris. L'idée que
le nom s'écrive dans sa propre grammaire ne se comprend que si on connaît déjà la
convention, ce qui est précisément le travers que le §7.2 interdit. Le premier écran de
l'accueil porte la même idée en la *démontrant* plutôt qu'en la signant.

Gardé ici comme piste, pour une carte de conférence ou un sticker — un contexte où le
lecteur connaît déjà. Jamais en en-tête de page.

---

## 3. Les quatre règles

Aucune n'est un goût personnel : chacune existe déjà dans le code du toolkit. L'identité
se contente de les tenir à l'échelle d'un site.

### 3.1 La couleur cerne, jamais elle ne remplit

Au repos, une teinte de label ne touche que `border-color`. C'est littéralement ce que
fait `packages/extension/src/styles.css`, et `packages/core/src/config/defaults.ts`
explique pourquoi : le texte reste la couleur de la page, donc le critère applicable n'est
pas le 4,5:1 du texte mais le **3:1 de bordure (WCAG 2.1 SC 1.4.11)**.

Conséquence de design : dix-neuf couleurs cohabitent sans qu'aucune ne crie. Le remplissage
est réservé aux verdicts.

### 3.2 Le mono est la part machine

Tout ce qu'une machine parse est en IBM Plex Mono : labels, décorations, clés de
configuration, routes, hexadécimaux, références `§`. Tout ce qu'un humain lit
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
(`how it works:`, `platforms:`, `docs:`). Signature typographique gratuite, exacte, et
impossible à confondre avec un autre site d'outillage.

**Le site porte donc deux deux-points aux règles opposées, et les confondre est un bug.**
En français, celui de la prose prend une espace insécable — `plateformes :`, `doc :`. Celui
de la grammaire n'en prend **jamais** : `issue: sujet` est un jeton, et `issue : sujet` ne
passe pas le parseur. La frontière est nette et mécanisable : tout ce qui est en Plex Mono
au titre de la règle §3.2 suit la typographie du code, jamais celle du français. Un
composant `<Eyebrow>` qui insère l'espace selon la locale, et un composant `<Token>` qui ne
l'insère jamais, suffisent à ce que la règle tienne sans vigilance humaine.

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

### 4.2 Spectre — les dix-neuf labels

Ce ne sont **pas** des couleurs redessinées : ce sont exactement celles de
`packages/core/src/config/defaults.ts`, déjà mesurées contre neuf fonds Primer (clair,
sombre, *dark-dimmed*) au seuil 3:1 de bordure. Elles sont donc réutilisables telles
quelles dans les deux thèmes du site.

| Label        | Icône | Hex       | Type     | Défaut                | Abrév. |
| ------------ | :---: | --------- | -------- | --------------------- | ------ |
| `praise`     | 👏    | `#36933B` | `remark` | —                     | `?pr`  |
| `nitpick`    | 🔍    | `#76818E` | `remark` | toujours non-bloquant | `?ni`  |
| `suggestion` | 💡    | `#B07600` | `remark` | —                     | `?su`  |
| `issue`      | 🔨    | `#E04E45` | `remark` | bloquant par défaut   | `?i`   |
| `todo`       | 📌    | `#D95800` | `remark` | bloquant par défaut   | `?to`  |
| `question`   | ❓    | `#197EF5` | `remark` | —                     | `?que` |
| `thought`    | 💭    | `#9368E3` | `remark` | toujours non-bloquant | `?th`  |
| `chore`      | 🧹    | `#A97735` | `remark` | bloquant par défaut   | `?ch`  |
| `note`       | 📝    | `#1F8E96` | `remark` | toujours non-bloquant | `?no`  |
| `typo`       | 🔤    | `#CC549C` | `remark` | —                     | `?ty`  |
| `polish`     | ✨    | `#0C8E9A` | `remark` | —                     | `?po`  |
| `quibble`    | 🪶    | `#61896C` | `remark` | désactivé             | `?qui` |
| `summary`    | 📋    | `#B160C9` | `status` | toujours non-bloquant | `?sum` |
| `reviewed`   | 🎉    | `#D04A7A` | `status` | toujours non-bloquant | `?r`   |
| `thanks`     | 🤝    | `#9C8C1A` | `reply`  | toujours non-bloquant | `?thx` |
| `done`       | ✅    | `#6B8E23` | `reply`  | toujours non-bloquant | `?do`  |
| `ack`        | 👌    | `#6A7FDB` | `reply`  | toujours non-bloquant | `?a`   |
| `decision`   | ⚖️    | `#936DD4` | `reply`  | toujours non-bloquant | `?de`  |
| `disagree`   | ✋    | `#8A7B6E` | `reply`  | toujours non-bloquant | `?di`  |

L'ordre est celui de la barre d'outils de l'extension : les remarques, puis les états de
la revue, puis les réponses.

Les émojis sont le champ `icon` de chaque label : **de la donnée produit, pas de
l'ornement**. Ils n'apparaissent nulle part ailleurs sur le site.

Sept labels sont des **ajouts du toolkit**, absents de Conventional Comments : `decision`,
`summary`, `reviewed`, `thanks`, `done`, `ack` et `disagree`. Ils méritent leur propre
explication en page de référence, pas seulement une ligne de tableau — et le site ne doit
jamais laisser croire qu'ils font partie de la convention.

### 4.3 Réserve

Les dix-neuf teintes sont mesurées contre les fonds Primer, **pas contre `#EEF1F5`**. Porter
dans le site un test équivalent à celui de `packages/core/test/config.test.ts` avant la
mise en ligne.

---

## 5. Typographie

Trois voix, parce que le produit en distingue trois. Les trois familles sont libres
(SIL Open Font License) et **servies par le site lui-même**, jamais par un CDN : une
page qui promet qu'aucune dépendance n'est chargée depuis un CDN ne peut pas faire
partir une requête vers Google à chaque visite. Détail dans `src/styles/fonts.css`.

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

Quatre objets suffisent à tout le site — un cinquième, le check de conformité, a été retiré. Ils reprennent l'interface réelle du toolkit : un
lecteur qui les voit sur le site les retrouve à l'identique dans sa pull request.

| Composant             | Forme                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **Badge de label**    | Pilule, bordure teintée, fond transparent, texte à la couleur de page. Les décorations sont des marqueurs neutres accolés — jamais des badges concurrents. |
| **Verdict**           | Angles droits, fond teinté + bordure. *Le seul composant autorisé à porter un fond coloré (§3.1).* La forme le distingue d'un label avant même la couleur. |
| **Trajectoire**       | `assist` partout → `enforce` sur un dépôt pilote → généralisation, en colonnes, filet de couleur en tête. Seule séquence numérotable du site : l'ordre y porte une information réelle. Le mode `warn` n'existe plus. |
| **Bloc de grammaire** | Label en accent, décoration en gris, **deux-points en rouge bloquant** — le pivot est la seule ponctuation colorée du site. |
| **Check de conformité** | *Retiré.* Il figurait le statut publié par le vérificateur ; le toolkit a abandonné le vérificateur, et le site ne montre plus ce composant. |

**Le premier écran de l'accueil montre un commentaire, pas un contrôle.** La première
version de ce document y plaçait le check de conformité, « seule preuve que la convention
est tenue » ; cette preuve n'existe plus, puisque le produit signale et n'empêche pas une
fusion.

---

## 7. Voix

La documentation du toolkit est précise, se corrige à voix haute et nomme ses limites.
C'est un actif de crédibilité rare ; le site le perdrait en basculant dans le registre
commercial. Trois arbitrages, à appliquer aux deux langues.

| Jamais | Plutôt | Pourquoi |
| --- | --- | --- |
| « Révolutionnez vos revues de code ! » | « Un fil bloquant non résolu reste affiché dans le bandeau tant qu'il n'est pas résolu. » | Promettre un changement d'état d'esprit quand le produit promet un signalement — et surtout pas un blocage de fusion, qu'il ne fait pas. |
| « Fonctionne partout, sans configuration. » | « Sur GitLab, l'extension ne lit pas encore la configuration du dépôt : elle n'y bloque jamais un commentaire. » | Faux : GitLab n'est couvert que sur gitlab.com, Azure DevOps que sur dev.azure.com. Nommer une limite est ce qui rend le reste croyable. |
| « Vos données sont en sécurité. » | « Aucun contenu de commentaire, de code ou de diff ne quitte le navigateur. Les préférences, elles, se synchronisent si Chrome Sync est actif. » | Formule creuse — et le dépôt a déjà corrigé une version trop absolue de cette phrase. |

---

### 7.1 Parler de la revue, pas du pipeline

Le sujet du site est une relation entre deux personnes. Le vocabulaire suit : on parle de
ce que l'auteur **entend**, pas de ce que le validateur **calcule**. « Ce que l'auteur
entend » plutôt que « verdict ». « Un point important ne se perd pas » plutôt que
« critère 2 ». Le vocabulaire de contrainte — obligatoire, refusé, bloqué — n'apparaît
qu'à partir de la section adoption, et toujours après avoir dit que c'est un choix
d'équipe.

Corollaire : **ne jamais donner de leçon de savoir-vivre.** Le site ne dit pas d'être
bienveillant, ne suggère pas d'émojis, ne recommande pas de commencer par un compliment.
Il montre la même phrase avec et sans étiquette, et laisse le lecteur constater.

### 7.2 Écrire pour quelqu'un qui ne connaît pas

Le premier écran ne suppose jamais la convention connue. Trois règles, tirées d'un ratage
réel de la première maquette :

- **Nommer le sujet avant d'argumenter.** Une page qui ouvre sur « l'extension assiste, le
  serveur vérifie » décrit les pièces d'une chose qu'elle n'a jamais présentée. Le lecteur
  ne sait ni ce qu'est Conventional Comments, ni pourquoi il devrait s'en soucier.
- **Montrer avant de définir.** Un commentaire ambigu, puis le même commentaire étiqueté :
  personne n'a besoin qu'on lui explique la différence. C'est le rôle du bloc avant/après
  du premier écran.
- **Aucun terme de spécification en première lecture.** « fil bloquant », « critère 2 »,
  « compagnon serveur », « décoration », « zone » : chacun se dit d'abord en français
  courant, et ne prend son nom exact qu'en page de référence.

### 7.3 Le français s'écrit, il ne se traduit pas

La version française de la première maquette était un mot-à-mot, et ça se voyait :
« l'extension assiste dans l'éditeur » (assiste **quoi** ?), « publie un statut
obligatoire » (c'est la *vérification* qui est requise, pas le statut), « compagnon
serveur » (calque de *server companion*, qui ne veut rien dire).

- **Le vocabulaire est celui de l'interface, pas celui de la spécification.** GitHub dit
  *conversation* et *vérification* en français — pas « fil » ni « check ».
- **La phrase française n'a pas le rythme de l'anglaise.** Une subordonnée anglaise devient
  souvent deux phrases en français. Traduire la structure produit des phrases sans sujet.
- **On écrit d'abord la langue qui doit convaincre**, puis on écrit l'autre — on ne la
  traduit pas. Aucune des deux n'est la source.

## 8. Bilinguisme

Anglais à la racine, français sous `/fr/` (voir
[`decoupage-pages-fr.md`](./decoupage-pages-fr.md) §4). Quatre points relèvent de
l'identité, pas de la traduction :

1. **Les identifiants de labels restent en anglais dans les deux versions.** `issue`,
   `nitpick`, `blocking` sont des jetons de grammaire, pas du texte — c'est déjà la règle
   du toolkit (§10, Internationalisation). Seules les descriptions et les infobulles sont
   traduites, et le site reprend alors **les chaînes réelles de `strings.ts`** plutôt que
   de retraduire : il doit montrer les mots que l'extension affiche.
2. **Les deux deux-points** — voir §3.4.
3. **Les segments d'URL sont traduits** (`/docs/configure/` ↔ `/fr/docs/configuration/`).
   Un site bilingue dont les routes ne le sont pas ne l'est qu'en surface.
4. **Le sélecteur conserve la page courante.** Il bascule la locale, jamais la position.
   Un renvoi à l'accueil est la façon la plus rapide de faire abandonner un lecteur au
   milieu d'une page de référence.

## 9. Jetons

Voir [`tokens.css`](./tokens.css) : palette complète en trois états de thème (clair,
`prefers-color-scheme: dark` non stampé, `[data-theme]` explicite), prêt à importer dans
le projet Astro.
