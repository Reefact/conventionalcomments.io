// Fixture for scripts/lib/default-labels.mjs. Not toolkit code: the shapes the parser must
// read. One call per shape that once escaped, or could escape, a line-based reader.
const label = (
  id: string,
  icon: string,
  color: string,
  blockingByDefault: boolean,
  alwaysNonBlocking: boolean,
  enabled = true,
  aliases: string[] = [],
  kind: LabelKind = 'remark'
): LabelConfig => ({ id, enabled, blockingByDefault, alwaysNonBlocking, kind, icon, color, aliases: [...aliases] });

export const ADDED = [
  label('thanks', '\u{1F91D}', '#9C8C1A', false, true, true, ['thx'], 'reply'),
  label('reviewed', '\u{1F389}', '#D04A7A',
    false, true, true, [], 'status'),
];

export function defaultConfig() {
  return [
    label('praise', '\u{1F44F}', '#36933B', false, false),
    label(
      'quibble',
      '\u{1FAB6}',
      '#61896C',
      false,
      false,
      false
    ),
    label('decision', '\u{2696}\u{FE0F}', '#936DD4', false, true, true, [], 'reply'),
  ];
}
