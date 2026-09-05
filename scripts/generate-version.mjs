// Estampille le build : src/generated/version.json.
//
// Il répond à la seule question qu'un déploiement ne sait pas répondre sur lui-même :
// quelle version est en ligne. La liste de déploiements de Cloudflare donne des horaires ;
// sans ce fichier, rapprocher ce qu'un visiteur reçoit d'un commit demande de lire une
// horloge.
//
// ÉCRIT PAR LE BUILD, DEPUIS GIT — jamais par le job de déploiement. Celui-ci publie
// l'artefact qu'il a téléchargé et ne reconstruit rien, précisément pour que rien
// n'atteigne la production sans avoir été vérifié : un fichier écrit après la
// vérification serait le seul octet de l'envoi qu'aucun contrôle n'aurait jamais vu.
//
// ÉCRIT AVANT LE BUILD, dans src/generated/, à côté de tout ce que le site importe. Astro
// vide son répertoire de sortie : un fichier écrit après le build ne peut pas être lu
// pendant. L'écrire deux fois — une pour la page, une pour l'artefact — mettrait deux
// horodatages sur un seul build, et tout l'intérêt de ce fichier est de ne pas se
// contredire. `public/version.json` est donc une COPIE de celui-ci, faite ici.
//
// CHAQUE build en produit un, pas seulement un build de release. Un fichier qui n'existe
// que parfois est un fichier que chaque lecteur doit tester, et `release: null` dit
// « ceci n'est pas une release » plus utilement qu'un 404.
//
// Il n'est PAS commité : il change à chaque build par construction, et le commiter
// laisserait chaque copie de travail sale.

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

const git = (...args) => {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null; // pas de git : une archive exportée, par exemple.
  }
};

/** Le tag `release/*` auquel ce commit appartient, ou null s'il n'y en a pas. */
const release = git('describe', '--tags', '--exact-match', '--match', 'release/*') || null;
const commit = git('rev-parse', 'HEAD') || null;
const built = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

const document = { release, commit, built };
const json = JSON.stringify(document, null, 2) + '\n';

mkdirSync(join(ROOT, 'src/generated'), { recursive: true });
writeFileSync(join(ROOT, 'src/generated/version.json'), json);
mkdirSync(join(ROOT, 'public'), { recursive: true });
writeFileSync(join(ROOT, 'public/version.json'), json);

console.log(`version.json : release=${release ?? '—'} commit=${commit?.slice(0, 7) ?? '—'} built=${built}`);
