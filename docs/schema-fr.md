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

Il vérifie que le schéma compile, que quinze fixtures sont acceptées ou rejetées comme prévu,
que les 19 clés de premier niveau sont exactement celles du validateur, que les domaines de
`mode` et des sévérités coïncident, que le mode déprécié est bien celui que le validateur
tolère encore, que les bornes d'`allowlistPatterns` et `SUPPORTED_CONFIG_VERSION` sont les
bonnes, et que l'exemple normatif du toolkit passe. Sortie non nulle au moindre écart.

Ce qu'il ne compare pas reste tenu à la main : les propriétés imbriquées (celles d'un label,
dont `kind`, `description` et `usage` ; les décorations, les règles, la télémétrie), la liste
des codes de diagnostic, les valeurs par défaut et les descriptions. Une évolution du
validateur sur ces points ne fait pas échouer le script : elle se lit dans les notes de
version du toolkit, et se reporte ici.

Sans le chemin du toolkit, il ne joue que le schéma et les fixtures — utile en CI sur ce
dépôt seul.

## Ce que le schéma n'impose pas

Il a imposé deux contraintes que le validateur n'impose pas, et une revue les a relevées :
`^#[0-9a-fA-F]{6}$` sur la couleur d'un label, et `format: "date-time"` sur la date
d'activation — une clé retirée depuis, avec le vérificateur. Le toolkit ne vérifiait dans
les deux cas qu'`typeof === "string"`. Une configuration que le produit accepte et applique
était donc soulignée en rouge dans l'éditeur. **Un fichier qui se dit transcription ne peut
pas refuser ce que la source accepte** — les deux contraintes sont retirées, et
`scripts/fixtures/valid-runtime-widths.json` interdit la récidive.

Le même gabarit couvre deux sévérités que le produit accepte sans les appliquer telles
quelles : `"W-SESSION-MULTIPLE": "error"`, qu'il ramène à `warn`, et un code `E-` à `off`,
qu'il relève à `warn`. Dans les deux cas l'extension applique la limite et l'annonce par une
notice de configuration ; le schéma laisse donc passer la valeur, et la limite est dite dans
la description de la clé.

L'écart peut aussi exister dans l'autre sens : une règle que JSON Schema ne sait pas
exprimer, que le schéma accepte et que le validateur refuse. Plutôt que de laisser une telle
lacune muette, elle porte un nom : un gabarit préfixé `loose-` désigne ce que le schéma
accepte et que le validateur refuse. Aucun gabarit ne porte ce préfixe aujourd'hui — le seul
qui l'ait porté visait la date d'activation —, mais `check-schema.mjs` le reconnaît
toujours. Sans ce troisième cas, on découvre la lacune en voyant un gabarit `invalid-`
passer, et le réflexe est de durcir le schéma — c'est-à-dire de refaire le défaut qu'on
vient de corriger.

## Quatre écarts assumés

1. **Les clés inconnues sont refusées ici, seulement signalées à l'exécution.** Le toolkit
   ignore une clé qu'il ne connaît pas et le signale par une notice de configuration ; le
   schéma pose `additionalProperties: false`, ce qui la souligne dans l'éditeur. Plus
   strict, mais c'est le comportement utile : voir la faute de frappe pendant qu'on écrit
   plutôt qu'après coup, dans la pastille d'état de l'extension. Les clés retirées avec le
   vérificateur — `formatSeverity`, `overrideLabel`, `resolverOverrideGroup`, `activation`,
   `docUrl`, et avant elles `server` et `exemptionLog` — sont dans ce cas : le produit les
   traite comme des clés inconnues, le schéma aussi.

2. **`"mode": "warn"` est accepté, et marqué déprécié.** Le validateur le lit encore comme
   `assist`, en le signalant. Le refuser ici soulignerait en rouge une configuration que le
   produit applique ; l'accepter sans rien dire laisserait croire que `warn` est un mode.
   `mode` a donc deux branches : les trois modes du produit, et `warn` avec
   `deprecated: true` et un message. L'éditeur barre la valeur et dit quoi écrire à la place.

3. **Trois règles ne s'expriment pas en JSON Schema** et ne sont vérifiées qu'à l'exécution :
   qu'un motif d'`allowlistPatterns` soit une expression régulière valide, qu'il ne
   contienne pas de quantificateur imbriqué (la forme derrière l'essentiel des ReDoS
   connus), et qu'un `configUrl` posé au niveau d'un dépôt soit ignoré — le schéma ne sait
   pas à quel niveau il est appliqué.

4. **Les descriptions sont en anglais**, alors que le site est bilingue. Un JSON Schema n'a
   pas de mécanisme d'internationalisation, et il est lu par des éditeurs partout.

## Avant de mettre en ligne

Le `$schema` du toolkit pointe aujourd'hui vers `conventional-comments-toolkit.dev`. Le
domaine ne répond pas : une requête vers lui échoue exactement comme vers un domaine
inventé, là où `conventionalcomments.org` répond 200 par le même chemin. Et le dépôt du
toolkit ne contient aucun fichier de schéma. Faire pointer les dépôts ici demande de
changer la chaîne à deux endroits du dépôt toolkit :

- `.conventional-comments.example.json`, ligne 2
- `specifications-fr.md`, ligne 846 (l'exemple du §8.2)

Le fichier `.conventional-comments.json` du dépôt du toolkit porte la même chaîne.

Décision côté toolkit, pas côté site. Et les dépôts déjà configurés garderont l'ancienne
URL jusqu'à ce que quelqu'un l'y change.
