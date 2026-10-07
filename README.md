# LuxArs App — guía para correrlo en tu PC

Proyecto con dos partes:
- **Backend:** Django + Django REST (carpeta `config/`, `users/`, `bookings/`, `chat/`, `portfolio/`). Corre en `http://127.0.0.1:8000`.
- **Frontend:** React + Vite (carpeta `src/`). Corre en `http://localhost:5173` y le pide datos al backend.

Trabajamos en la rama `prueba`. Las demás (`main`, `backend`, `frontend`) no las toques por ahora.

## 1. Qué instalar antes

- Python 3.11 o más nuevo (`python3 --version`)
- Node 20 o más nuevo (`node --version`) + npm
- Git

No necesitas instalar Postgres para probar. Por defecto usamos un archivo local `db.sqlite3`.

## 2. Clonar el proyecto

```bash
git clone https://github.com/serpa25t-root/DJluxars.git
cd DJluxars
git checkout prueba
```

## 3. Arrancar el backend (Django)

Hazlo una sola vez para preparar, y luego cada vez que quieras trabajar.

```bash
# 1. Crear el entorno virtual (carpeta env/, solo tuya, no se sube a git)
python3 -m venv env
source env/bin/activate

# 2. Instalar librerías
pip install -r requirements.txt

# 3. Crear tu archivo de claves a partir del ejemplo
cp .env.example .env

# 4. Genera una clave secreta y pégala en .env donde dice SECRET_KEY=
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Tu `.env` para trabajar en local debe quedar así (ya viene casi listo en `.env.example`):

```
SECRET_KEY=lo-que-generaste-arriba
DEBUG=True
USE_SQLITE=True
VITE_API_URL=http://127.0.0.1:8000/api/
```

Qué significa cada cosa:
- `SECRET_KEY`: contraseña interna de Django. Obligatoria. Sin esto el backend no arranca.
- `USE_SQLITE=True`: usa base de datos local en un archivo. Pon `False` solo si vas a usar Supabase de verdad.
- `VITE_API_URL`: dónde está el backend. El frontend la usa para conectarse.

Ahora crea las tablas y arranca:

```bash
source env/bin/activate
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Si ves algo como `Starting development server at http://127.0.0.1:8000/`, va bien.
Para comprobar salud del backend en otra terminal: `python manage.py check` debe decir `System check identified no issues`.

## 4. Arrancar el frontend (React)

Abre **otra terminal** en la misma carpeta (el backend sigue corriendo en la primera):

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador. Si ves la landing y puedes registrarte / loguearte, todo está conectado.

Otros comandos útiles:

```bash
npm run build    # genera dist/ para producción
npm run preview  # previsualiza el build
npm run lint     # revisa errores de código
```

## 5. Cómo sé que quedó bien

- Backend: `http://127.0.0.1:8000/admin/` abre (aunque pida login).
- Frontend: `http://localhost:5173` abre y no muestra error rojo de red.
- Registro pide: nombre, email, teléfono, departamento, ciudad, contraseña y rol.
- Login acepta email o usuario.

## 6. Si algo falla

| Qué ves | Qué hacer |
|---|---|
| `SECRET_KEY no está configurada` | No hiciste `cp .env.example .env` o dejaste `SECRET_KEY` vacía. |
| `Network is unreachable` a Supabase | Tu internet no tiene IPv6. Deja `USE_SQLITE=True` en `.env`. Solo usa `DB_HOST` tipo `aws-0-*.pooler.supabase.com` si de verdad necesitas Supabase. |
| El frontend dice error de red / CORS | Revisa que el backend esté corriendo en el puerto 8000 y que en `.env` esté `CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000` y `VITE_API_URL=http://127.0.0.1:8000/api/`. |
| Error `401` en bucle | En el navegador borra `localStorage` (`access`, `refresh`, `token`, `user`) y vuelve a loguearte. |
| `Could not resolve ../../services/bookings` | Importa desde `../../services/bookingsStore` y `../../services/chatStore` (así se llaman ahora, no `bookings` / `chat` solos). |
| Django pide migraciones raras en `users` | No crees archivos `0002/0003` viejos. El modelo actual es `users.LuxUser` y ya trae todo en `0001_initial`. `makemigrations --check` debe decir `No changes detected`. |

## 7. Notas técnicas cortas

- Login: `POST /api/token/` con `{username|email, password}`. El token se guarda en `localStorage` y se envía como `Authorization: Bearer <access>`. Se refresca solo en `src/services/apiClient.js`.
- Registro: `POST /api/users/register/`, perfil: `GET /api/users/me/`. Más rutas: `/api/portfolio/`, `/api/bookings/`, `/api/chat/`.
- Archivos clave: `config/settings.py` (lee el `.env`), `src/services/apiClient.js` (URL del backend), `src/pages/Register.jsx` (selectores de departamento/ciudad), `users/models.py` (modelo `LuxUser`).
- No se sube a git: `env/`, `.env`, `db.sqlite3`, `node_modules/`, `dist/`, `media/`, `.vite/`.
