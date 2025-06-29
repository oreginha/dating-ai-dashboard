@echo off
REM Script de deployment manual para Railway (Windows)
REM Uso: deploy-railway.bat

echo 🚀 Deploying Dating AI Dashboard to Railway...

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: package.json no encontrado. Ejecuta este script desde el directorio raíz del proyecto.
    exit /b 1
)

REM Verificar que Railway CLI está instalado
railway --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Error: Railway CLI no encontrado.
    echo 📦 Instala Railway CLI: npm install -g @railway/cli
    exit /b 1
)

REM Login a Railway (si no está logueado)
echo 🔐 Verificando autenticación con Railway...
railway whoami >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 🔑 Por favor, loguéate a Railway:
    railway login
)

REM Instalar dependencias
echo 📦 Instalando dependencias...
npm ci

REM Build del proyecto
echo 🔨 Building proyecto...
npm run build

REM Verificar que el build fue exitoso
if not exist "dist" (
    echo ❌ Error: Build falló, directorio dist no encontrado.
    exit /b 1
)

REM Conectar al proyecto Railway
echo 🔗 Conectando al proyecto Railway...
railway link d81cd4df-72cc-472a-8a5f-d743b9976ec5

REM Deploy
echo 🚀 Desplegando a Railway...
railway up --service 86f2b665-810d-4509-85a6-b3df93585c19

echo ✅ Deployment completado!
echo 🌐 URL: https://dating-ai-dashboard-production.up.railway.app

pause
