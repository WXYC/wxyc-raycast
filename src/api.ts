/**
 * TypeScript types mirroring the request-o-matic Python models,
 * and API constants for the WXYC Library Lookup extension.
 */

/** Message classification from AI parsing (services/parser.py) */
export type MessageType = "request" | "dj_message" | "feedback" | "other";

/** Parsed request metadata from AI (services/parser.py) */
export interface ParsedRequest {
  song: string | null;
  album: string | null;
  artist: string | null;
  is_request: boolean;
  message_type: MessageType;
  raw_message: string;
}

/** A single result from Discogs search (discogs/models.py) */
export interface DiscogsSearchResult {
  album: string | null;
  artist: string | null;
  release_id: number;
  release_url: string;
  artwork_url: string | null;
  confidence: number;
}

/**
 * A single item from the WXYC library catalog (library/models.py).
 *
 * Note: `call_number` is a Python `@property` (not `@computed_field`),
 * so it is NOT included in JSON serialization. Compute it client-side
 * via `formatCallNumber()`.
 */
export interface LibraryItem {
  id: number;
  title: string | null;
  artist: string | null;
  call_letters: string | null;
  artist_call_number: number | null;
  release_call_number: number | null;
  genre: string | null;
  format: string | null;
  /** Computed field -- always present in JSON */
  library_url: string;
}

/** Cache performance stats (core/telemetry.py) */
export interface CacheStats {
  memory_hits: number;
  pg_hits: number;
  pg_misses: number;
  api_calls: number;
  pg_time_ms: number;
  api_time_ms: number;
}

/** Combined response from the request pipeline (routers/request.py) */
export interface UnifiedResponse {
  parsed: ParsedRequest;
  artwork: DiscogsSearchResult | null;
  library_results: LibraryItem[];
  search_type: string;
  song_not_found: boolean;
  found_on_compilation: boolean;
  context_message: string | null;
  cache_stats: CacheStats | null;
}

/** Request body for POST /request (routers/request.py) */
export interface RequestBody {
  message: string;
  skip_slack: boolean;
  skip_cache: boolean;
}

/** Default API base URL (production request-o-matic on Railway) */
export const API_BASE_URL =
  "https://request-o-matic-production.up.railway.app/api/v1";
