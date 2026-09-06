<!--
  Écrivez cette PR en ANGLAIS : titre, résumé, changements, notes de test, références d'issue.
  Voir CONTRIBUTING.md -> « Language ». Le reste du dépôt est en français ; les messages de
  commit et les pull requests ne le sont pas.

  Titre : nommez le changement ENTIER. Une PR à une seule intention reprend son en-tête de
  commit (type(scope): description) ; une PR à plusieurs intentions prend un titre descriptif
  court, sans préfixe de type. Les liens d'issue vont dans « Related issues », pas dans le titre.

  Remplissez les sections applicables. N'inventez rien. Ne cochez que ce qui a réellement
  été lancé. Ne supprimez une section que si elle ne s'applique vraiment pas.
-->

## Summary

<!-- Une ou deux phrases : que change cette PR, et pourquoi ? -->

## Type of change

* [ ] Bug fix
* [ ] New feature
* [ ] Breaking change
* [ ] Refactoring
* [ ] Content / copy change
* [ ] Documentation
* [ ] Build / CI / tooling

## Changes

<!-- Liste à puces des changements concrets. Factuel. -->

*

## Testing

<!-- Ne cochez que ce qui a été lancé. -->

* [ ] `npm run check` (build + les treize invariants + schéma + notes + labels)
* [ ] `TOOLKIT_PATH=… npm run check` (avec les comparaisons au toolkit, comme la CI)
* [ ] Rendu vérifié dans un navigateur, sur les pages touchées
* [ ] Vérifié dans les deux langues

## Documentation

* [ ] `RELEASE_NOTES-en.md` **et** `-fr.md` mis à jour sous `## Unreleased` — les deux moitiés,
      ou aucune : `npm run check:notes` refuse une puce ajoutée d'un seul côté
* [ ] README / `docs/` mis à jour
* [ ] Aucun changement de documentation nécessaire

## Related issues

<!-- `Closes #NN` si cette PR ferme une issue ; `Refs: #NN` sinon. -->
