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

Il vérifie que le schéma compile, que dix fixtures sont acceptées ou rejetées comme prévu,
que les 25 clés de premier niveau sont exactement celles du validateur, que les domaines de
`mode` et des sévérités coïncident, que les bornes d'`allowlistPatterns` et
`SUPPORTED_CONFIG_VERSION` sont les bonnes, et que l'exemple normatif du toolkit passe.
Sortie non nulle au moindre écart.

Sans le chemin du toolkit, il ne joue que le schéma et les fixtures — utile en CI sur ce
dépôt seul.

## Trois écarts assumés

1. **Les clés inconnues sont refusées ici, seulement signalées à l'exécution.** Le toolkit
   ignore une clé qu'il ne connaît pas avec un avertissement ; le schéma pose
   `additionalProperties: false`, ce qui la souligne dans l'éditeur. Plus strict, mais
   c'est le comportement utile : voir la faute de frappe pendant qu'on écrit plutôt que
   dans les journaux du serveur.

2. **Trois règles ne s'expriment pas en JSON Schema** et ne sont vérifiées qu'à l'exécution :
   qu'un motif d'`allowlistPatterns` soit une expression régulière valide, qu'il ne
   contienne pas de quantificateur imbriqué (la forme derrière l'essentiel des ReDoS
   connus), et qu'un `configUrl` posé au niveau d'un dépôt soit ignoré — le schéma ne sait
   pas à quel niveau il est appliqué.

3. **Les descriptions sont en anglais**, alors que le site est bilingue. Un JSON Schema n'a
   pas de mécanisme d'internationalisation, et il est lu par des éditeurs partout.

## Avant de mettre en ligne

Le `$schema` du toolkit pointe aujourd'hui vers `conventional-comments-toolkit.dev`. Le
domaine ne répond pas : une requête vers lui échoue exactement comme vers un domaine
inventé, là où `conventionalcomments.org` répond 200 par le même chemin. Et le dépôt du
toolkit ne contient aucun fichier de schéma. Faire pointer les dépôts ici demande de
changer la chaîne à deux endroits du dépôt toolkit :

- `.conventional-comments.example.json`, ligne 2
- `specifications-fr.md`, ligne 1005

Décision côté toolkit, pas côté site. Et les dépôts déjà configurés garderont l'ancienne
URL jusqu'à ce que quelqu'un l'y change.
