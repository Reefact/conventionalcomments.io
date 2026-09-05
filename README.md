# conventionalcomments.io

Vitrine de [`conventional-comments-toolkit`](https://github.com/Reefact/conventional-comments-toolkit) —
l'extension navigateur et le compagnon serveur qui font respecter
[Conventional Comments](https://conventionalcomments.org/) dans les revues de code.

Site statique **Astro**, hébergé sur **Cloudflare**. Bilingue anglais (racine) / français
(`/fr/`), segments d'URL traduits.

> Outillage indépendant. La spécification vit sur
> [conventionalcomments.org](https://conventionalcomments.org/) ; ce site ne parle pas en
> son nom.

## Démarrer

```sh
npm install
npm run dev      # http://localhost:4321
npm run check    # build + tous les contrôles ci-dessous
```

| Commande | Ce qu'elle fait |
| --- | --- |
| `npm run dev` | Estampille le build, puis sert le site en développement |
| `npm run build` | Estampille le build, puis produit `dist/` (28 pages) |
| `npm run check` | `build`, puis les invariants du site et du schéma |
| `npm run check:site` | Les sept invariants, sur ce qui est réellement produit |
| `npm run check:schema` | Le schéma JSON contre ses gabarits ; `-- <chemin-du-toolkit>` le compare à la source |
| `npm run deploy` | `check`, puis `wrangler deploy` |

## Structure

```
src/i18n/routes.ts      La table des routes — seule source de vérité sur les adresses
src/i18n/ui.ts          Les chaînes de chrome, et rien d'autre (§7.3 : on écrit, on ne traduit pas)
src/layouts/            Base (coque, méta, alternats) et Docs (grille + barre latérale)
src/components/         Mark, Header, Footer, DocsSidebar, BuildFacts
src/pages/              26 pages : 13 en anglais à la racine, 13 en français sous fr/
src/styles/             tokens.css (les jetons, trois états de thème) et base.css
public/schema/v1.json   Le schéma de configuration, servi à /schema/v1.json
public/_headers         CORS et cache pour le schéma (lu par Cloudflare, jamais servi)
scripts/                Estampille, portage des maquettes, contrôles
```

Les segments sont traduits : `/docs/configure/` répond à `/fr/docs/configuration/`. Le
routage d'Astro ne sait pas faire ça — il préfixe, il ne traduit pas — donc chaque page a
son fichier dans les deux arbres et `routes.ts` les apparie. C'est cette table qui alimente
la navigation, la barre latérale, le sélecteur de langue et les alternats `hreflang` :
quatre endroits où une adresse recopiée à la main serait la première source de liens morts.

## Ce que le build garantit

`npm run check:site` lit `dist/`, pas les sources : ce qui est servi compte, et un gabarit
qui compile ne dit rien d'un lien qui ne mène nulle part.

1. Aucun lien interne mort.
2. `/version/` et `/fr/version/` ne sont atteignables par aucun lien du site.
3. …ni par le plan du site.
4. Toute page indexable déclare ses alternats `hreflang` (`en`, `fr`, `x-default`).
5. `/version` et `/version.json` nomment le même build.
6. `/schema/v1.json` est servi, parse, et son `$id` nomme l'adresse à laquelle il est servi.
7. Aucun `.md`, `.mjs` ou `.ts` dans `dist/` — `public/` est copié tel quel, et une note de
   maintenance qu'on y dépose se retrouve en ligne sans que personne ne l'ait décidé.

## L'estampille de build

`scripts/generate-version.mjs` écrit `src/generated/version.json` **et**
`public/version.json` depuis le même objet, avant chaque build, en lisant git. Deux règles
en découlent :

- Elle est écrite par le **build**, jamais par le déploiement — le job de déploiement
  publie l'artefact vérifié tel quel.
- Les deux fichiers sont ignorés par git : ils changent à chaque build par construction.

Tout build en produit une ; `release` vaut `null` quand le build ne vient pas d'un tag, ce
qui est plus utile qu'un 404.

## Hébergement

`wrangler.jsonc` déclare des **assets statiques sans script** (pas de `main`). Les requêtes
d'assets sont gratuites et non comptabilisées ; une requête qui réveille un script consomme
le quota et répond 429 une fois celui-ci épuisé. Le site n'a besoin d'aucun calcul à la
requête : il n'en demande donc aucun.

## Schéma de configuration

`public/schema/v1.json` — servi à `https://conventionalcomments.io/schema/v1.json`, il donne
l'autocomplétion et la validation dans l'éditeur à tout dépôt qui configure le toolkit.
Transcrit de `packages/core/src/config/schema.ts`, et tenu en accord avec lui par
`npm run check:schema -- <chemin-du-toolkit>`. Détails : [`docs/schema-fr.md`](./docs/schema-fr.md).

## Conception

| Document | Contenu |
| --- | --- |
| [`docs/identite-fr.md`](./docs/identite-fr.md) | Positionnement, marque, les quatre règles, palette, typographie, composants, voix |
| [`docs/decoupage-pages-fr.md`](./docs/decoupage-pages-fr.md) | Les routes, le bilinguisme, la navigation, ce qui reste à trancher |
| [`docs/schema-fr.md`](./docs/schema-fr.md) | Le schéma : statut, écarts assumés, ce qu'il reste à faire côté toolkit |
| [`docs/tokens.css`](./docs/tokens.css) | Jetons de design, trois états de thème |
| [`docs/mockups/`](./docs/mockups/) | Les treize pages maquettées, bilingues — la source de la prose |

Les maquettes restent la référence du **texte** ; `src/pages/` en est le portage, produit
une fois par `npm run port:mockup`. Toute retouche de prose se fait désormais dans les pages.

Rendus publiés :

- [Identité](https://claude.ai/code/artifact/70e2f349-e416-41f3-8cce-0215c71dd668) — marque, palette, spécimens, système de composants
- [Pages](https://claude.ai/code/artifact/694a5694-3c66-49fc-b3dc-10fdc5c4611f) — les pages complètes, navigation active
