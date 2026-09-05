# Maquettes

`pages.html` — **le site complet**, treize pages en anglais et en français, dans un seul
fichier autonome :

| Route maquettée | Ce qu'elle éprouve |
| --- | --- |
| `/` | Le récit d'accueil, humain d'abord : le ton qui ne s'écrit pas, les quatre malentendus, l'effort demandé au relecteur — l'outil n'arrive qu'en sixième section |
| `/how-it-works/` | Les deux moitiés : la barre à deux rangées, la saisie rapide, l'absence assumée de bouton de contournement, les quatre conditions du blocage, les deux critères |
| `/platforms/` | La disponibilité, et rien d'autre : ce qui marche, ce qui est à venir, ce qu'il faut pour démarrer |
| `/privacy/` | Ce qui vit où, les trois conditions de la télémétrie, et le fait que l'organisation qui déploie le serveur en est l'opérateur |
| `/docs/` | Trois parcours nommés — j'essaie, je configure, je déploie — plutôt qu'une liste de liens |
| `/docs/install/` | Store, zip de release, sources ; et l'avertissement qu'un zip ne se met jamais à jour |
| `/docs/labels/` | La densité de référence : 13 étiquettes, précisions, règle de précédence, 15 diagnostics |
| `/docs/configure/` | Le plus petit fichier utile, les trois niveaux, les clés qui comptent, et le piège `toolCommands` |
| `/docs/adoption/` | La page opérationnelle : séquence, prérequis, retour arrière, indicateurs |
| `/docs/server/` | Docker, persistance, stockage, variables, et déclarer la vérification obligatoire |
| `/docs/troubleshooting/` | Sept symptômes, leur cause, et s'il y a quelque chose à faire |
| `/release-notes/v1/` | Les neuf versions publiées, avec leur tagline et leurs rubriques — sur le modèle de justdummies.io |
| `/version` | Ce que le déploiement est : tag de release, commit, heure de build, et ce que la dernière release a changé. **Aucun lien du site n'y mène.** |

La marque, la navigation d'en-tête, la barre latérale de documentation, les cartes de
parcours, les liens de pagination et le **sélecteur EN / FR** sont actifs. Le sélecteur conserve la page courante ; la barre
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
  verdict (`.verdict`), et la vérification (`.check`). Ils réapparaissent partout et doivent
  devenir des composants Astro avant tout le reste. **La barre latérale de documentation
  est générée** dans la maquette (sept entrées × deux langues × sept pages) : la recopier à
  la main en Astro serait la première source de liens morts.
- **Le cadre de maquette** (`.mock-note`, `.frame`, `.urlbar`) et le script de navigation
  en pied de fichier ne se portent pas : ils simulent le navigateur et le routeur.

Rendu publié :
<https://claude.ai/code/artifact/694a5694-3c66-49fc-b3dc-10fdc5c4611f>
