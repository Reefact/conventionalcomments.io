# Schéma de configuration

`v1.json` décrit `.conventional-comments.json`, le fichier qu'un dépôt place sur sa branche
par défaut pour configurer
[conventional-comments-toolkit](https://github.com/Reefact/conventional-comments-toolkit).

Le fichier vit dans `public/schema/v1.json` et Astro copie `public/` à la racine du site :
il est donc servi tel quel à **`https://conventionalcomments.io/schema/v1.json`**.

Ce document, lui, est resté dans `docs/`. Il y a été déplacé après avoir passé un temps
dans `public/schema/`, d'où il était **servi publiquement** : une note de maintenance en
ligne, sur une URL que personne n'avait décidé de publier. `scripts/check-site.mjs` refuse
désormais tout `.md`, `.mjs` ou `.ts` dans `dist/`, pour que ça ne se reproduise pas.

`public/_headers` donne au schéma les deux en-têtes dont il a besoin :
`Access-Control-Allow-Origin: *`, sans quoi un éditeur qui tourne dans un navigateur voit
sa requête refusée et perd l'autocomplétion sans dire pourquoi, et un `Cache-Control` d'une
heure au lieu de la revalidation à chaque ouverture de fichier que Cloudflare applique par
défaut.

## Statut : provisoire

**Ce fichier est un bouche-trou.** La cible est de le produire depuis le dépôt du toolkit
au moment du build, pas de le maintenir à la main ici. Il existe pour trois raisons :
donner tout de suite l'assistance dans l'éditeur, fixer l'URL publique avant que des dépôts
ne commencent à s'y référer, et servir de cible de comparaison au script de contrôle.

Ne l'éditez pas en comptant que ça survive. Une clé qui manque se corrige **dans le
toolkit**, et se répercute ici.

Deux façons de faire la bascule, quand elle viendra :

| Approche | Ce que ça implique |
| --- | --- |
| Le toolkit publie le schéma | Il devient un artefact de release, le site le récupère à la version épinglée. C'est le plus propre : le dépôt qui détient la vérité détient aussi le fichier. |
| Le site le génère au build | Le toolkit est un submodule ou une dépendance npm, un script émet le JSON depuis `schema.ts`. Demande de rendre `schema.ts` déclaratif, ou d'y ajouter une table décrivant chaque clé. |

Dans les deux cas, `scripts/check-schema.mjs` reste utile — il devient la vérification que
la génération n'a rien perdu.

## À quoi ça sert

Un dépôt met cette URL en première ligne de sa configuration :

```json
{
  "$schema": "https://conventionalcomments.io/schema/v1.json",
  "version": 1,
  "mode": "assist"
}
```

VS Code, IntelliJ et les autres la téléchargent alors tout seuls, et pendant qu'on édite le
fichier : complètent les noms de clés, affichent la description au survol, et soulignent
`"mode": "enforc"` avant le commit.

C'est le seul contenu du site qui serve **tous les jours**, à des gens qui ne le visitent
jamais.

## Ce que c'est, et ce que ce n'est pas

**Une transcription de [`packages/core/src/config/schema.ts`](https://github.com/Reefact/conventional-comments-toolkit/blob/main/packages/core/src/config/schema.ts), qui reste la source de vérité.**
Ce fichier-là est du code impératif — une boucle et un `switch` sur chaque clé — dont on ne
peut pas émettre du JSON Schema mécaniquement. La transcription est donc à la main, et
c'est [`scripts/check-schema.mjs`](../scripts/check-schema.mjs) qui l'empêche de mentir :

```sh
npm run check:schema -- ../conventional-comments-toolkit
```

It checks that the schema compiles, that fifteen fixtures are accepted or rejected as
expected, that the 19 top-level keys are exactly the validator's, that the domains of `mode`
and of the severities match, that the deprecated mode is the one the validator still
tolerates, that the bounds of `allowlistPatterns` and `SUPPORTED_CONFIG_VERSION` are right,
and that the toolkit's normative example passes. It exits non-zero on the slightest gap.

What it does not compare is kept by hand: the nested properties (those of a label, including
`kind`, `description` and `usage`; decorations, rules, telemetry), the list of diagnostic
codes, the default values and the descriptions. A change to the validator on those points
does not make the script fail: it shows up in the toolkit's release notes, and has to be
carried over here.

Sans le chemin du toolkit, il ne joue que le schéma et les fixtures — utile en CI sur ce
dépôt seul.

## Ce que le schéma n'impose pas

It once imposed two constraints the validator does not, and a review caught them:
`^#[0-9a-fA-F]{6}$` on a label's colour, and `format: "date-time"` on the activation date — a
key since retired, along with the verifier. In both cases the toolkit only checked
`typeof === "string"`. A configuration the product accepted and applied was therefore
underlined in red in the editor. **A file that calls itself a transcription cannot refuse
what its source accepts** — both constraints are gone, and
`scripts/fixtures/valid-runtime-widths.json` prevents them from coming back.

The same fixture covers two severities the product accepts without applying them as written:
`"W-SESSION-MULTIPLE": "error"`, which it lowers to `warn`, and an `E-` code set to `off`,
which it raises to `warn`. In both cases the extension applies the limit and reports it with
a configuration notice; the schema therefore lets the value through, and the limit is stated
in the key's description.

The gap can also run the other way: a rule JSON Schema cannot express, which the schema
accepts and the validator rejects. Rather than leave such a gap silent, it has a name: a
fixture prefixed `loose-` marks what the schema accepts and the validator rejects. No
fixture carries that prefix today — the only one that did was about the activation date —
but `check-schema.mjs` still recognises it. Without this third case, the gap is discovered
by watching an `invalid-` fixture pass, and the reflex is to tighten the schema — that is, to
reintroduce the very defect that was just fixed.

## Four deliberate gaps

1. **Unknown keys are rejected here, and only reported at runtime.** The toolkit ignores a
   key it does not know and reports it with a configuration notice; the schema sets
   `additionalProperties: false`, which underlines it in the editor. Stricter, but it is the
   useful behaviour: you see the typo while writing rather than afterwards, in the
   extension's status pill. The keys retired with the verifier — `formatSeverity`,
   `overrideLabel`, `resolverOverrideGroup`, `activation`, `docUrl`, and before them `server`
   and `exemptionLog` — fall into this case: the product treats them as unknown keys, and so
   does the schema.

2. **`"mode": "warn"` is accepted, and marked deprecated.** The validator still reads it as
   `assist`, and reports it. Rejecting it here would underline in red a configuration the
   product applies; accepting it silently would suggest that `warn` is a mode. `mode`
   therefore has two branches: the product's three modes, and `warn` with
   `deprecated: true` and a message. The editor strikes the value through and says what to
   write instead.

3. **Three rules cannot be expressed in JSON Schema** and are only checked at runtime: that
   an `allowlistPatterns` entry is a valid regular expression, that it contains no nested
   quantifier (the shape behind most known ReDoS), and that a `configUrl` set at repository
   level is ignored — the schema does not know at which level it is applied.

4. **The descriptions are in English**, although the site is bilingual. JSON Schema has no
   internationalisation mechanism, and it is read by editors everywhere.

## Avant de mettre en ligne

Le `$schema` du toolkit pointe aujourd'hui vers `conventional-comments-toolkit.dev`. Le
domaine ne répond pas : une requête vers lui échoue exactement comme vers un domaine
inventé, là où `conventionalcomments.org` répond 200 par le même chemin. Et le dépôt du
toolkit ne contient aucun fichier de schéma. Faire pointer les dépôts ici demande de
changer la chaîne à deux endroits du dépôt toolkit :

- `.conventional-comments.example.json`, ligne 2
- `specifications-fr.md`, line 846 (the example in §8.2)

The toolkit repository's own `.conventional-comments.json` carries the same string.

Décision côté toolkit, pas côté site. Et les dépôts déjà configurés garderont l'ancienne
URL jusqu'à ce que quelqu'un l'y change.
