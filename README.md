# FindMate

Campus lost & found web application.

## Architecture

```
Browser (HTTPS)
   ↓
Vercel (frontend: React + Vite build)
   ↓ HTTPS API
Render (backend: Node + Express)
   ↓
PostgreSQL (Render managed)
   ↓
Cloudinary (image storage)
```

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL (local or Docker)
- npm

### Setup

```bash
# 1. Clone and install frontend
npm install

# 2. Install backend dependencies
cd server && npm install

# 3. Create environment files
# Copy root .env.example
cp .env.example .env
# Copy server .env.example
cp server/.env.example server/.env

# 4. Start backend (in-memory dev database on port 4000)
cd server
npm run dev:mem

# 5. Start frontend (in a separate terminal)
cd ..
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api/*` to the backend on `http://localhost:4000`.

### Development Notes

- The backend uses `pg-mem` (in-memory PostgreSQL) in development mode. Data is ephemeral.
- For a persistent database locally, set `DATABASE_URL` in `server/.env` and run `npm run dev` instead of `npm run dev:mem`.

### Testing

```bash
# Frontend tests
npm test

# Backend tests
cd server && npm test

# Initialize schema on a real database
cd server && npm run db:init
```

## Production Deployment

### Overview

- **Frontend**: Vercel (builds from project root)
- **Backend**: Render (builds from `server/` directory)
- **Database**: Render PostgreSQL
- **Image storage**: Cloudinary

### Deployment Steps

#### 1. Set up the database (Render PostgreSQL)

Create a PostgreSQL database on Render. Note the `DATABASE_URL`.

Initialize the schema:

```bash
# Run in Render shell or locally against production DB
cd server && npm run db:init
```

#### 2. Deploy the backend (Render)

1. Create a new Web Service on Render.
2. Set the build command: `npm run build && npm start`
3. Set the start command: `npm start`
4. Set the root directory to `server/`.
5. Configure the following environment variables:
   - `DATABASE_URL` — from your Render PostgreSQL plugin
   - `CORS_ORIGIN` — your Vercel frontend URL (e.g., `https://findmate.vercel.app`)
   - `AUTH_SECRET` — a long random string (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `SESSION_COOKIE_NAME` — e.g., `fm_session`
   - Cloudinary variables (see below)

#### 3. Set up Cloudinary (image storage)

1. Create a Cloudinary account.
2. Note your `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
3. Add these to your Render environment variables.

#### 4. Deploy the frontend (Vercel)

1. Import your GitHub repository into Vercel.
2. Set the build command: `npm run build`
3. Set the output directory: `dist`
4. Add the environment variable:
   - `VITE_API_URL` — your Render backend URL with `/api` suffix (e.g., `https://findmate-api.onrender.com/api`)

### Required Environment Variables

#### Frontend (Vercel)

| Variable | Example | Required |
|----------|---------|----------|
| `VITE_API_URL` | `https://api.findmate.onrender.com/api` | Yes |

#### Backend (Render)

| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Yes |
| `CORS_ORIGIN` | `https://findmate.vercel.app` | Yes |
| `AUTH_SECRET` | (32+ byte random hex) | Yes |
| `SESSION_COOKIE_NAME` | `fm_session` | No (defaults to `findmate_session`) |
| `PORT` | (auto from Render) | No |
| `NODE_ENV` | `production` (auto from Render) | No |
| `CLOUDINARY_CLOUD_NAME` | your-cloud-name | Yes (for image uploads) |
| `CLOUDINARY_API_KEY` | your-api-key | Yes (for image uploads) |
| `CLOUDINARY_API_SECRET` | your-api-secret | Yes (for image uploads) |

### Authentication / Sessions Across Environments

- Sessions are stored in PostgreSQL via `connect-pg-simple`.
- Cookies are `HttpOnly`, `Secure` (production only), and `SameSite=Lax`.
- The backend sets `trust proxy` in production to correctly handle cookies behind Render's load balancer.
- CORS is configured to allow the Vercel frontend origin with `credentials: true`.
- The session cookie name must match between the frontend API client (which uses `credentials: 'include'`) and the backend configuration.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/auth/register` | No | Register new account |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | No | Logout |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/items` | No | List all items |
| GET | `/api/items/mine` | Yes | List user's items |
| GET | `/api/items/:id` | No | Get item by ID |
| POST | `/api/items` | Yes | Create a new item |
| POST | `/api/upload/image` | Yes | Upload image to Cloudinary |
| GET | `/api/contact-requests` | Yes | List user's contact requests |
| POST | `/api/contact-requests` | Yes | Create a contact request |
| PATCH | `/api/contact-requests/:id` | Yes | Update a contact request |

## Image Uploads

Images are uploaded directly to Cloudinary via a signed backend endpoint. The frontend:

1. Uploads the file to `POST /api/upload/image`
2. Receives a Cloudinary URL in response
3. Sends that URL in the item creation request as the `image` field

This avoids sending large base64 data in JSON API requests and provides CDN-backed image delivery.

## Troubleshooting

### API requests blocked by CORS in production

1. Verify `CORS_ORIGIN` on the backend matches your Vercel frontend URL exactly (including `https://`).
2. Check that `credentials: 'include'` is set on the frontend API client (it is, in `src/lib/api/client.ts`).
3. Check browser DevTools Network tab for CORS errors.

### Sessions not persisting

1. Verify `AUTH_SECRET` is set in the backend environment.
2. Verify the cookie name matches (`SESSION_COOKIE_NAME`).
3. In production, cookies require HTTPS — ensure both Vercel and Render use HTTPS.
4. `trust proxy` is set to `1` in production to handle cookies behind Render's load balancer.

### Database connection errors

1. Verify `DATABASE_URL` is correctly set in the backend environment.
2. Run `npm run db:init` from the `server/` directory to initialize the schema.
3. Check that the PostgreSQL instance is not paused (Render free tier databases sleep).

### Vite API URL not working

1. Verify `VITE_API_URL` is set in the Vercel environment variables.
2. The URL should include the `/api` suffix (e.g., `https://api.findmate.onrender.com/api`).
3. The API client falls back to `/api` if `VITE_API_URL` is not set.

### Health check fails

The health check endpoint is `GET /health`. If it returns non-200, the backend failed to start (check logs for missing environment variables).
