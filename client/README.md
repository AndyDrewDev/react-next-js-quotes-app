## Client (Next.js) – Quotes App

### Overview

Next.js 14 + React 18 client for browsing, searching, creating, editing, and deleting quotes. Communicates with the API server documented in the root `README.md`.

### Requirements

- Node.js (LTS) and npm
- Running API server (see `../README.md`)

### Environment variables

Create `client/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

`NEXT_PUBLIC_API_URL` config is read in `app/_config/config.js` and used by the request helper in `app/_utils/apiClient.js`.

### Getting started (development)

```bash
npm install
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) in your browser.

### Available scripts

- `npm run dev`: start Next.js dev server on port 4000
- `npm run build`: build the app for production
- `npm start`: start the production server
- `npm run lint`: run linting
- `npm test`: run unit tests (Jest + React Testing Library)
- `npm run test:watch`: run tests in watch mode

### Production

```bash
npm install
npm run build
npm start
```

Set `NEXT_PUBLIC_API_URL` to your API’s public URL via environment variables on your hosting provider or in `client/.env.production`.

### Project structure (client)

```text
client/
├── app/
│   ├── _components/          #Shared components like buttons and inputs
│   ├── _config/
│   │   ├── config.js           # API base URL (uses NEXT_PUBLIC_API_URL)
│   │   └── InputFields.js      # Form field configs for quote create/edit
│   ├── _hooks/
│   │   ├── useOnClickOutside.js
│   │   ├── useQuoteActions.js  # Create/update/delete logic via apiClient
│   │   └── useQuoteSearch.js   # Search/filter logic and state
│   ├── _utils/                 # Utility functions for fetching data and helper functions
│   │   └── __tests__/
│   │       └── queryParams.test.js
│   └── (routes)/               # Dynamic routes for handling different pages 
│       ├── globals.css
│       ├── layout.js
│       ├── page.js             # Home page
│       ├── favicon.ico
│       ├── fonts/              # Custom font files 
│       ├── quotes/             # Routes related to managing quotes
│       │   ├── create/         # Create quote
│       │   └── [id]/           # Quote details
│       │       └── edit/       # Edit quote
│       └── search/             # Search quotes        
├── jest.config.js
├── jsconfig.json
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
└── README.md
```

Key files:
- `app/_config/config.js`: exposes `API_BASE_URL` from `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3000`).
- `app/_utils/apiClient.js`: centralized `fetch` wrapper used by client features.

### Tech stack

- Next.js 14, React 18
- Tailwind CSS
- React Toastify, React Spinners

### Troubleshooting

- 4xx/5xx responses or toasts on requests: verify `NEXT_PUBLIC_API_URL` and that the API server is running on the expected port.
- CORS or network errors: confirm API base URL and that the server allows requests from the client origin.

For server setup and database seeding see the root `README.md`.
