# CLAUDE.md

## Infrastructure : règle WAF Cloudflare « Block .env probes »

Une règle de sécurité personnalisée (WAF) a été créée le 21/11/2026 sur le
domaine conventionalcomments.io, dans Cloudflare (Security → Security rules →
Custom rules).

- Nom : `Block .env probes`
- Condition : `(http.request.uri.path contains ".env")`
- Action : Block (la requête est refusée par Cloudflare avant d'atteindre le site)
- Statut : Active

Pourquoi : des scanners automatisés testent en permanence des chemins comme
`/.env`, `/.env.txt`, `/old/.env` ou `/frontend/.env` pour récupérer des
secrets. Environ 300 requêtes de ce type sur 24 h (≈ 28 % du trafic sur
30 jours), toutes refusées. La règle les arrête en amont et allège les
statistiques.

### Conséquences pour le développement

1. Aucune URL du site ne doit contenir la chaîne `.env` (page, asset, ancre
   côté serveur, route d'API, fichier statique…). Elle serait bloquée par
   Cloudflare, y compris pour de vrais visiteurs. Exemples à éviter :
   `/docs/.environment`, `config.env.json`.
2. Un 403 sur une URL contenant `.env` (test, monitoring, vérificateur de
   liens) vient très probablement de cette règle, pas d'un bug du site.
3. Ne jamais déployer de fichier `.env` (ni variante) dans le dossier publié.
   La règle est une protection supplémentaire, pas la seule : elle ne remplace
   pas une bonne configuration du build.
4. Ne pas supprimer ni désactiver la règle sans en parler d'abord. Toute
   modification passe par le tableau de bord Cloudflare.
5. La règle n'est pas décrite dans le code du dépôt. Si une infrastructure as
   code (Terraform, Wrangler, etc.) est ajoutée, l'y reproduire pour éviter
   qu'elle soit perdue ou écrasée.

Le filtre `contains` est volontairement large (il couvre aussi `/.env.txt`,
`/.env.dist`, etc.). Les pages actuelles (`/docs/...`, `/fr/...`) ne sont pas
concernées.
