# Frontend - Sistema Clínico

## 🎨 Diseño Responsivo

El frontend está completamente adaptado para funcionar en todos los dispositivos:

### 📱 Móviles (< 768px)
- **Menú hamburguesa**: Sidebar oculto por defecto, se abre con botón ☰
- **Layout vertical**: Elementos apilados para mejor uso del espacio
- **Tablas scrollables**: Scroll horizontal para ver todas las columnas
- **Botones optimizados**: Tamaños reducidos pero cómodos de tocar
- **Modales adaptados**: Ocupan casi toda la pantalla

### 📟 Tablets (768px - 1024px)
- **Sidebar lateral**: Aparece al lado del contenido principal
- **Layout horizontal**: Mejor aprovechamiento del espacio
- **Controles flexibles**: Barra superior con título y buscador
- **Modales medianos**: Tamaño intermedio entre móvil y desktop

### 💻 Desktop (> 1024px)
- **Layout completo**: Sidebar fijo + contenido principal amplio
- **Espacio optimizado**: Más padding y elementos más grandes
- **Interacciones avanzadas**: Hover effects y animaciones
- **Modales grandes**: Más espacio para formularios

## 🎯 Características UX/UI

### Tema Oscuro Moderno
- Gradientes sutiles
- Bordes redondeados
- Sombras suaves
- Colores accesibles

### Animaciones y Transiciones
- Modal slide-in
- Hover effects
- Button transforms
- Smooth transitions

### Accesibilidad
- Focus indicators
- Reduced motion support
- High contrast support
- Keyboard navigation

## 📁 Estructura de Archivos

```
frontend/
├── css/
│   └── style.css          # Estilos responsivos completos
├── js/
│   ├── api.js            # Funciones API
│   ├── auth.js           # Autenticación
│   ├── dashboard.js      # Dashboard principal
│   ├── historial.js      # Gestión historial médico
│   ├── pacientes.js      # CRUD pacientes
│   └── ui.js             # Interfaz de usuario
├── login.html            # Página de login
├── dashboard.html        # Dashboard principal
└── README.md             # Esta documentación
```

## 🚀 Cómo Usar

1. **En móvil**: Toca el botón ☰ para abrir el menú lateral
2. **En tablet/desktop**: El menú está siempre visible
3. **Tablas**: En móviles, desliza horizontalmente para ver todas las columnas
4. **Modales**: Se adaptan automáticamente al tamaño de pantalla

## 📱 Breakpoints

- **Móvil**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

## 🎨 Paleta de Colores

- **Primary**: #10b981 (Verde esmeralda)
- **Background**: Gradiente #0f172a → #1e293b
- **Cards**: rgba(30, 41, 59, 0.8)
- **Text**: White con opacidades variables
- **Danger**: #ef4444 (Rojo coral)

## ✨ Características Especiales

- **Backdrop blur** en modales
- **Scroll suave** en móviles
- **Touch-friendly** botones
- **Responsive typography**
- **Flexible layouts** con CSS Grid y Flexbox