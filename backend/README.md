# Backend - Sistema Clínico

## Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
   - Copiar `.env.example` a `.env`
   - Editar `.env` con tus valores de base de datos y JWT_SECRET

```bash
cp .env.example .env
```

3. **Estructura del backend:**

- `app.js` - Configura Express, CORS y monta las rutas.
- `server.js` - Inicia el servidor.
- `config/db.js` - Conexión a PostgreSQL.
- `middlewares/auth.js` - Verifica JWT.
- `routes/` - Define rutas por recurso.
- `controllers/` - Contiene la lógica de negocio.

4. **Crear base de datos PostgreSQL:**
```sql
CREATE DATABASE sistema_clinico;

-- Conectarse a la BD
\c sistema_clinico

-- Crear tablas
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  rol VARCHAR(50)
);

CREATE TABLE pacientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  documento VARCHAR(20) UNIQUE,
  edad INTEGER,
  sexo VARCHAR(10),
  diagnostico TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historial_clinico (
  id SERIAL PRIMARY KEY,
  paciente_id INTEGER REFERENCES pacientes(id),
  fecha DATE,
  sintomas TEXT,
  diagnostico TEXT,
  tratamiento TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Ejecutar

**Desarrollo (con nodemon):**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints

### Autenticación (público)
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login y obtener JWT token
- `GET /api/auth/me` - Obtener datos del usuario actual (requiere token)

### Usuarios (solo admin)
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios` - Listar usuarios
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Pacientes (requieren token)
- `GET /api/pacientes` - Listar todos (admin, doctor, recepcionista)
- `POST /api/pacientes` - Crear (admin, doctor)
- `PUT /api/pacientes/:id` - Actualizar (admin, doctor)
- `DELETE /api/pacientes/:id` - Eliminar (admin)

### Historial Clínico (requieren token)
- `POST /api/historial` - Crear registro (admin, doctor)
- `GET /api/historial/:pacienteId` - Obtener historial (admin, doctor, recepcionista)

### Citas (requieren token)
- `POST /api/citas` - Crear cita (admin, doctor, recepcionista)
- `GET /api/citas` - Listar citas (admin, doctor, recepcionista)
- `PUT /api/citas/:id` - Actualizar cita (admin, doctor)
- `DELETE /api/citas/:id` - Eliminar cita (admin)

## Roles y Permisos

- **admin**: Acceso total a todas las rutas
- **doctor**: Acceso a pacientes, historial y citas (crear, leer, actualizar)
- **recepcionista**: Acceso de lectura a pacientes, historial y citas (crear citas)

## Estructura del Backend

```
backend/
├── server.js              # Punto de entrada
├── app.js                 # Configuración de Express
├── config/
│   ├── db.js             # Conexión a PostgreSQL
│   └── roles.js          # Definición de roles
├── middlewares/
│   ├── auth.js           # Verificación de JWT
│   ├── authorize.js      # Verificación de roles
│   └── index.js          # Exportación de middlewares
├── routes/
│   ├── auth.routes.js    # Rutas de autenticación
│   ├── usuarios.routes.js # Rutas de gestión de usuarios
│   ├── pacientes.routes.js
│   ├── citas.routes.js
│   └── historial.routes.js
├── controllers/
│   ├── authController.js
│   ├── usuariosController.js
│   ├── pacientesController.js
│   ├── citasController.js
│   └── historialController.js
├── .env                  # Variables de entorno
├── .env.example          # Ejemplo de variables
└── package.json
```
