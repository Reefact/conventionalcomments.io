// Porte la maquette (docs/mockups/pages.html) vers les pages Astro de src/pages/.
//
// La maquette est la source de la COPIE : elle a été écrite, relue et corrigée là-bas.
// La recopier à la main dans vingt-six fichiers introduirait des écarts que personne ne
// verrait. Ce script fait la transcription, et il est rejouable.
//
//   node scripts/port-mockup.mjs
//
// Ce qu'il change au passage, et pourquoi :
//
//  1. Les accolades sont échappées AVANT tout le reste. Astro lit `{` comme le début
//     d'une expression, et les pages contiennent des blocs JSON — `{ "mode": "assist" }`
//     casserait la compilation. L'échappement passe en premier pour que les expressions
//     que ce script introduit ensuite, elles, restent des expressions.
//
//  2. `<button data-goto="…">` devient `<a href={href('…', lang)}>`. La maquette
//     naviguait en JavaScript ; le site navigue par des liens. `routes.ts` reste la
//     seule source des adresses.
//
//  3. Les boutons sans destination reçoivent la leur ici, une fois — un `href="#"`
//     laissé dans une maquette finit toujours en production.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// `new URL(...).pathname` reste une URL : il garde les %20 et ne rend pas un chemin
// natif sous Windows. fileURLToPath fait la conversion, dans les deux cas.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const html = readFileSync(join(ROOT, 'docs/mockups/pages.html'), 'utf8');

/** clé → { layout, fichier par locale, titre et description par locale } */
const PAGES = {
  home: {
    layout: 'plain', file: { en: 'index.astro', fr: 'fr/index.astro' },
    en: ['Conventional Comments Toolkit', 'Review comments that say what they expect. A browser extension and a server companion that make the Conventional Comments convention hold.'],
    fr: ['Conventional Comments Toolkit', "Des commentaires de revue qui disent ce qu'ils attendent. Une extension et un serveur pour que la convention Conventional Comments tienne."],
  },
  howitworks: {
    layout: 'plain', file: { en: 'how-it-works.astro', fr: 'fr/comment-ca-marche.astro' },
    en: ['How it works', 'One half helps you write review comments, the other half checks them. What each component does, and why neither replaces the other.'],
    fr: ['Comment ça marche', "Une moitié vous aide à écrire, l'autre vérifie. Ce que fait chaque composant, et pourquoi aucun ne remplace l'autre."],
  },
  platforms: {
    layout: 'plain', file: { en: 'platforms.astro', fr: 'fr/plateformes.astro' },
    en: ['Supported platforms', 'GitHub and Azure DevOps, hosted and self-hosted, in mainstream browsers. What works today and what is still to come.'],
    fr: ['Plateformes supportées', "GitHub et Azure DevOps, hébergés comme auto-hébergés, dans les navigateurs courants. Ce qui marche aujourd'hui et ce qui est à venir."],
  },
  privacy: {
    layout: 'plain', file: { en: 'privacy.astro', fr: 'fr/confidentialite.astro' },
    en: ['Privacy', 'No comment, code or diff content ever leaves your browser. Exactly what lives where, including the parts that are uncomfortable.'],
    fr: ['Confidentialité', "Aucun contenu de commentaire, de code ou de diff ne quitte votre navigateur. Exactement ce qui vit où, y compris ce qui est inconfortable."],
  },
  docsindex: {
    layout: 'docs', file: { en: 'docs/index.astro', fr: 'fr/docs/index.astro' },
    en: ['Documentation', 'Three paths: trying it out, setting it up for a repository, deploying it for an organization.'],
    fr: ['Documentation', "Trois parcours : essayer, configurer un dépôt, déployer pour une organisation."],
  },
  install: {
    layout: 'docs', file: { en: 'docs/install.astro', fr: 'fr/docs/installation.astro' },
    en: ['Install the extension', 'From your browser store, from a release zip with no build chain, or from source.'],
    fr: ["Installer l'extension", "Depuis le store de votre navigateur, depuis un zip de release sans rien compiler, ou depuis les sources."],
  },
  labels: {
    layout: 'docs', file: { en: 'docs/labels.astro', fr: 'fr/docs/labels.astro' },
    en: ['Labels & decorations', 'The thirteen labels, the decorations, the precedence rule that decides whether a comment blocks, and the fifteen diagnostics.'],
    fr: ['Labels et décorations', "Les treize étiquettes, les précisions, la règle qui décide si un commentaire bloque, et les quinze diagnostics."],
  },
  configure: {
    layout: 'docs', file: { en: 'docs/configure.astro', fr: 'fr/docs/configuration.astro' },
    en: ['Configure a repository', 'One file on the default branch: the three levels, the keys that matter, and the one that bites.'],
    fr: ['Configurer un dépôt', "Un fichier sur la branche par défaut : les trois niveaux, les clés qui comptent, et celle qui piège."],
  },
  adoption: {
    layout: 'docs', file: { en: 'docs/adoption.astro', fr: 'fr/docs/adoption.astro' },
    en: ['Adoption: assist → warn → enforce', 'The sequence, the five prerequisites, the rollback, and what the measuring step measures.'],
    fr: ['Adoption : assist → warn → enforce', "La séquence, les cinq prérequis, le retour arrière, et ce que l'étape de mesure mesure."],
  },
  server: {
    layout: 'docs', file: { en: 'docs/server.astro', fr: 'fr/docs/serveur.astro' },
    en: ['Deploy the server', 'Docker, persistence, storage, the variables that matter, and making the check required.'],
    fr: ['Déployer le serveur', "Docker, persistance, stockage, les variables qui comptent, et rendre la vérification obligatoire."],
  },
  troubleshooting: {
    layout: 'docs', file: { en: 'docs/troubleshooting.astro', fr: 'fr/docs/diagnostic.astro' },
    en: ['Troubleshooting', 'Seven symptoms, what causes each one, and whether there is anything to do about it.'],
    fr: ['Diagnostic', "Sept symptômes, leur cause, et s'il y a quelque chose à faire."],
  },
  releasenotes: {
    layout: 'rn', file: { en: 'release-notes/v1.astro', fr: 'fr/notes-de-version/v1.astro' },
    en: ['Release notes — Toolkit 1.x', 'What changed for you, release by release, written for the person who uses it.'],
    fr: ['Notes de version — Toolkit 1.x', "Ce qui change pour vous, version après version, écrit pour la personne qui s'en sert."],
  },
  version: {
    layout: 'plain', noindex: true, file: { en: 'version.astro', fr: 'fr/version.astro' },
    en: ['Version', 'Which release is live, from which commit, built when.'],
    fr: ['Version', 'Quelle release est en ligne, depuis quel commit, construite quand.'],
  },
};

