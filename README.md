# Dvince — Free Knowledge & Skills Exchange Platform

A full-stack project (CSC105 Group 10).

- **Frontend:** React + TypeScript + Vite + Tailwind + React Router (`frontend/`)
- **Backend:** Express + Prisma + SQLite + JWT + Zod (`backend/`)

> The `react-app/` folder is a duplicate of the older frontend kept for reference. Use `frontend/` as the active app.

---

## 1. Backend setup

```bash
cd backend
cp .env.example .env          # then edit JWT_SECRET if you want
npm install
npx prisma migrate deploy     # applies the bundled migration to dev.db
npx prisma generate
npm run dev                   # http://localhost:5000
```

If `migrate deploy` complains because the DB doesn't exist yet, run
`npx prisma migrate dev --name init` instead.

### Environment variables (`backend/.env`)

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite file URL — keep as `file:./dev.db` |
| `JWT_SECRET`   | Long random string used to sign JWTs |
| `PORT`         | API port (default `5000`) |
| `FRONTEND_URL` | Used in password-reset links |

---

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

The frontend talks to `http://localhost:5000` directly (see `pages/*.tsx`).

---

## 3. API reference

All JSON. Protected routes need `Authorization: Bearer <token>`.

### Auth — `/auth`
| Method | Path | Body | Notes |
| ------ | ---- | ---- | ----- |
| POST | `/auth/register` | `{ email, password, name }` | Returns `{ token, id, user }` |
| POST | `/auth/login` | `{ email, password }` | Returns `{ token, id, user }` |
| POST | `/auth/forgot-password` | `{ email }` | Logs reset link to server console |
| POST | `/auth/reset-password/:token` | `{ password }` | |

### Profile / users
| Method | Path | Auth | Notes |
| ------ | ---- | ---- | ----- |
| GET  | `/me` | yes | Current user + skills |
| PUT  | `/me` | yes | Update profile fields (`name`, `username`, `bio`, `profilePicture`, `phoneNumber`, `dateOfBirth`, `city`, `country`) |
| GET  | `/users/:id` | no | Public profile + skills |
| GET  | `/users/:id/skills` | no | Skills for a given user |

### Skills — `/skills`
| Method | Path | Auth |
| ------ | ---- | ---- |
| GET    | `/skills` | yes (own skills) |
| POST   | `/skills` | yes |
| PUT    | `/skills/:id` | yes (owner only) |
| DELETE | `/skills/:id` | yes (owner only) |

Skill payload:
```json
{
  "name": "Guitar",
  "category": "Music",
  "subCategory": "String",
  "experienceLevel": "Advanced",
  "description": "...",
  "preferences": "online",
  "schedule": { "days": ["Monday"], "timeStart": "10:00", "timeEnd": "12:00" }
}
```

### Search
`GET /search?q=<term>` — searches users by name/username/email and skill name/category/subCategory. Returns up to 100 users with their skills.

### Messages / chats
| Method | Path | Auth | Notes |
| ------ | ---- | ---- | ----- |
| POST | `/messages` | yes | `{ content, receiverId }` |
| GET  | `/messages/:userId` | yes | Conversation between current user and `:userId` (asc) |
| GET  | `/chats` | yes | One entry per conversation partner with last message |

### Validation & errors
Every body is validated with Zod. Validation failures return `400`:
```json
{ "error": "Validation failed", "details": [{ "path": "email", "message": "Invalid email" }] }
```

---

## 4. Project structure

```
backend/
  prisma/
    schema.prisma          # User, Skill, Message
    migrations/            # init migration
  src/
    server.js              # Express app + all routes
    prisma.js              # PrismaClient singleton
    validators.js          # Zod schemas
    middleware/auth.js     # JWT auth middleware
    auth/auth.routes.js    # /auth router
    utils/email.js         # Optional nodemailer helper
frontend/
  src/app/
    pages/                 # Route components
    components/            # Shared UI (Header, BottomNav, ...)
    context/AuthContext.tsx
    routes.tsx             # createBrowserRouter config
```

---

## 5. What was completed in this iteration (backend)

- Extended `User` model with profile fields (`username`, `bio`, `profilePicture`, `phoneNumber`, `dateOfBirth`, `city`, `country`).
- Extended `Skill` model with `category`, `subCategory`, `experienceLevel`, `description`, `preferences`, `schedule*`.
- `Message` model now has proper sender/receiver relations with cascade.
- Removed the SQLite-incompatible `mode: "insensitive"` from auth queries (it caused login crashes).
- Auth: register/login/forgot/reset all use Zod, JWT signed with 7-day expiry, bcrypt password hashing.
- Profile: `GET /me`, `PUT /me`, `GET /users/:id`, `GET /users/:id/skills`.
- Skills: full CRUD with ownership checks.
- Search across user names + skill metadata.
- Messages: send / list-with-user / list-conversations.
- Consistent error responses + `404` and unhandled-error middleware.
- Bundled SQL migration so Prisma can deploy the schema in one command.
