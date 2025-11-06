# ===============================================
# DOCKERFILE PARA SUMPETROL ENERGY
# ===============================================
# Sistema de Deploy para EasyPanel - IdeasDevOps
# Landing Page moderna para Sumpetrol Energy & Minería
# ===============================================

FROM nginx:alpine

# ===============================================
# CONFIGURACIÓN DE LA APLICACIÓN
# ===============================================
ARG APP_NAME="sumpe-energy"
ARG APP_VERSION="1.0.0"
ARG APP_DESCRIPTION="Landing page moderna para Sumpetrol Energy con diseño bordó, sección interactiva de minería y energías renovables"

# ===============================================
# INSTALACIÓN DE DEPENDENCIAS DEL SISTEMA
# ===============================================
RUN apk add --no-cache \
    php \
    php-fpm \
    php-json \
    php-curl \
    php-mbstring \
    php-opcache \
    php-phar \
    php-zip \
    php-xml \
    php-dom \
    php-fileinfo \
    php-filter \
    php-iconv \
    php-intl \
    php-openssl \
    php-pdo \
    php-pdo_mysql \
    php-pdo_pgsql \
    php-session \
    php-tokenizer \
    curl \
    bash \
    supervisor \
    dumb-init \
    && rm -rf /var/cache/apk/*

# ===============================================
# CREACIÓN DE DIRECTORIOS NECESARIOS
# ===============================================
RUN mkdir -p \
    /data/logs/nginx \
    /data/logs/php-fpm \
    /data/logs/supervisor \
    /data/logs/healthcheck \
    /data/logs/sistema \
    /data/backups \
    /data/data \
    /data/database \
    /data/temp \
    /var/cache/nginx \
    /var/run/php-fpm \
    /var/run \
    /tmp/nginx \
    /etc/supervisor/conf.d \
    /usr/share/nginx/html

# ===============================================
# CONFIGURACIÓN DE PHP-FPM
# ===============================================
RUN sed -i 's/listen = 127.0.0.1:9000/listen = \/var\/run\/php-fpm\/php-fpm.sock/' /etc/php81/php-fpm.d/www.conf 2>/dev/null || \
    sed -i 's/listen = 127.0.0.1:9000/listen = \/var\/run\/php-fpm\/php-fpm.sock/' /etc/php/php-fpm.d/www.conf && \
    (sed -i 's/;listen.owner = nobody/listen.owner = nginx/' /etc/php81/php-fpm.d/www.conf 2>/dev/null || \
     sed -i 's/;listen.owner = nobody/listen.owner = nginx/' /etc/php/php-fpm.d/www.conf) && \
    (sed -i 's/;listen.group = nobody/listen.group = nginx/' /etc/php81/php-fpm.d/www.conf 2>/dev/null || \
     sed -i 's/;listen.group = nobody/listen.group = nginx/' /etc/php/php-fpm.d/www.conf) && \
    (sed -i 's/user = nobody/user = nginx/' /etc/php81/php-fpm.d/www.conf 2>/dev/null || \
     sed -i 's/user = nobody/user = nginx/' /etc/php/php-fpm.d/www.conf) && \
    (sed -i 's/group = nobody/group = nginx/' /etc/php81/php-fpm.d/www.conf 2>/dev/null || \
     sed -i 's/group = nobody/group = nginx/' /etc/php/php-fpm.d/www.conf) && \
    (sed -i 's/;clear_env = no/clear_env = no/' /etc/php81/php-fpm.d/www.conf 2>/dev/null || \
     sed -i 's/;clear_env = no/clear_env = no/' /etc/php/php-fpm.d/www.conf) && \
    (echo 'php_admin_flag[log_errors] = on' >> /etc/php81/php-fpm.d/www.conf 2>/dev/null || \
     echo 'php_admin_flag[log_errors] = on' >> /etc/php/php-fpm.d/www.conf) && \
    (echo 'php_admin_value[error_log] = /data/logs/php-fpm/error.log' >> /etc/php81/php-fpm.d/www.conf 2>/dev/null || \
     echo 'php_admin_value[error_log] = /data/logs/php-fpm/error.log' >> /etc/php/php-fpm.d/www.conf) && \
    (echo 'php_admin_flag[display_errors] = off' >> /etc/php81/php-fpm.d/www.conf 2>/dev/null || \
     echo 'php_admin_flag[display_errors] = off' >> /etc/php/php-fpm.d/www.conf)

# ===============================================
# CONFIGURACIÓN DE NGINX
# ===============================================
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 80 default_server;' >> /etc/nginx/conf.d/default.conf && \
    echo '    listen [::]:80 default_server;' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    index index.html index.htm index.php;' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name _;' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Configuración de logs' >> /etc/nginx/conf.d/default.conf && \
    echo '    access_log /data/logs/nginx/access.log;' >> /etc/nginx/conf.d/default.conf && \
    echo '    error_log /data/logs/nginx/error.log;' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Configuración de tamaño de archivos' >> /etc/nginx/conf.d/default.conf && \
    echo '    client_max_body_size 10M;' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Configuración de archivos estáticos' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Configuración de PHP' >> /etc/nginx/conf.d/default.conf && \
    echo '    location ~ \.php$ {' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri =404;' >> /etc/nginx/conf.d/default.conf && \
    echo '        fastcgi_split_path_info ^(.+\.php)(/.+)$;' >> /etc/nginx/conf.d/default.conf && \
    echo '        fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;' >> /etc/nginx/conf.d/default.conf && \
    echo '        fastcgi_index index.php;' >> /etc/nginx/conf.d/default.conf && \
    echo '        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;' >> /etc/nginx/conf.d/default.conf && \
    echo '        include fastcgi_params;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Health check endpoint' >> /etc/nginx/conf.d/default.conf && \
    echo '    location /health {' >> /etc/nginx/conf.d/default.conf && \
    echo '        access_log off;' >> /etc/nginx/conf.d/default.conf && \
    echo '        return 200 "healthy\n";' >> /etc/nginx/conf.d/default.conf && \
    echo '        add_header Content-Type text/plain;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Cache para archivos estáticos' >> /etc/nginx/conf.d/default.conf && \
    echo '    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {' >> /etc/nginx/conf.d/default.conf && \
    echo '        expires 1y;' >> /etc/nginx/conf.d/default.conf && \
    echo '        add_header Cache-Control "public, immutable";' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# ===============================================
# COPIA DE ARCHIVOS DE LA APLICACIÓN
# ===============================================
# Copia el frontend (HTML, CSS, JS, assets)
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Copia el script PHP para el formulario de contacto
COPY send-email.php /usr/share/nginx/html/

# ===============================================
# SCRIPT DE INICIO OPTIMIZADO
# ===============================================
RUN echo '#!/bin/sh' > /start.sh && \
    echo '' >> /start.sh && \
    echo 'echo "🚀 Iniciando '${APP_NAME}'"' >> /start.sh && \
    echo 'echo "========================================="' >> /start.sh && \
    echo 'echo "Versión: '${APP_VERSION}'"' >> /start.sh && \
    echo 'echo "Descripción: '${APP_DESCRIPTION}'"' >> /start.sh && \
    echo '' >> /start.sh && \
    echo '# Crear directorios necesarios' >> /start.sh && \
    echo 'mkdir -p /data/logs/nginx /data/logs/php-fpm /data/logs/supervisor /var/log/nginx /var/cache/nginx /var/run/php-fpm /var/run /tmp/nginx' >> /start.sh && \
    echo '' >> /start.sh && \
    echo '# Configurar permisos' >> /start.sh && \
    echo 'chown -R nginx:nginx /usr/share/nginx/html /var/run/php-fpm /data/logs' >> /start.sh && \
    echo 'chmod -R 755 /usr/share/nginx/html' >> /start.sh && \
    echo '' >> /start.sh && \
    echo '# Verificar configuración de nginx' >> /start.sh && \
    echo 'nginx -t' >> /start.sh && \
    echo '' >> /start.sh && \
    echo '# Verificar configuración de PHP-FPM' >> /start.sh && \
    echo 'php-fpm8 -t 2>/dev/null || php-fpm81 -t 2>/dev/null || php-fpm -t' >> /start.sh && \
    echo '' >> /start.sh && \
    echo '# Iniciar PHP-FPM' >> /start.sh && \
    echo 'echo "🔧 Iniciando PHP-FPM..."' >> /start.sh && \
    echo 'php-fpm8 -D 2>/dev/null || php-fpm81 -D 2>/dev/null || php-fpm -D' >> /start.sh && \
    echo '' >> /start.sh && \
    echo '# Iniciar nginx' >> /start.sh && \
    echo 'echo "🌐 Iniciando nginx..."' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh

RUN chmod +x /start.sh

# ===============================================
# CONFIGURACIÓN DE SUPERVISOR
# ===============================================
RUN echo '[supervisord]' > /etc/supervisor/conf.d/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'user=root' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'logfile=/data/logs/supervisor/supervisord.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'pidfile=/var/run/supervisord.pid' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '[program:php-fpm]' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'command=php-fpm8 -F 2>/dev/null || php-fpm81 -F 2>/dev/null || php-fpm -F' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autostart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stderr_logfile=/data/logs/php-fpm/error.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stdout_logfile=/data/logs/php-fpm/access.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'user=root' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '[program:nginx]' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'command=nginx -g "daemon off;"' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autostart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stderr_logfile=/data/logs/nginx/error.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stdout_logfile=/data/logs/nginx/access.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'user=root' >> /etc/supervisor/conf.d/supervisord.conf

# ===============================================
# CONFIGURACIÓN DE PUERTOS Y HEALTHCHECK
# ===============================================
EXPOSE 80

# Healthcheck optimizado para EasyPanel
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# ===============================================
# CONFIGURACIÓN DE PERMISOS
# ===============================================
RUN chown -R root:root /data && \
    chmod -R 755 /data && \
    chmod +x /start.sh

# ===============================================
# PUNTO DE ENTRADA
# ===============================================
ENTRYPOINT ["dumb-init", "--"]
CMD ["/start.sh"]

