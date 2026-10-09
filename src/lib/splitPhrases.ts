export interface PhraseSegment {
  text: string;
  /** Index into `phrases` of the phrase this segment matched, or null for plain text. */
  match: number | null;
}

/**
 * Splits `text` into plain and matched segments so components can emphasise phrases
 * that already exist in the content, without forking the copy. Matching is exact and
 * case-sensitive; at a tie the longest phrase wins. Phrases that are absent are ignored.
 */
export function splitPhrases(text: string, phrases: readonly string[]): PhraseSegment[] {
  const segments: PhraseSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    let bestAt = -1;
    let bestIndex = -1;

    for (let index = 0; index < phrases.length; index++) {
      const phrase = phrases[index];
      if (!phrase) continue;
      const at = text.indexOf(phrase, cursor);
      if (at === -1) continue;
      if (bestAt === -1 || at < bestAt || (at === bestAt && phrase.length > phrases[bestIndex].length)) {
        bestAt = at;
        bestIndex = index;
      }
    }

    if (bestAt === -1) break;
    if (bestAt > cursor) segments.push({ text: text.slice(cursor, bestAt), match: null });
    const end = bestAt + phrases[bestIndex].length;
    segments.push({ text: text.slice(bestAt, end), match: bestIndex });
    cursor = end;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor), match: null });
  return segments;
}
