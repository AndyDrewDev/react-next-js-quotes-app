## React + Next.js Quotes App (Client) and Node/Express API (Server)

### Overview

Full‑stack quotes application:
- **Client**: Next.js 14 + React 18 UI for browsing, searching, creating, editing, and deleting quotes
- **Server**: Node.js + Express + Sequelize REST API backed by **PostgreSQL**
- **DB utilities**: Docker Compose for Postgres and Adminer; scripts and dump for seeding

### Monorepo layout

```text
react-next-js-quotes-app/
  client/              # Next.js app (port 4000 in dev)
  server/              # Express API (default port 3000)
```

### Prerequisites

- Node.js (LTS recommended) and npm
- Docker and Docker Compose (for local Postgres + Adminer)

### Quick start (development)

1) Start database (Docker)

```bash
cd server
docker compose up -d
```

This starts:
- Postgres on `localhost:5432`
- Adminer on `localhost:8080` (open http://localhost:8080)

2) Seed database (choose one)

- Option 1 (faster): Import `db-without-rare-categories.sql.gz` via Adminer.
  - Connect with:
    - System: PostgreSQL
    - Server: `postgres`
    - Username: `admin`
    - Password: `admin_password`
    - Database: `db`
  - Use Adminer “Import” to upload the dump from `server/src/database/data/db-without-rare-categories.sql.gz`.

- Option 2 (slower): Run CSV import scripts, then remove rare categories.
  - See detailed steps in `server/src/database/seed/README.md`.

3) Configure and run the API server

Environment variables (defaults shown):

```bash
# server/.env (optional – defaults match docker-compose)
APP_PORT=3000
DB_NAME=db
DB_USER=admin
DB_PASSWORD=admin_password
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
```

Start the API:

```bash
cd server
npm install
npm run dev
# API will run on http://localhost:3000
```

4) Configure and run the client

Set the API base URL for the client:

```bash
# client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start the Next.js app:

```bash
cd client
npm install
npm run dev
# Client will run on http://localhost:4000
```

### Production notes

- Run PostgreSQL in your environment and provide credentials via `server/.env`.
- Start API:

```bash
cd server
npm install
npm start
```

- Build and run client:

```bash
cd client
npm install
npm run build
npm start
```

Set `NEXT_PUBLIC_API_URL` to your API’s public URL in `client/.env.production` (or environment variables in your hosting provider).

### API reference (high‑level)

Base URL: `http://<api-host>:<port>` (default `http://localhost:3000`). All responses are JSON.

- Quotes
  - `GET /quotes` — list quotes (supports query params such as paging and filters used by the client)
  - `GET /quotes/random` — list random quotes (accepts optional `limit`)
  - `GET /quotes/:id` — get a single quote
  - `POST /quotes` — create a quote
  - `PATCH /quotes/:id` — update a quote
  - `DELETE /quotes/:id` — delete a quote

- Categories
  - `GET /categories` — list categories (supports basic query params)
  - `GET /categories/:id` — get a single category

Validation errors follow a consistent shape and, where applicable, include field-level details used by the client for toasts.

### Client configuration and scripts

Config:
- API base URL: `client/app/_config/config.js` uses `NEXT_PUBLIC_API_URL` (falls back to `http://localhost:3000`).

Common scripts:

```bash
cd client
npm run dev       # Next.js dev server on port 4000
npm run build     # Build for production
npm start         # Start production server
npm test          # Run client tests (Jest + React Testing Library)
```

### Server scripts

```bash
cd server
npm run dev       # Start API with nodemon
npm start         # Start API (node)
```

### Troubleshooting

- If the client cannot reach the API, verify `NEXT_PUBLIC_API_URL` and that the API is listening on `APP_PORT`.
- Ensure Docker containers are up (`docker compose ps`) and Postgres credentials match `server/.env` (or defaults).
- For large CSV imports, consider using the provided dump file via Adminer for faster setup.

