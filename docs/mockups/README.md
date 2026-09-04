# Maquettes

`pages.html` — quatre pages complètes du site, dans un seul fichier autonome :

| Route maquettée | Ce qu'elle éprouve |
| --- | --- |
| `/` | Le récit d'accueil, cadré tech lead : l'écart que l'extension ne peut pas combler, les deux composants, les deux critères, l'authoring, la trajectoire, la confidentialité |
| `/platforms/` | Le support par plateforme, qui n'est pas binaire : établi / sur repli / non appliqué |
| `/docs/labels/` | La densité de référence : 13 labels, décorations, table de précédence, 15 codes de diagnostic |
| `/docs/adoption/` | La page opérationnelle : séquence, prérequis, retour arrière, indicateurs |

La navigation d'en-tête, la barre latérale de documentation et les liens de pagination
sont **actifs** — la barre d'adresse en tête de cadre suit la route et affiche l'alternat
`hreflang` français.

## Statut

Référence de conception, **pas un livrable de build**. Rien ici n'est servi : le fichier
existe pour que l'implémentation Astro parte d'un balisage et d'une feuille de style déjà
éprouvés, pas d'une description.

Ouvrir dans un navigateur, ou :

```sh
npx http-server docs/mockups -o /pages.html
```

## Ce qu'il faut savoir avant de porter

- **Les jetons sont ceux de [`../tokens.css`](../tokens.css)**, recopiés en tête de fichier
  pour que la maquette reste autonome. Au portage, importer le fichier ; ne pas maintenir
  deux copies.
- **Le contenu est en anglais** (locale racine). Les routes `/fr/` sont indiquées dans la
  barre d'adresse mais le contenu français reste à écrire.
- **Tout est vrai.** Couleurs, abréviations clavier, codes de diagnostic, table de
  précédence du §3.3, les deux critères du §6.2.1, les six indicateurs, les cinq prérequis
  à `enforce`, les hypothèses ouvertes du spike P1′ et leurs replis, le `manifest.json` :
  chaque valeur vient du dépôt
  [`conventional-comments-toolkit`](https://github.com/Reefact/conventional-comments-toolkit).
  Une valeur qui change là-bas est fausse ici.
- **Trois blocs sont des composants, pas des sections** : le badge de label (`.pill`), le
  verdict (`.verdict`), et le check de conformité (`.check`). Ils réapparaissent sur les
  trois pages et doivent devenir des composants Astro avant tout le reste.
- **Le cadre de maquette** (`.mock-note`, `.frame`, `.urlbar`) et le script de navigation
  en pied de fichier ne se portent pas : ils simulent le navigateur et le routeur.

Rendu publié :
<https://claude.ai/code/artifact/694a5694-3c66-49fc-b3dc-10fdc5c4611f>
