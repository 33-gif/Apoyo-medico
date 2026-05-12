# Sistema Clínico - Frontend

## Descripción
Frontend del Sistema Clínico con arquitectura SCSS modular y servicios centralizados.

## Estructura del Proyecto

```
frontend/
├── css/
│   ├── style.scss          # Archivo principal SCSS
│   ├── style.css           # CSS compilado (generado automáticamente)
│   └── scss/               # Archivos SCSS modulares
│       ├── _variables.scss # Variables globales
│       ├── _mixins.scss    # Mixins reutilizables
│       ├── _base.scss      # Estilos base
│       ├── _layout.scss    # Layout y estructura
│       ├── _buttons.scss   # Estilos de botones
│       ├── _forms.scss     # Estilos de formularios
│       ├── _tables.scss    # Estilos de tablas
│       ├── _modals.scss    # Estilos de modales
│       ├── _navigation.scss# Estilos de navegación
│       ├── _components.scss# Componentes específicos
│       └── _calendar.scss  # Estilos del calendario
├── js/
├── pages/
├── services/
├── utils/
├── components/
├── index.html              # Página de inicio/login
├── login.html              # Página de login
├── dashboard.html          # Dashboard principal
├── admin.html              # Panel de administración
└── package.json
```

## Sistema SCSS Modular

### Variables Globales (`_variables.scss`)
- Colores del sistema
- Espaciado consistente
- Tipografía
- Breakpoints responsivos
- Sombras y bordes

### Mixins Reutilizables (`_mixins.scss`)
- Media queries responsivas
- Flexbox helpers
- Botones con gradientes
- Animaciones y transiciones
- Accesibilidad (focus, reduced-motion)

### Arquitectura de Estilos
1. **Variables**: Colores, espaciado, tipografía
2. **Mixins**: Funciones reutilizables
3. **Base**: Reset, tipografía, elementos HTML
4. **Layout**: Estructura de la aplicación
5. **Componentes**: Botones, formularios, tablas, etc.
6. **Páginas**: Estilos específicos por página

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm

### Instalación
```bash
cd frontend
npm install
```

### Desarrollo
Para desarrollo con compilación automática:
```bash
npm run dev
# o
npm run watch-css
```

### Producción
Para compilar CSS optimizado:
```bash
npm run build
# o
npm run build-css
```

## Scripts Disponibles

- `npm run build-css`: Compila SCSS a CSS comprimido
- `npm run watch-css`: Modo watch para desarrollo (compilación automática)
- `npm run dev`: Alias para watch-css
- `npm run start`: Alias para watch-css

## Arquitectura de Servicios

### ApiService (`services/apiService.js`)
- Cliente HTTP centralizado
- Autenticación automática con JWT
- Manejo de errores consistente
- Interceptors para requests/responses

### AuthService (`services/authService.js`)
- Gestión de autenticación
- Login/logout
- Validación de tokens
- Persistencia de sesión

### Servicios Específicos
- `citasService.js`: Gestión de citas médicas
- `pacientesService.js`: Gestión de pacientes
- `historialService.js`: Historial médico
- `usuariosService.js`: Gestión de usuarios (solo admin)

## Roles y Autorización

### Sistema de Roles
- **Admin**: Acceso completo al sistema
- **Doctor**: Gestión de pacientes y citas
- **Recepcionista**: Gestión de citas y recepción

### Middleware de Autorización
- `requireRole(role)`: Requiere rol específico
- `requireSelfOrRole(role)`: Usuario puede acceder a sus propios datos o con rol específico

## Responsive Design

### Breakpoints
- `mobile`: < 768px
- `tablet`: 768px - 1024px
- `desktop`: 1024px - 1440px
- `large`: > 1440px

### Mixins Responsivos
```scss
@include media-mobile {
  // Estilos para móviles
}

@include media-tablet {
  // Estilos para tablets
}

@include media-desktop {
  // Estilos para desktop
}
```

## Convenciones de Código

### SCSS
- Usar guiones para separar palabras en nombres de archivos
- Prefijo `_` para archivos parciales
- Variables en kebab-case: `$primary-color`
- Mixins en kebab-case: `@mixin flex-center`
- Funciones en kebab-case: `color(primary)`

### JavaScript
- Servicios centralizados en `/services`
- Utilidades en `/utils`
- Componentes en `/js`
- Páginas en `/pages`

## Desarrollo

