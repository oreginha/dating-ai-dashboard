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
