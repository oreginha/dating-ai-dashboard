#!/bin/bash

# Script de deployment manual para Railway
# Uso: ./deploy-railway.sh

echo "🚀 Deploying Dating AI Dashboard to Railway..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado. Ejecuta este script desde el directorio raíz del proyecto."
    exit 1
fi

# Verificar que Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Error: Railway CLI no encontrado."
    echo "📦 Instala Railway CLI: npm install -g @railway/cli"
    exit 1
fi

# Login a Railway (si no está logueado)
echo "🔐 Verificando autenticación con Railway..."
if ! railway whoami &> /dev/null; then
    echo "🔑 Por favor, loguéate a Railway:"
    railway login
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Build del proyecto
echo "🔨 Building proyecto..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d "dist" ]; then
    echo "❌ Error: Build falló, directorio dist no encontrado."
    exit 1
fi

# Conectar al proyecto Railway
echo "🔗 Conectando al proyecto Railway..."
railway link d81cd4df-72cc-472a-8a5f-d743b9976ec5

# Deploy
echo "🚀 Desplegando a Railway..."
railway up --service 86f2b665-810d-4509-85a6-b3df93585c19

echo "✅ Deployment completado!"
echo "🌐 URL: https://dating-ai-dashboard-production.up.railway.app"
