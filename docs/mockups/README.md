# Maquettes

`pages.html` — quatre pages complètes du site, **en anglais et en français**, dans un
seul fichier autonome :

| Route maquettée | Ce qu'elle éprouve |
| --- | --- |
| `/` | Le récit d'accueil, humain d'abord : le ton qui ne s'écrit pas, les quatre malentendus, l'effort demandé au relecteur, la proportion visible — l'outil n'arrive qu'en sixième section |
| `/platforms/` | La disponibilité, et rien d'autre : ce qui marche, ce qui est à venir, ce qu'il faut pour démarrer |
| `/docs/labels/` | La densité de référence : 13 labels, décorations, table de précédence, 15 codes de diagnostic |
| `/docs/adoption/` | La page opérationnelle : séquence, prérequis, retour arrière, indicateurs |

La navigation d'en-tête, la barre latérale de documentation, les liens de pagination et le
**sélecteur EN / FR** sont actifs. Le sélecteur conserve la page courante ; la barre
d'adresse suit la route traduite et affiche l'alternat `hreflang` de l'autre langue.

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
- **Les deux langues sont écrites.** Le mécanisme de bascule (`.loc[data-loc]`, masquage
  par `hidden`) ne se porte pas : Astro sert deux arbres de routes distincts. Ce qui se
  porte, c'est la copie — et la règle des deux deux-points (`identite-fr.md` §3.4), qui
  demande un composant `<Eyebrow>` conscient de la locale et un `<Token>` qui ne l'est
  jamais.
- **Les descriptions de labels sont les chaînes réelles de `strings.ts`**, pas une
  retraduction. Si elles changent dans le toolkit, elles changent ici.
- **Tout est vrai.** Couleurs, abréviations clavier, codes de diagnostic, table de
  précédence du §3.3, les deux critères du §6.2.1, les six indicateurs, les cinq prérequis
  à `enforce`, les hypothèses ouvertes du spike P1′ et leurs replis, le `manifest.json` :
  chaque valeur vient du dépôt
  [`conventional-comments-toolkit`](https://github.com/Reefact/conventional-comments-toolkit).
  Une valeur qui change là-bas est fausse ici.
- **Trois blocs sont des composants, pas des sections** : le badge de label (`.pill`), le
  verdict (`.verdict`), et le check de conformité (`.check`). Ils réapparaissent sur les
  quatre pages et doivent devenir des composants Astro avant tout le reste.
- **Le cadre de maquette** (`.mock-note`, `.frame`, `.urlbar`) et le script de navigation
  en pied de fichier ne se portent pas : ils simulent le navigateur et le routeur.

Rendu publié :
<https://claude.ai/code/artifact/694a5694-3c66-49fc-b3dc-10fdc5c4611f>
