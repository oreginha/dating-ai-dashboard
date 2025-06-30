@echo off
REM Script de deployment para Railway en Windows

echo 🚀 Iniciando deployment en Railway...

REM Verificar que Railway CLI está instalado
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Railway CLI no está instalado. Por favor instálalo desde https://railway.app/cli
    pause
    exit /b 1
)

REM Login a Railway
echo 🔐 Verificando autenticación...
railway login

REM Conectar al proyecto
echo 🔗 Conectando al proyecto...
railway link d81cd4df-72cc-472a-8a5f-d743b9976ec5

REM Hacer deployment
echo 📦 Desplegando aplicación...
railway up

echo ✅ Deployment completado!
echo 🌐 Tu aplicación estará disponible en: https://dating-ai-dashboard-production.up.railway.app
pause
