# Dockerfile para Railway deployment
FROM node:18-alpine as builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Imagen final con servidor estático
FROM nginx:alpine

# Copiar archivos build
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear script de configuración optimizado
RUN cat > /docker-entrypoint.sh << 'EOF'
#!/bin/sh
# Configurar el puerto dinámico de Railway
export PORT=${PORT:-80}

# Crear configuración nginx optimizada para Railway
cat > /etc/nginx/conf.d/default.conf << NGINX_EOF
server {
    listen $PORT;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Health check endpoint - DEBE responder rápido
    location /health {
        access_log off;
        return 200 'healthy\n';
        add_header Content-Type text/plain;
    }

    # Fallback para rutas de SPA
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Archivos estáticos con cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Configuración de gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
NGINX_EOF

# Verificar sintaxis de nginx
nginx -t

# Iniciar nginx en foreground
exec nginx -g 'daemon off;'
EOF

RUN chmod +x /docker-entrypoint.sh

# Exponer puerto dinámico
EXPOSE $PORT

CMD ["/docker-entrypoint.sh"]
