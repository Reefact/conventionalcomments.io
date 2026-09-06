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
| `npm run check:site` | Les onze invariants, sur ce qui est réellement produit |
| `npm run check:schema` | Le schéma JSON contre ses gabarits ; `-- <chemin-du-toolkit>` le compare à la source |
| `npm run deploy` | `check`, puis `wrangler deploy` (demande `wrangler login`) |

## Structure

```
src/i18n/routes.ts      La table des routes — seule source de vérité sur les adresses
src/i18n/ui.ts          Les chaînes de chrome, et rien d'autre (§7.3 : on écrit, on ne traduit pas)
src/layouts/            Base (coque, méta, alternats) et Docs (grille + barre latérale)
src/components/         Mark, Header, Footer, DocsSidebar, BuildFacts
src/pages/              26 pages : 13 en anglais à la racine, 13 en français sous fr/
src/styles/             fonts.css (@font-face), tokens.css (jetons, trois thèmes), base.css
public/schema/v1.json   Le schéma de configuration, servi à /schema/v1.json
public/_headers         CORS du schéma, cache des polices (lu par Cloudflare, jamais servi)
public/fonts/           Les cinq .woff2, empreintés — le site sert ses polices lui-même
public/favicon.*        L'icône : svg (suit le thème), ico, apple-touch-icon
public/og-{en,fr}.png   Les cartes sociales, une par langue
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
8. Une page d'erreur par langue, et sous forme de fichier : Cloudflare sert le `404.html`
   le plus proche, jamais un `404/index.html`.
9. Aucune sous-ressource tierce. Les liens `<a>` mènent où ils veulent ; ce que le
   navigateur va chercher tout seul vient de ce site et de nulle part ailleurs.
10. Toute classe employée dans le HTML a une règle CSS — sans quoi rien ne casse, la page
    s'affiche, et un élément est simplement invisible ou collé au suivant.
11. Chaque page porte ses balises Open Graph et Twitter, l'image qu'elles nomment est
    servie, et l'icône existe sous ses trois formes.

## L'estampille de build

`scripts/generate-version.mjs` écrit `src/generated/version.json` **et**
`public/version.json` depuis le même objet, avant chaque build, en lisant git. Deux règles
en découlent :

- Elle est écrite par le **build**, jamais par le déploiement — le job de déploiement
  publie l'artefact vérifié tel quel.
- Les deux fichiers sont ignorés par git : ils changent à chaque build par construction.

Tout build en produit une ; `release` vaut `null` quand le build ne vient pas d'un tag, ce
qui est plus utile qu'un 404.

## Intégration continue

| Workflow | Quand | Ce qu'il fait |
| --- | --- | --- |
| `.github/workflows/check.yml` | chaque poussée, chaque PR | `npm ci && npm run check` |
| `.github/workflows/deploy.yml` | manuel, `main`, tags `release/*` | vérifie, puis publie **l'artefact vérifié** |

Le déploiement ne reconstruit pas après avoir vérifié : ce qui part en production est
exactement ce qui a été contrôlé. Il récupère l'historique complet (`fetch-depth: 0`) parce
que `/version` lit `git describe --tags` — un clone superficiel annoncerait « pas une
release » sur une release.

## Hébergement

`wrangler.jsonc` déclare des **assets statiques sans script** (pas de `main`). Les requêtes
d'assets sont gratuites et non comptabilisées ; une requête qui réveille un script consomme
le quota et répond 429 une fois celui-ci épuisé. Le site n'a besoin d'aucun calcul à la
requête : il n'en demande donc aucun.

Le site répond sur `conventionalcomments.io` et nulle part ailleurs : `workers_dev: false`,
et un seul *custom domain*. Pas de `www` — l'ajouter servirait les mêmes octets sous deux
noms, quand tous les `<link rel="canonical">` désignent l'apex ; si `www` doit répondre,
c'est une redirection 301 au niveau de la zone.

### Pour mettre en ligne la première fois

1. **La zone doit être gérée par Cloudflare.** Contrainte dure : contrairement à Pages,
   Workers n'accepte aucun domaine dont les serveurs de noms sont ailleurs.
2. Deux secrets de dépôt : `CLOUDFLARE_API_TOKEN` (portée *Edit Cloudflare Workers*) et
   `CLOUDFLARE_ACCOUNT_ID`.
3. Lancer `deploy` à la main une première fois (onglet Actions), pour voir le domaine
   s'attacher et le certificat se créer.
4. Puis poser la variable de dépôt `CF_DEPLOY = true` : les poussées sur `main` déploient.

Tant que cette variable n'existe pas, seul le déclenchement manuel passe — une poussée sur
`main` n'échoue pas en boucle avant que les secrets ne soient posés.

En local, `npm run deploy` fait la même chose après `wrangler login`.

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
