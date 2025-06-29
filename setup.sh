#!/bin/bash

# 🚀 Dating AI Agent Dashboard - Setup Script
echo "🎮 Dating AI Agent Dashboard - Configuración Automática"
echo "=========================================================="

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "Por favor instala Node.js 18+ desde https://nodejs.org/"
    exit 1
fi

# Verificar versión de Node
NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Necesitas Node.js 18 o superior"
    echo "Versión actual: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"

# Cambiar al directorio del dashboard
cd "$(dirname "$0")"

echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas correctamente"

# Crear archivo de variables de entorno si no existe
if [ ! -f .env.local ]; then
    echo "⚙️ Creando archivo de configuración..."
    cp .env.example .env.local
    echo "✅ Archivo .env.local creado"
    echo "📝 Edita .env.local con tus configuraciones específicas"
else
    echo "⚙️ Archivo .env.local ya existe"
fi

# Verificar build
echo "🔧 Verificando que el proyecto compile..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en la compilación"
    exit 1
fi

echo "✅ Compilación exitosa"

echo ""
echo "🎉 ¡Setup completado exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita .env.local con tus configuraciones"
echo "2. Ejecuta: npm run dev"
echo "3. Abre: http://localhost:3000"
echo ""
echo "📚 Documentación completa en README.md"
echo ""
echo "🚀 ¡Tu Dating AI Dashboard está listo!"
