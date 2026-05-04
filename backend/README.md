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

3. **Crear base de datos PostgreSQL:**
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

### Autenticación
- `POST /api/register` - Registro de usuario
- `POST /api/login` - Login y obtener JWT token

### Pacientes (requieren token)
- `GET /api/pacientes` - Listar todos
- `POST /api/pacientes` - Crear
- `PUT /api/pacientes/:id` - Actualizar
- `DELETE /api/pacientes/:id` - Eliminar

### Historial Clínico (requieren token)
- `POST /api/historial` - Crear registro
- `GET /api/historial/:pacienteId` - Obtener historial de paciente

## Errores Corregidos

✅ Agregado `verificarToken` a ruta GET `/api/historial/:pacienteId`
✅ JWT_SECRET movido a variables de entorno
✅ Agregados scripts `start` y `dev` en package.json
✅ Validación de entrada en POST de pacientes e historial
✅ Mejorado manejo de errores (console.error)
