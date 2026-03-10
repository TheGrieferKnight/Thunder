# Thunder - League of Legends Analytics Desktop App

Thunder is a Tauri-based desktop application for analyzing League of Legends match data. It provides an interface for running SQL queries against a DuckDB database containing game data.

## Tech Stack

- **Frontend**: React 19, TanStack Router, TanStack Query, TanStack Table, TailwindCSS 4
- **Backend**: Rust with Tauri 2
- **Database**: DuckDB (bundled)
- **TypeScript Bindings**: Specta

## Features

### SQL Runner (/)
Execute raw SQL queries against the DuckDB database and view results in a dynamic, auto-generated table.

### Tierlist (/tierlist)
View champion statistics in a sortable table interface.

### Settings (/settings)
Application settings and preferences page.

## Project Structure

```
thunder/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── routes/             # Page routes
│   ├── commands/           # Query hooks
│   └── bindings.ts         # Tauri command bindings
├── src-tauri/             # Rust backend
│   └── src/
│       ├── commands/       # Tauri commands
│       ├── models/         # Data models
│       └── services/       # Database and infrastructure
└── package.json
```

## Building

```bash
# Install dependencies
npm install

# Development
npm run tauri dev

# Build
npm run tauri build
```
