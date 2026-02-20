import type { LibraryItem } from "../api";

/**
 * Build the full call number for shelf lookup.
 *
 * Mirrors the Python `LibraryItem.call_number` property:
 * `<Genre> <Format> <Letters> <ArtistNum>/<ReleaseNum>`
 *
 * Only non-null parts are included.
 */
export function formatCallNumber(item: LibraryItem): string {
  const parts: string[] = [];

  if (item.genre) parts.push(item.genre);
  if (item.format) parts.push(item.format);
  if (item.call_letters) parts.push(item.call_letters);

  if (item.artist_call_number != null) {
    parts.push(String(item.artist_call_number));
  }

  if (item.release_call_number != null) {
    if (parts.length > 0) {
      parts[parts.length - 1] =
        `${parts[parts.length - 1]}/${item.release_call_number}`;
    }
  }

  return parts.join(" ");
}

const SEARCH_TYPE_LABELS: Record<string, string> = {
  direct: "Direct Match",
  fallback: "Fallback Search",
  alternative: "Alternative Interpretation",
  compilation: "Compilation Match",
  song_as_artist: "Song as Artist",
  none: "No Search",
};

/** Human-readable label for a search_type value. */
export function formatSearchType(type: string): string {
  return SEARCH_TYPE_LABELS[type] ?? type;
}
