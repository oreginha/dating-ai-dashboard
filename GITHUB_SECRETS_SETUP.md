# 🔐 Configuración de GitHub Secrets para Railway

## Pasos para Configurar los Secrets

### 1. Ve a tu repositorio en GitHub

- Abre: https://github.com/oreginha/dating-ai-dashboard

### 2. Navega a Settings

- Haz clic en la pestaña **"Settings"** en la parte superior del repositorio

### 3. Accede a Secrets and Variables

- En el menú lateral izquierdo, haz clic en **"Secrets and variables"**
- Luego haz clic en **"Actions"**

### 4. Crea el primer secret: RAILWAY_TOKEN

- Haz clic en **"New repository secret"**
- **Name**: `RAILWAY_TOKEN`
- **Value**: `F4cu246`
- Haz clic en **"Add secret"**

### 5. Crea el segundo secret: RAILWAY_SERVICE_ID

- Haz clic en **"New repository secret"** nuevamente
- **Name**: `RAILWAY_SERVICE_ID`
- **Value**: `86f2b665-810d-4509-85a6-b3df93585c19`
- Haz clic en **"Add secret"**

## ✅ Verificación

Una vez configurados los secrets, al hacer push a la rama `master`, GitHub Actions:

1. Ejecutará los tests automáticamente
2. Construirá la aplicación
3. Desplegará automáticamente en Railway

## 🚀 Deployment Automático

Cada vez que hagas push a `master`, se ejecutará automáticamente:

```bash
git add .
git commit -m "tu mensaje"
git push origin master
```

Y verás el deployment en progreso en:

- GitHub Actions: https://github.com/oreginha/dating-ai-dashboard/actions
- Railway Dashboard: https://railway.app/project/d81cd4df-72cc-472a-8a5f-d743b9976ec5
