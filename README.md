## Employee Directory - Monorepo

This project is a monorepo with a React (Vite) frontend and an Express (Bun) backend. It includes a lightweight SQLite database that can be seeded automatically.

### Prerequisites
- Install Bun: follow the official guide at `https://bun.sh`
  - macOS/Linux (brew): `brew install oven-sh/bun/bun`
  - Or: `curl -fsSL https://bun.sh/install | bash`

### Run locally

1) Backend
```
cd backend
bun install
bun run dev
```
- Server runs at `http://localhost:4000`
- API base path: `http://localhost:4000/api`
  - Departments: `GET /api/departments`
  - Employees: `GET /api/employees`

2) Frontend
```
cd frontend
bun install
bun run dev
```
- App runs at the URL Vite prints (typically `http://localhost:5173`)

### Notes
- The backend uses SQLite. On first run it will create tables and seed data if empty.


