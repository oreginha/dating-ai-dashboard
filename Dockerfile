# Dockerfile para Railway deployment
FROM node:18-alpi# Script para reemplazar PORT en la configuración y configurar nginx
RUN cat > /docker-entrypoint.sh << 'EOF'
#!/bin/sh
# Configurar el puerto dinámico de Railway
export PORT=${PORT:-80}

# Crear configuración nginx optimizada
cat > /etc/nginx/conf.d/default.conf << NGINX_EOF
server {
    listen $PORT;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Health check endpoint - DEBE responder rápido
    location /health {
        access_log off;
        return 200 'healthy';
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
}
NGINX_EOF

# Verificar sintaxis de nginx
nginx -t

# Iniciar nginx en foreground
exec nginx -g 'daemon off;'
EOF

RUN chmod +x /docker-entrypoint.sh

EXPOSE $PORT

CMD ["/docker-entrypoint.sh"]WORKDIR /app

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

# Script para reemplazar PORT en la configuración
COPY <<EOF /docker-entrypoint.sh
#!/bin/sh
PORT=\${PORT:-80}
sed -i "s/\\\${PORT:-80}/\$PORT/g" /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
EOF

RUN chmod +x /docker-entrypoint.sh

EXPOSE \${PORT:-80}

CMD ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]

CMD ["nginx", "-g", "daemon off;"]
