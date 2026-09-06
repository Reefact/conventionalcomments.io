---
description: Rédige les notes de la prochaine release et ouvre sa pull request `ci: prepare <tag>`
argument-hint: (aucun argument — le tag est calculé)
allowed-tools: Bash, Read, Edit, Write
---

Préparer une release de conventionalcomments.io : l'étape 2 des quatre décrites dans
`CONTRIBUTING.md`.

Tu rédiges et tu ouvres la pull request. **Tu ne poses jamais le tag, et tu ne fusionnes
jamais.** Le mainteneur fait les deux, dans cet ordre, après avoir lu les notes. Cette lecture
est toute la raison d'être de l'étape : après le tag il est trop tard, puisque
`scripts/release-notes.sh` publie la section telle quelle comme Release GitHub.

## 1. Refuser de démarrer sur un mauvais pied

Contrôle tout ceci avant de toucher un fichier, et arrête-toi avec une explication claire si
l'un échoue :

- L'arbre de travail est propre (`git status --porcelain` vide). Du travail non commité
  embarquerait dans le commit de release.
- `main` est bien la branche courante et à jour avec `origin/main` (`git fetch origin main`
  d'abord).
- `npm run check:notes` passe en l'état — les deux langues sont déjà cohérentes.
- **`## Unreleased` a réellement du contenu.** S'il ne porte que le texte d'attente
  (`_Nothing pending yet._` / `_Rien en attente pour l'instant._`), il n'y a rien à publier :
  dis-le et arrête-toi, plutôt que de sortir une section vide.

## 2. Calculer le tag

```sh
TAG="release/$(date -u '+%Y-%m-%dT%H-%M-%SZ')"
```

En UTC, et calculé **maintenant** : le tag est nommé avant d'exister, donc cet horodatage
enregistre le moment où la release a été nommée, pas celui où elle a été poussée. Le stamp doit
satisfaire la regex qu'impose `check-release-tag.sh` :

```
^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}-[0-9]{2}-[0-9]{2}Z$
```

## 3. Retitrer, dans les deux langues

Dans `RELEASE_NOTES-en.md` et `RELEASE_NOTES-fr.md`, remplace l'unique ligne `## Unreleased`
par un `## Unreleased` vide, le texte d'attente de sa langue, puis l'en-tête retitré :

```
## Unreleased

_Nothing pending yet._

## <TAG> — September 6, 2026
```

```
## Unreleased

_Rien en attente pour l'instant._

## <TAG> — 6 septembre 2026
```

La date s'écrit dans la forme propre à chaque langue — `September 6, 2026` et
`6 septembre 2026` — comme dans `justdummies.io`. La chaîne du tag, elle, est identique des
deux côtés : `check-release-notes.mjs` compare les tags des deux fichiers dans l'ordre et
échoue s'ils diffèrent.

Rien d'autre ne change. Le contenu de la release a été écrit et relu quand le travail a été
fusionné ; cette étape décide seulement sous quel tag il se range.

## 4. Le prouver, y compris en négatif

Lance tout ceci et rapporte chaque résultat. Un contrôle qui ne fait que passer ne prouve rien,
donc deux d'entre eux sont délibérément négatifs :

```sh
npm run check:notes                                      # même structure dans les deux langues
./scripts/release-notes.sh "$TAG"                        # sort la section du tag, exit 0
./scripts/release-notes.sh release/2020-01-01T00-00-00Z  # DOIT sortir en 1 — la garde refuse toujours
./scripts/release-notes.sh "$TAG" | grep -c 'Nothing pending'   # DOIT valoir 0 — pas de fuite du texte d'attente
TOOLKIT_PATH=<chemin> npm run check                      # build, invariants, schéma, notes, labels
```

Si `TOOLKIT_PATH` n'est pas disponible, dis que le `check` complet a été sauté plutôt que de
prétendre qu'il est passé.

## 5. Brancher, commiter, pousser, ouvrir la pull request

La branche : si la précédente a été fusionnée, repars de `origin/main`
(`git checkout -B <branche> origin/main`) au lieu d'empiler sur un historique déjà fusionné.

Le message de commit et le titre de la pull request doivent être **exactement** :

```
ci: prepare <TAG>
```

`check-release-tag.sh` retrouve la pull request par ce titre exact : un mot en trop casse la
release. Passe le message dans `tools/commit-lint/lint-commit-message.sh` avant de pousser.

Le corps de la pull request dit quel est le tag, que le diff se limite aux notes, énumère les
contrôles que tu as réellement lancés, et reprend les commandes de l'étape 6.

## 6. Passer la main — et être explicite sur l'ordre

Donne la valeur du tag sans détour, puis ces deux étapes **dans cet ordre**, en disant pourquoi
l'ordre n'est pas optionnel :

1. **Fusionner la pull request.**
2. **Puis** taguer le commit que la fusion a produit :

   ```sh
   git checkout main && git pull
   TAG="<TAG>"
   git tag -a "$TAG" -m "$TAG"    # annoté ; le message est le nom du tag lui-même
   git push origin "$TAG"
   ```

Taguer avant la fusion est l'erreur naturelle, et elle a déjà été commise ici : le tag pointe
alors sur un `main` qui n'a pas de section à son nom, et `check-release-tag.sh` refuse avec
`no merged pull request titled 'ci: prepare <tag>' produced <sha>`. Rien ne se déploie et rien
n'est publié, donc le rattrapage est indolore — supprimer le tag
(`git push origin :refs/tags/<TAG>` puis `git tag -d <TAG>`), fusionner, et retaguer avec le
**même nom**, qui reste réutilisable précisément parce qu'il n'a jamais rien désigné
publiquement.

Préviens aussi que rien d'autre ne doit atteindre `main` entre la fusion et le tag : la seconde
garde compare le commit tagué au `merge_commit_sha` de la pull request et refuse s'ils
diffèrent.

## Ce que tu ne dois pas faire

- Ne pousse pas le tag. Ne fusionne pas la pull request. Ne l'approuve pas.
- N'écris pas de notes de version depuis les sujets de commits. Un sujet de commit explique un
  diff à qui le relit ; une note de version dit à une lectrice ce qu'elle remarquerait. Si
  `## Unreleased` est vide, c'est un fait à rapporter, pas un trou à combler.
- Ne touche à rien d'autre qu'aux deux fichiers de notes. La pull request `ci: prepare` porte ce
  changement et rien d'autre.
