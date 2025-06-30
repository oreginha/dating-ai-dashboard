# Dockerfile para Railway deployment
FROM node:18-alpine as builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# AGREGAR VARIABLES DE ENTORNO PARA EL BUILD
ARG VITE_API_BASE_URL=https://mcp-api-server-production.up.railway.app
ARG VITE_WS_URL=wss://n8n-workflows-production.up.railway.app
ARG VITE_DEBUG_MODE=false
ARG VITE_ENVIRONMENT=production
ARG VITE_APP_NAME="Dating AI Dashboard"
ARG VITE_WEBSOCKET_URL=wss://mcp-api-server-production.up.railway.app/ws
ARG VITE_N8N_WEBHOOK_URL=https://n8n-workflows-production-4827.up.railway.app
ARG VITE_API_TIMEOUT=30000
ARG VITE_APP_ENV=production

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_DEBUG_MODE=$VITE_DEBUG_MODE
ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_WEBSOCKET_URL=$VITE_WEBSOCKET_URL
ENV VITE_N8N_WEBHOOK_URL=$VITE_N8N_WEBHOOK_URL
ENV VITE_API_TIMEOUT=$VITE_API_TIMEOUT
ENV VITE_APP_ENV=$VITE_APP_ENV

# Build de la aplicación (ahora con las variables correctas)
RUN npm run build

# Imagen final con servidor estático
FROM nginx:alpine

# Copiar archivos build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración nginx customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar script de entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Exponer puerto dinámico
EXPOSE $PORT

CMD ["/docker-entrypoint.sh"]