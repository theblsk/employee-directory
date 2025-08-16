## backend

This backend uses Bun + Express to serve an employee directory powered by RandomUser data.

### Changelog (recent)
- Added Express server in `index.ts` with JSON middleware and a health check at `/health`.
- Implemented datastore with Drizzle ORM + SQLite (Bun) and moved data retrieval to the database.
- Implemented `GET /` to return employees from SQLite (joined with departments) instead of calling RandomUser per request.
- Introduced `src/lib/seedData.ts` to fetch and transform user data.
- Added `src/constants/index.ts` for reusable `TITLES` and `DEPARTMENTS` lists.
- Added DB layer under `src/db/` (`client`, `schema`, `init`) with boot-time seeding only when the DB is empty to avoid unnecessary external API calls during development.
- Updated `package.json` scripts: `dev` (hot reload) and `start`.

### Project structure
```
backend/
  index.ts                 # Express app entry
  src/
    constants/index.ts     # TITLES, DEPARTMENTS
    lib/seedData.ts        # fetch + enrich employee data
    db/
      client.ts            # Bun SQLite + Drizzle client
      schema.ts            # Drizzle tables: departments, employees
      init.ts              # DDL + seed-once at server startup
```

### Install
```bash
bun install
```

### Run
```bash
# dev (hot reload)
bun run --hot index.ts

# or start
bun run index.ts
```

Environment:
- `PORT` (optional): defaults to `4000`.
- `DB_PATH` (optional): path to SQLite file (defaults to `./employee-directory.sqlite`).

### API
- `GET /health`: returns `{ "status": "ok" }`.
- `GET /`: returns employees from the DB. Each employee includes: `id`, `name`, `title`, `department`, `location`, `avatar`, `email`.

Example:
```bash
curl -s http://localhost:4000/ | head -n 20
```

### Data seeding details
- On server start, `src/db/init.ts` creates tables (if missing) and seeds only when the database is empty.
- Data source: `https://randomuser.me/api/?results=50&nat=us,ca,gb,au`.
- Enrichment: handled in `src/lib/seedData.ts`, which formats name, location, title, department, avatar, email.
- Departments are inserted from `src/constants/index.ts` and employees reference them.

### Notes
- Runtime: Bun v1.2.x. Express v5.
- Local SQLite persistence is file-based; cloud/server deployments should use a persistent volume if data must survive restarts.

