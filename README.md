# LuxArs App

Backend en Django + Django REST Framework (JWT) y frontend en React + Vite + Tailwind.

Ramas principales: `main` (base), `prueba` (integración), `backend`, `frontend`.

## Requisitos

- Python 3.11+ (probado en 3.14.7)
- Node 20+ y npm 10+ (probado Node v20.19.0)
- Opcional para dev con Postgres: cuenta Supabase. Para empezar rápido **no necesitas Postgres**: con `USE_SQLITE=True` usa `db.sqlite3` local.

## Puesta en marcha en un PC nuevo (5 min)

### 1. Clonar y backend

```bash
git clone https://github.com/serpa25t-root/DJluxars.git
cd DJluxars
git checkout prueba

python3 -m venv env
source env/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Genera una clave y ponla en SECRET_KEY dentro de .env:
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

`.env` mínimo para desarrollo local (sin Supabase):

```
SECRET_KEY=la-clave-generada-arriba
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
USE_SQLITE=True
VITE_API_URL=http://127.0.0.1:8000/api/
```

Arranca el backend:

```bash
source env/bin/activate
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Verifica: `http://127.0.0.1:8000/api/` responde, admin en `http://127.0.0.1:8000/admin/`.
`manage.py check` debe decir `System check identified no issues`.

### 2. Frontend (otra terminal)

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. El frontend llama al backend con `VITE_API_URL` (por defecto `http://127.0.0.1:8000/api/`, ver `src/services/apiClient.js`).

Build de producción:

```bash
npm run build
npm run preview
```

## Variables de entorno (`.env`)

| Variable | Obligatoria | Default | Qué hace |
|---|---|---|---|
| `SECRET_KEY` | Sí (sin fallback) | — | Clave Django. Sin ella `manage.py` falla con `ValueError`. |
| `DEBUG` | No | `True` | `True` en local. En prod pon `False` (activa headers `SECURE_*`, cookies `Secure`). |
| `ALLOWED_HOSTS` | No | `localhost,127.0.0.1` | Hosts permitidos, separados por coma. |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:5173,http://localhost:3000` | Orígenes frontend permitidos. |
| `USE_SQLITE` | No | `False` | `True` → usa `db.sqlite3` local aunque haya `DB_*`. Recomendado en local. |
| `DB_NAME/DB_USER/DB_PASSWORD/DB_HOST/DB_PORT` | Solo si `USE_SQLITE=False` | — | Conexión Postgres/Supabase. Usa el pooler (`aws-0-*.pooler.supabase.com`), el host directo `db.*.supabase.co` es solo IPv6 y falla en redes sin IPv6. |
| `VITE_API_URL` | No | `http://127.0.0.1:8000/api/` | Leída por Vite (`import.meta.env`). Debe terminar en `/api/`. |

`env/` es el venv (no se sube), `.env` son las claves (no se sube). Ver `.gitignore`.

## Endpoints backend

```
GET  /api/users/me/
POST /api/users/register/  {name, email, phone, departamento, ciudad, password, role}
POST /api/token/           {username|email, password}
POST /api/token/refresh/   {refresh}
GET  /api/portfolio/  /api/bookings/  /api/chat/
```

Auth: `Authorization: Bearer <access>`, con autorefresco en `src/services/apiClient.js`.

## Problemas comunes

- `ValueError: SECRET_KEY no está configurada` → no copiaste `.env` o falta `SECRET_KEY`. Haz `cp .env.example .env` y genera una.
- `Network is unreachable` a Supabase → tu red no tiene IPv6. Pon `USE_SQLITE=True` o cambia `DB_HOST` al pooler IPv4.
- `CORS` / frontend no conecta → revisa `CORS_ALLOWED_ORIGINS` incluya `http://localhost:5173` y que `VITE_API_URL` apunte a `http://127.0.0.1:8000/api/`.
- `401` en loop → borra `access/refresh/token/user` de `localStorage` y loguéate de nuevo.
- Migraciones `users`: están squasheadas en `0001_initial` (modelo `users.LuxUser` ya incluye `departamento, ciudad, avatar, cover, website`). No re-crees `0002/0003` viejos con `model_name='user'`; `makemigrations --check` debe decir `No changes detected`.
- `Could not resolve ../../services/bookings` → usa `bookingsStore` / `chatStore` (nombres tras refactor `fd85698`), no `bookings` / `chat` a secas.

## Scripts

```bash
# backend
python manage.py check
python manage.py migrate
python manage.py runserver 127.0.0.1:8000

# frontend
npm run dev      # dev en :5173
npm run build    # build a dist/
npm run preview
npm run lint
```
