export function parseDescription(raw: string) {
  const tagPattern = /#[\p{L}\p{N}_]+/gu
  const tags = Array.from(new Set(raw.match(tagPattern) ?? []))
  const text = raw
    .replace(tagPattern, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return { text, tags }
}