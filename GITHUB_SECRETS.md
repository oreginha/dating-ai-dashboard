# GitHub Secrets Configuration

Este archivo contiene las variables que necesitas configurar en GitHub Secrets para el CI/CD.

## Railway Secrets

Ve a: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### RAILWAY_TOKEN

- **Nombre:** `RAILWAY_TOKEN`
- **Valor:** Tu token de Railway (obténlo en https://railway.app/account/tokens)
- **Descripción:** Token de autenticación para deployments en Railway

### RAILWAY_SERVICE_ID

- **Nombre:** `RAILWAY_SERVICE_ID`
- **Valor:** `86f2b665-810d-4509-85a6-b3df93585c19`
- **Descripción:** ID del servicio dating-ai-dashboard en Railway

## Configuración Adicional

### Project ID

- **ID del Proyecto:** `d81cd4df-72cc-472a-8a5f-d743b9976ec5`
- **Environment ID:** `13fb2741-a902-4893-b161-aa692128b0af`

## Variables de Entorno Railway

Las siguientes variables ya están configuradas en Railway:

```bash
VITE_API_BASE_URL=https://mcp-api-server-production.up.railway.app
VITE_WS_URL=wss://mcp-websocket-server.up.railway.app
VITE_DEBUG_MODE=false
```

## Pasos para Configurar:

1. Ve a tu repositorio en GitHub
2. Click en **Settings**
3. En el sidebar izquierdo, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**
5. Agrega cada secret listado arriba

## Deployment Automático

Una vez configurados los secrets, cada push a la rama `master` disparará automáticamente:

1. Tests y linting
2. Build del proyecto
3. Deployment a Railway

## Verificar Deployment

Después del push, puedes verificar el deployment en:

- **GitHub Actions:** https://github.com/oreginha/dating-ai-dashboard/actions
- **Railway Dashboard:** https://railway.app/project/d81cd4df-72cc-472a-8a5f-d743b9976ec5
- **Aplicación en vivo:** https://dating-ai-dashboard-production.up.railway.app