/** Boutons de la maquette sans `data-goto` : leur destination se décide ici, une fois. */
const BY_TEXT = [
  [/Install the extension|Installer l'extension/, "href('install', LANG)"],
  [/Full changelog ↗|Changelog complet ↗/, "'https://github.com/Reefact/conventional-comments-toolkit/blob/main/CHANGELOG.md'"],
  [/See further releases on GitHub ↗|Voir les releases suivantes sur GitHub ↗/, "'https://github.com/Reefact/conventional-comments-toolkit/releases'"],
];

function extract(key, lang) {
  const open = `<main data-page="${key}"`;
  const start = html.indexOf(open);
  if (start < 0) throw new Error(`page absente de la maquette : ${key}`);
  const end = html.indexOf('\n  </main>', start);
  const main = html.slice(start, end);
  const marker = `<div class="loc" data-loc="${lang}"`;
  const s = main.indexOf(marker);
  const body = main.slice(main.indexOf('>', s) + 1);
  // Le bloc de la locale suivante, s'il y en a un, borne celui-ci.
  const nxt = body.indexOf('<div class="loc" data-loc=');
  return (nxt < 0 ? body : body.slice(0, body.lastIndexOf('</div>', nxt))).trim();
}

/** Ne garde que l'intérieur de .dmain — la barre latérale vient du composant. */
function dmainOnly(frag) {
  const i = frag.indexOf('<div class="dmain">');
  if (i < 0) return frag;
  const inner = frag.slice(i + '<div class="dmain">'.length);
  return inner.slice(0, inner.lastIndexOf('</div>', inner.lastIndexOf('</div>'))).trim();
}

function transform(frag, lang) {
  // 1. Échapper les accolades AVANT d'introduire des expressions.
  let out = frag.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');

  // 1 bis. Les blocs préformatés deviennent des <pre>.
  //
  // Ils portent `white-space: pre` et n'étaient que des <div> dans la maquette, où
  // rien ne touchait au HTML. Astro compresse sa sortie et écrase les sauts de ligne
  // d'un <div> ; il respecte ceux d'un <pre>. Désactiver la compression marcherait
  // aussi, mais <pre> est ce que ces blocs auraient dû être dès le départ : c'est du
  // texte préformaté, et un lecteur d'écran comme un copier-coller s'en servent.
  for (const cls of ['code', 'grammar', 'line']) {
    out = out.replace(
      new RegExp(`<div class="${cls}">([\\s\\S]*?)</div>`, 'g'),
      (_, inner) => `<pre class="${cls}">${inner}</pre>`
    );
  }

  // 2. Les liens de navigation.
  out = out.replace(
    /<button class="([^"]*)" data-goto="([a-z]+)"([^>]*)>/g,
    (_, cls, key, rest) => `<a class="${cls}" href={href('${key}', '${lang}')}${rest}>`
  );
  out = out.replace(
    /<button data-goto="([a-z]+)"([^>]*)>/g,
    (_, key, rest) => `<a href={href('${key}', '${lang}')}${rest}>`
  );

  // 2 bis. /version affiche le build réel, pas les valeurs figées de la maquette.
  //
  // La maquette montrait un tag, un sha et une heure inventés — c'est tout ce qu'elle
  // pouvait faire. Ici le bloc est remplacé par le composant qui lit
  // src/generated/version.json, écrit par le build depuis git.
  out = out.replace(
    /<div class="vfacts">[\s\S]*?<\/div>\s*<\/div>/,
    '<BuildFacts lang={lang} />'
  );

  // 3. Les boutons sans destination.
  out = out.replace(/<button([^>]*)>([^<]*)<\/button>/g, (m, attrs, text) => {
    for (const [re, expr] of BY_TEXT) {
      if (re.test(text)) {
        const ext = expr.startsWith("'http");
        return `<a${attrs} href={${expr.replace('LANG', `'${lang}'`)}}${ext ? ' rel="noopener noreferrer" target="_blank"' : ''}>${text}</a>`;
      }
    }
    return m;
  });

  // 4. Refermer les <button> devenus <a>. Le compte doit tomber juste.
  const opened = (out.match(/<a class="(btn|pgl|path|navlink)[^"]*" href=\{/g) || []).length
               + (out.match(/<a href=\{href\(/g) || []).length;
  for (let i = 0; i < opened; i++) out = out.replace('</button>', '</a>');
  if (out.includes('data-goto')) throw new Error('un data-goto a survécu au portage');
  return out;
}

let written = 0;
for (const [key, cfg] of Object.entries(PAGES)) {
  for (const lang of ['en', 'fr']) {
    let body = extract(key, lang);
    if (cfg.layout === 'docs') body = dmainOnly(body);
    body = transform(body, lang);

    const [title, desc] = cfg[lang];
    const layout = cfg.layout === 'docs' ? 'Docs' : 'Base';
    // Depuis src/pages/<fichier>, remonter jusqu'à src/ : un cran pour sortir de
    // pages/, plus un par sous-dossier.
    const rel = '../'.repeat(cfg.file[lang].split('/').length);

    const page = `---
import ${layout} from '${rel}layouts/${layout}.astro';
import { href } from '${rel}i18n/routes';${body.includes('<BuildFacts') ? `\nimport BuildFacts from '${rel}components/BuildFacts.astro';` : ''}

const lang = '${lang}' as const;
const page = '${key}' as const;
---
<${layout} lang={lang} page={page}${cfg.noindex ? ' noindex' : ''}
  title=${JSON.stringify(title)}
  description=${JSON.stringify(desc)}>
${body}
</${layout}>
`;
    const dest = join(ROOT, 'src/pages', cfg.file[lang]);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, page);
    written++;
  }
}
console.log(`${written} pages écrites depuis la maquette.`);
