# 🎮 Dating AI Agent Dashboard

Una interfaz web moderna y funcional para gestionar todo el Dating AI Agent system desde un dashboard centralizado.

![Dating AI Dashboard](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3.3-blue)

## 🚀 Características Principales

✅ **Dashboard intuitivo** con métricas en tiempo real  
✅ **Gestión completa** de todos los workflows  
✅ **Analytics visuales** para toma de decisiones  
✅ **Aprobación fácil** de mensajes automáticos  
✅ **Configuración flexible** de todos los parámetros  
✅ **Responsive design** para uso móvil y desktop  
✅ **Real-time updates** sin necesidad de refresh

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Heroicons
- **State Management**: Zustand (preparado)
- **Build Tool**: Vite
- **Deploy**: Vercel ready

## 📦 Instalación Rápida

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias**

```bash
cd dashboard/web-app
npm install
```

2. **Configurar variables de entorno**

```bash
cp .env.example .env.local
# Editar .env.local con tus configuraciones
```

3. **Ejecutar en desarrollo**

```bash
npm run dev
```

4. **Compilar para producción**

```bash
npm run build
```

## 🔧 Variables de Entorno

Crea un archivo `.env.local` con:

```env
# API Configuration
VITE_API_BASE_URL=https://mcp-api-server-production.up.railway.app
VITE_WS_URL=wss://your-websocket-server.railway.app

# Development
VITE_DEBUG_MODE=true

# Telegram (opcional)
VITE_TELEGRAM_BOT_URL=https://api.telegram.org/bot
```

## 📱 Funcionalidades del Dashboard

### **🏠 Dashboard Principal**

- Overview general del sistema
- KPIs en tiempo real
- Estado de workflows
- Acciones rápidas

### **🔍 Discovery Pipeline**

- Configuración de búsqueda
- Resultados con scoring
- Analytics de discovery
- Análisis manual de perfiles

### **💬 Conversation Manager**

- Conversaciones activas
- Historial de mensajes
- Programación automática
- Estados y pipeline

### **✨ Opportunity Detector**

- Feed en tiempo real
- Configuración de sensibilidad
- Análisis de patrones
- ROI tracking

### **🤖 Auto-Response System**

- Cola de aprobación
- Múltiples variantes
- Templates de mensajes
- A/B testing

### **📊 Analytics Dashboard**

- Métricas ejecutivas
- Charts interactivos
- Patrones de éxito
- Recomendaciones AI

## 🎨 Componentes Principales

### **KPI Cards**

```tsx
import { DatingKPICard } from "./components/KPICard";

<DatingKPICard type="profiles" value={24} change={15.2} loading={false} />;
```

### **Charts**

```tsx
import { CompatibilityDistribution } from "./components/Charts";

<CompatibilityDistribution data={compatibilityData} />;
```

### **Quick Actions**

```tsx
import { GlobalQuickActions } from "./components/QuickActions";

<GlobalQuickActions
  onStartDiscovery={handleStart}
  onStopDiscovery={handleStop}
  discoveryRunning={true}
/>;
```

## 🔌 Integración con MCP Server

El dashboard se conecta con el MCP Server a través de:

- **HTTP API**: Para operaciones CRUD
- **WebSocket**: Para updates en tiempo real
- **Polling**: Para métricas y estado

```typescript
// Configuración de API
const apiConfig = {
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};
```

## 📊 Datos Simulados vs Reales

Durante desarrollo, el dashboard usa datos simulados. Para conectar con datos reales:

1. **Configurar endpoint de API** en `.env.local`
2. **Implementar servicios API** en `src/services/`
3. **Conectar WebSocket** para real-time updates
4. **Configurar autenticación** si es necesario

## 🚀 Deploy en Vercel

1. **Conectar repositorio** a Vercel
2. **Configurar build settings**:

   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Configurar variables de entorno** en Vercel dashboard
4. **Deploy automático** en cada push a main

## 🔧 Desarrollo

### **Estructura de Carpetas**

```
src/
├── components/          # Componentes reutilizables
│   ├── KPICard.tsx     # Cards de métricas
│   ├── Charts.tsx      # Componentes de gráficos
│   ├── QuickActions.tsx # Botones de acción
│   └── Layout.tsx      # Layout principal
├── pages/              # Páginas principales
│   └── Dashboard.tsx   # Dashboard principal
├── services/           # Servicios API (futuro)
├── hooks/              # Custom hooks (futuro)
├── utils/              # Utilidades
└── types/              # TypeScript types
```

### **Comandos Útiles**

```bash
# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🎯 Próximos Pasos

### **Fase 1 - Completada ✅**

- [x] Setup inicial con React + TypeScript
- [x] Componentes base (KPI, Charts, Actions)
- [x] Layout principal con navegación
- [x] Dashboard con datos simulados

### **Fase 2 - En Progreso 🚧**

- [ ] Integración real con MCP Server API
- [ ] WebSocket para updates en tiempo real
- [ ] Sistema de autenticación
- [ ] Estado global con Zustand

### **Fase 3 - Planificado 📋**

- [ ] Dashboards específicos por workflow
- [ ] Configuración editable de workflows
- [ ] Export de datos y reportes
- [ ] Mobile responsiveness mejorado

### **Fase 4 - Futuro 🔮**

- [ ] Notificaciones push
- [ ] Modo offline con PWA
- [ ] Tests automatizados
- [ ] Performance optimizations

## 🐛 Troubleshooting

### **Error: Module not found**

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### **Error: Build fails**

```bash
# Verificar TypeScript
npx tsc --noEmit

# Verificar importaciones
npm run lint
```

### **Error: Tailwind styles not loading**

- Verificar que `tailwind.config.js` esté configurado correctamente
- Asegurar que `@tailwind` directives estén en `index.css`

## 📞 Soporte

- **Issues**: Reportar en GitHub
- **Documentation**: Ver carpeta `/docs`
- **Updates**: Seguir roadmap en docs

---

**¡Tu Dashboard de Dating AI Agent está listo para transformar tu gestión romántica!** 🚀💕

_Dashboard v1.0 - Diseñado para Dating AI Agent v3.0_
