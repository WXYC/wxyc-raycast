# WXYC Library Lookup

A [Raycast](https://raycast.com) extension for searching the WXYC 89.3 FM music library using natural language queries.

Type something like "play Bohemian Rhapsody by Queen" and the extension calls the [request-o-matic](https://github.com/WXYC/request-o-matic) API to parse your query with AI, search the library catalog, and fetch album artwork from Discogs.

## Features

- **Natural language search** -- AI-powered parsing understands queries like "anything by Radiohead", "play Kind of Blue", or "Manu Dibango Abele Dance"
- **Library catalog results** -- browse matching albums with artist, title, genre, format, and call number
- **Album artwork** -- Discogs artwork displayed in the detail panel when available
- **Search strategy info** -- see how your query was interpreted (direct match, fallback, compilation, alternative interpretation)
- **Quick actions** -- open in the WXYC library, open on Discogs, copy call number or artist/title

## Configuration

| Preference | Description | Default |
|---|---|---|
| API Base URL | Base URL of the request-o-matic API | `https://request-o-matic-production.up.railway.app/api/v1` |

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start dev mode (opens in Raycast)
npm run dev

# Build
npm run build

# Lint (with auto-fix)
npm run fix-lint
```

## About WXYC

[WXYC 89.3 FM](https://wxyc.org) is the student-run radio station at the University of North Carolina at Chapel Hill. The library catalog contains tens of thousands of albums spanning every genre. This extension helps DJs and listeners quickly look up music in the collection.
