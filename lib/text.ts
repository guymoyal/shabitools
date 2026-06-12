/**
 * Strip basic Markdown syntax from a string, returning plain text.
 * Used for card previews where markdown would render as raw characters.
 */
export function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/[*_`>#]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}
