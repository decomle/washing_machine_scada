# Basic Backend Starter

Reusable FastAPI backend starter extracted from the Momentum project.

Included basics:

- i18n with English and Vietnamese locale resources
- async SQLAlchemy database setup
- JWT authentication with refresh-token cookies
- logging bootstrap
- `auth_router`
- `user_router`
- custom exception handlers

## Quick start

1. Create a virtualenv and install dependencies:

```bash
pip install -r requirements.txt
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Run the API:

```bash
uvicorn app.main:app --reload
```

## Default routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/users/me`
- `PATCH /api/users/me`

## Notes

- The starter defaults to SQLite for quick local use.
- Swap `DATABASE_URL` to PostgreSQL with `asyncpg` when you start a real project.
- The app auto-creates tables at startup for convenience.