### Agregar Nuevos Estilos
1. Crear archivo parcial en `css/scss/_nuevo-componente.scss`
2. Importar en `style.scss`
3. Usar variables y mixins existentes
4. Seguir convenciones responsivas

### Modificar Variables Globales
Editar `_variables.scss` para cambios globales de:
- Colores
- Espaciado
- Tipografía
- Breakpoints

### Agregar Nuevos Mixins
Agregar en `_mixins.scss` y documentar su uso.

## Compilación Automática

El sistema está configurado para:
- Compilar automáticamente al guardar archivos SCSS
- Generar source maps para debugging
- Optimizar CSS en producción
- Mantener estructura modular mantenible

## Servicios Disponibles

### ApiService
- `get(endpoint)` - GET request
- `post(endpoint, data)` - POST request
- `put(endpoint, data)` - PUT request
- `delete(endpoint)` - DELETE request
- `logout()` - Cierra sesión

### AuthService
- `login(email, password)` - Login del usuario
- `getMe()` - Obtiene datos del usuario actual
- `logout()` - Cierra sesión
- `isAuthenticated()` - Verifica autenticación
- `getUser()` - Retorna datos del usuario
- `isAdmin()` - Verifica si es administrador
- `getRole()` - Obtiene el rol del usuario

## Troubleshooting

### Errores de Compilación SCSS
- Verificar sintaxis en archivos SCSS
- Comprobar que todas las variables estén definidas
- Revisar imports en `style.scss`

### Problemas de Autenticación
- Verificar token JWT en localStorage
- Comprobar expiración del token
- Revisar configuración del backend

### Issues Responsivos
- Usar mixins de media queries
- Verificar breakpoints en `_variables.scss`
- Probar en diferentes dispositivos

## Contribución

1. Seguir la estructura modular SCSS
2. Usar variables y mixins existentes
3. Mantener consistencia en nomenclatura
4. Documentar nuevos componentes
5. Probar responsive design

## Licencia
MIT

### UsuariosService (Solo Admin)
- `crearUsuario(nombre, email, password, rol)`
- `obtenerUsuarios()`
- `actualizarUsuario(id, datos)`
- `eliminarUsuario(id)`

### PacientesService
- `crear(nombre, documento, edad, sexo, diagnostico)`
- `obtener()`
- `actualizar(id, datos)`
- `eliminar(id)`

### CitasService
- `crear(paciente_id, fecha, hora, motivo)`
- `obtener()`
- `actualizar(id, datos)`
- `eliminar(id)`

### HistorialService
- `crear(paciente_id, fecha, sintomas, diagnostico, tratamiento)`
- `obtenerPorPaciente(pacienteId)`

## Funciones de Utilidad

En `utils/auth.js`:
- `checkAuth()` - Valida autenticación, redirige si no está autenticado
- `checkAdminAuth()` - Valida que sea admin, redirige si no
- `checkAuthLogin()` - Redirige a dashboard si ya está autenticado
- `formatDate(dateString)` - Formatea fechas
- `showAlert(message, type)` - Muestra alerta visual

## Páginas Principales

### login.html
- Página de inicio de sesión
- Si el usuario es admin, redirige a admin.html
- Si es otro rol, redirige a dashboard.html

### dashboard.html
- Panel principal para médicos y recepcionistas
- Gestión de pacientes
- Visualización de citas
- Histórico clínico
- Estadísticas

### admin.html
- Panel de administración (solo para admins)
- Gestión completa de usuarios
- Crear, editar y eliminar usuarios
- Asignar roles

## Flujo de Autenticación

1. Usuario ingresa en `login.html`
2. AuthService realiza login y guarda token + usuario en localStorage
3. Según el rol, redirige a `admin.html` o `dashboard.html`
4. Cada página verifica autenticación con `checkAuth()`
5. Los servicios usan el token automáticamente en cada request
6. Si el token expira (401), se redirige a login

## Roles y Permisos

- **admin**: Acceso total, puede gestionar usuarios
- **doctor**: Acceso a pacientes, citas e historial
- **recepcionista**: Acceso a pacientes y citas

## Notas de Desarrollo

- Todos los servicios están centralizados en la carpeta `services/`
- Los servicios usan `apiService` como base
- Las funciones de utilidad están en `utils/`
- El código específico de cada página está en `js/`
- Los estilos están centralizados en `css/style.css`
