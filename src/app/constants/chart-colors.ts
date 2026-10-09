/**
 * Chart series colors, kept in sync with the brand tokens in `src/styles/_colors.scss`
 * (`$gold` / `$blue-accent`). TypeScript can't read Sass variables directly, so this is
 * the single place the same hex values are mirrored for use as component inputs.
 */
export const CHART_COLORS = {
  gold: '#c9a227',
  blueAccent: '#4c6ef5',
} as const;
