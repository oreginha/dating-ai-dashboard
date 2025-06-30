# Script de deployment para Railway (Windows PowerShell)
# Dating AI Dashboard

Write-Host "🚀 Iniciando deployment en Railway..." -ForegroundColor Green

# Cargar configuración
$config = Get-Content .railway-config | ForEach-Object {
    if ($_ -match '(.+)=(.+)') {
        Set-Variable -Name $matches[1] -Value $matches[2]
    }
}

Write-Host "📦 Proyecto: $PROJECT_NAME" -ForegroundColor Blue
Write-Host "🔧 Servicio: $SERVICE_NAME" -ForegroundColor Blue
Write-Host "🆔 Service ID: $SERVICE_ID" -ForegroundColor Blue

# Verificar que las variables estén configuradas
if (-not $PROJECT_ID -or -not $SERVICE_ID) {
    Write-Host "❌ Error: PROJECT_ID y SERVICE_ID deben estar configurados en .railway-config" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Configurando variables de entorno..." -ForegroundColor Yellow

# Variables de entorno para producción
$env:VITE_API_BASE_URL = "https://mcp-api-server-production.up.railway.app"
$env:VITE_WS_URL = "wss://n8n-workflows-production.up.railway.app"
$env:VITE_DEBUG_MODE = "false"
$env:VITE_ENVIRONMENT = "production"

Write-Host "🏗️ Construyendo aplicación..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build exitoso" -ForegroundColor Green
    
    # Verificar que Railway CLI está instalado
    if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Railway CLI no está instalado. Por favor instálalo desde: https://railway.app/cli" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "🚀 Desplegando en Railway..." -ForegroundColor Yellow
    railway up --service $SERVICE_ID
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🚀 Deployment completado!" -ForegroundColor Green
        Write-Host "🌐 URL: https://dating-ai-dashboard-production.up.railway.app" -ForegroundColor Cyan
    }
    else {
        Write-Host "❌ Error en el deployment" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "❌ Error en el build" -ForegroundColor Red
    exit 1
}
