#!/bin/bash

# Script de deployment para Railway
echo "🚀 Iniciando deployment en Railway..."

# Verificar que Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no está instalado. Instalando..."
    curl -fsSL https://railway.app/install.sh | sh
fi

# Login a Railway (si no está logueado)
echo "🔐 Verificando autenticación..."
railway login

# Conectar al proyecto
echo "🔗 Conectando al proyecto..."
railway link d81cd4df-72cc-472a-8a5f-d743b9976ec5

# Hacer deployment
echo "📦 Desplegando aplicación..."
railway up

echo "✅ Deployment completado!"
echo "🌐 Tu aplicación estará disponible en: https://dating-ai-dashboard-production.up.railway.app"
