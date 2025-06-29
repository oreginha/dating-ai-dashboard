# 💕 Dating AI Dashboard

Una aplicación web moderna construida con **React + TypeScript + Vite + Tailwind CSS** para gestionar un sistema de IA de citas automatizado.

## 🚀 Características Principales

### ✨ Dashboard Completo

- **Vista general del sistema** con métricas en tiempo real
- **KPIs dinámicos** con gráficos interactivos
- **Estado del sistema** y monitoreo de workflows

### 🔔 Sistema de Notificaciones Avanzado

- **Dropdown interactivo** con animaciones suaves
- **Contador dinámico** de notificaciones no leídas
- **Tipos de notificación** con iconos específicos:
  - 🟡 Oportunidades detectadas
  - 🟢 Acciones exitosas
  - 🔵 Mensajes recibidos
  - ⚪ Información general
- **Gestión completa**: eliminar, limpiar todo, marcar como leído

### 🎛️ Workflows Modulares

1. **Discovery Pipeline** - Búsqueda y análisis de perfiles
2. **Conversation Manager** - Gestión de conversaciones activas
3. **Opportunity Detector** - Detección de oportunidades en tiempo real
4. **Auto-Response System** - Sistema de respuestas automáticas
5. **Analytics Dashboard** - Análisis y métricas avanzadas

### 🎨 UI/UX Moderno

- **Diseño responsive** que se adapta a todos los dispositivos
- **Sidebar navigation** con indicadores visuales
- **Tailwind CSS** para estilos consistentes
- **Animaciones fluidas** y transiciones

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Zustand** - Gestión de estado global
- **React Router** - Navegación SPA
- **Heroicons** - Iconografía
- **Axios** - Cliente HTTP
- **WebSocket** - Comunicación en tiempo real

## 📂 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal con sidebar y header
│   ├── Notifications.tsx # Sistema de notificaciones
│   ├── KPICard.tsx     # Tarjetas de métricas
│   ├── Charts.tsx      # Componentes de gráficos
│   └── workflows/      # Componentes específicos por workflow
├── pages/              # Páginas principales
├── hooks/              # Custom hooks
│   ├── useNotifications.ts # Hook para gestión de notificaciones
│   └── useWebSocket.ts # Hook para WebSocket
├── services/           # Servicios API
├── store/              # Estado global (Zustand)
├── types/              # Definiciones TypeScript
└── data/               # Datos mock y utilidades
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/oreginha/dating-ai-dashboard.git
   cd dating-ai-dashboard
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📊 Funcionalidades Implementadas

### ✅ Sistema de Notificaciones

- [x] Dropdown interactivo con click fuera para cerrar
- [x] Contador de notificaciones no leídas
- [x] Diferentes tipos con iconos específicos
- [x] Eliminar notificaciones individuales
- [x] Limpiar todas las notificaciones
- [x] Animaciones y transiciones suaves
- [x] Hook reutilizable para gestión de estado

### ✅ Dashboard Principal

- [x] Vista general con métricas principales
- [x] Gráficos interactivos (distribución, tendencias, funnel)
- [x] Cards de KPIs con cambios porcentuales
- [x] Estado del sistema en tiempo real
- [x] Acciones rápidas globales

### ✅ Navegación y Layout

- [x] Sidebar responsive con navegación
- [x] Header con título dinámico
- [x] Indicadores visuales de estado
- [x] Menu móvil funcional

## 🎯 Próximas Características

- [ ] Integración con backend real
- [ ] Autenticación y autorización
- [ ] Websockets para actualizaciones en tiempo real
- [ ] Tests unitarios y e2e
- [ ] Modo oscuro
- [ ] Exportación de datos
- [ ] Configuraciones personalizables

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🚀 Deployment

### Railway (Plataforma Principal)

Este proyecto está desplegado en Railway con CI/CD automático:

```bash
# El deployment se realiza automáticamente al hacer push a master
git push origin master
```

**Variables de entorno en Railway:**

- `VITE_API_BASE_URL` - URL del MCP API Server
- `VITE_WS_URL` - URL del WebSocket server
- `VITE_DEBUG_MODE` - Modo debug (false en producción)

### Build Local

```bash
npm run build
# Los archivos estarán en dist/
```

### Docker

```bash
# Build de la imagen
docker build -t dating-ai-dashboard .

# Ejecutar el contenedor
docker run -p 80:80 dating-ai-dashboard
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Desarrollado por** [@oreginha](https://github.com/oreginha)

---

### 🎉 Demo en Vivo

🚀 **Aplicación desplegada en Railway:** [https://dating-ai-dashboard-production.up.railway.app](https://dating-ai-dashboard-production.up.railway.app)

---

_¿Encontraste un bug o tienes una sugerencia? [Abre un issue](https://github.com/oreginha/dating-ai-dashboard/issues/new)_
