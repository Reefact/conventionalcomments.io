// Reads the shipped labels out of the toolkit's `packages/core/src/config/defaults.ts`, as
// TEXT: importing the compiled package would require building the toolkit in CI.
//
// A regular expression over the source used to do this, and it failed silently: a line break
// inside one `label(...)` call was enough for that call to stop matching, and a shipped label
// dropped out of the audit without a word. So every call is now found first — every
// `label(` that is not the helper's own definition — then read as a whole, across lines. A
// call that cannot be read is an error, never a skip: the caller gets the list of labels AND
// the list of calls it could not understand, and must refuse to pass on the second.

/** Reads one JavaScript string literal, an array of them, or a bare word, starting at `i`. */
function readArg(src, i) {
  while (/\s/.test(src[i])) i++;
  const c = src[i];
  if (c === "'" || c === '"') {
    let j = i + 1;
    let value = '';
    while (j < src.length && src[j] !== c) {
      if (src[j] === '\\') { value += src[j] + src[j + 1]; j += 2; continue; }
      value += src[j++];
    }
    if (j >= src.length) return null;
    return { value: { string: value }, end: j + 1 };
  }
  if (c === '[') {
    const items = [];
    let j = i + 1;
    for (;;) {
      while (/\s/.test(src[j])) j++;
      if (src[j] === ']') return { value: { array: items }, end: j + 1 };
      const item = readArg(src, j);
      if (!item || !('string' in item.value)) return null;
      items.push(item.value.string);
      j = item.end;
      while (/\s/.test(src[j])) j++;
      if (src[j] === ',') j++;
      else if (src[j] !== ']') return null;
    }
  }
  const m = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
  if (!m) return null;
  return { value: { word: m[0] }, end: i + m[0].length };
}

/** Reads the argument list of the call whose `(` is at `open`; null if it is not plain literals. */
function readCall(src, open) {
  const args = [];
  let i = open + 1;
  for (;;) {
    while (/\s/.test(src[i])) i++;
    if (src[i] === ')') return args;
    const arg = readArg(src, i);
    if (!arg) return null;
    args.push(arg.value);
    i = arg.end;
    while (/\s/.test(src[i])) i++;
    if (src[i] === ',') i++;
    else if (src[i] !== ')') return null;
  }
}

const unescape = (s) => s
  .replace(/\\u\{([0-9A-Fa-f]+)\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/\\u([0-9A-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

/** Blanks out comments, keeping strings and offsets intact: a comment that mentions
 *  `label (…)` is prose, not a declaration. */
function stripComments(src) {
  let out = '';
  for (let i = 0; i < src.length;) {
    const c = src[i];
    if (c === "'" || c === '"' || c === '`') {
      let j = i + 1;
      while (j < src.length && src[j] !== c) j += src[j] === '\\' ? 2 : 1;
      out += src.slice(i, j + 1);
      i = j + 1;
    } else if (c === '/' && src[i + 1] === '/') {
      const j = src.indexOf('\n', i);
      const end = j === -1 ? src.length : j;
      out += ' '.repeat(end - i);
      i = end;
    } else if (c === '/' && src[i + 1] === '*') {
      const j = src.indexOf('*/', i + 2);
      const end = j === -1 ? src.length : j + 2;
      out += src.slice(i, end).replace(/[^\n]/g, ' ');
      i = end;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

/**
 * @returns {{ labels: {id, icon, color, kind, enabled}[], unreadable: string[] }}
 *   `unreadable` holds the source of every `label(` call that could not be read.
 */
export function parseDefaultLabels(source) {
  const src = stripComments(source);
  const labels = [];
  const unreadable = [];
  // Every call, but not the helper's definition: `const label = (` / `function label(`.
  for (const m of src.matchAll(/(?<![\w$.])label\s*\(/g)) {
    const before = src.slice(Math.max(0, m.index - 20), m.index);
    if (/(?:const|let|var|function)\s+$/.test(before)) continue;
    const open = m.index + m[0].length - 1;
    const args = readCall(src, open);
    const excerpt = src.slice(m.index, src.indexOf(')', open) + 1).replace(/\s+/g, ' ');
    // label(id, icon, color, blockingByDefault, alwaysNonBlocking, enabled = true, aliases = [], kind = 'remark')
    if (!args || args.length < 5 || !args.slice(0, 3).every((a) => 'string' in a)) {
      unreadable.push(excerpt);
      continue;
    }
    const kind = args[7] && 'string' in args[7] ? args[7].string : 'remark';
    if (!['remark', 'status', 'reply'].includes(kind)) { unreadable.push(excerpt); continue; }
    labels.push({
      id: args[0].string,
      icon: unescape(args[1].string),
      color: args[2].string.toUpperCase(),
      enabled: !(args[5] && 'word' in args[5] && args[5].word === 'false'),
      kind,
    });
  }
  return { labels, unreadable };
}
