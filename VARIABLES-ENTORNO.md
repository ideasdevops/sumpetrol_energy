# 🔧 Variables de Entorno - Sumpetrol Energy

Guía completa de variables de entorno para configurar en EasyPanel.

## 📋 Variables Requeridas

### ⚠️ Variables Obligatorias para el Formulario de Contacto

Estas variables son **necesarias** si quieres que el formulario de contacto funcione:

```bash
SMTP_HOST=c2630942.ferozo.com
SMTP_PORT=465
SMTP_SECURE=ssl
SMTP_USERNAME=novedades@sumpetrol.com.ar
SMTP_PASSWORD=tu_contraseña_smtp_aqui
MARKETING_EMAIL=marketing@sumpetrol.com.ar
VENTAS_EMAIL=ventas@sumpetrol.com.ar
```

## 📝 Variables Opcionales

### Configuración de la Aplicación

```bash
APP_NAME=sumpe-energy
APP_VERSION=1.0.0
APP_ENV=production
APP_DEBUG=false
```

### Configuración de Logs

```bash
LOG_LEVEL=INFO
LOG_DIR=/data/logs
```

### Configuración de PHP

```bash
PHP_MEMORY_LIMIT=128M
PHP_MAX_UPLOAD_SIZE=10M
PHP_POST_MAX_SIZE=10M
```

### Configuración de Nginx

```bash
NGINX_WORKER_PROCESSES=auto
NGINX_WORKER_CONNECTIONS=1024
```

## 🚀 Configuración en EasyPanel

### Paso 1: Acceder a Variables de Entorno

1. Ve a tu aplicación en EasyPanel
2. Haz clic en la aplicación `sumpe-energy-app`
3. Busca la sección **"Environment Variables"** o **"Variables de Entorno"**
4. Haz clic en **"+ Add Variable"** o **"Añadir Variable"**

### Paso 2: Añadir Variables SMTP (Obligatorias)

Añade estas variables una por una:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `SMTP_HOST` | `c2630942.ferozo.com` | Servidor SMTP |
| `SMTP_PORT` | `465` | Puerto SMTP (SSL) |
| `SMTP_SECURE` | `ssl` | Tipo de conexión segura |
| `SMTP_USERNAME` | `novedades@sumpetrol.com.ar` | Usuario SMTP |
| `SMTP_PASSWORD` | `tu_contraseña_real` | **⚠️ Contraseña SMTP (mantener privada)** |
| `MARKETING_EMAIL` | `marketing@sumpetrol.com.ar` | Email destino marketing |
| `VENTAS_EMAIL` | `ventas@sumpetrol.com.ar` | Email destino ventas |

### Paso 3: Variables Opcionales (Recomendadas)

Añade estas para mejor configuración:

| Variable | Valor Recomendado | Descripción |
|----------|-------------------|-------------|
| `APP_NAME` | `sumpe-energy` | Nombre de la aplicación |
| `APP_VERSION` | `1.0.0` | Versión actual |
| `APP_ENV` | `production` | Entorno de ejecución |
| `LOG_LEVEL` | `INFO` | Nivel de logging |

## 🔒 Seguridad

### ⚠️ Importante

1. **Nunca subas contraseñas al repositorio Git**
2. **Usa variables de entorno para datos sensibles**
3. **Marca `SMTP_PASSWORD` como secreta en EasyPanel** (si tiene esa opción)
4. **No compartas las credenciales SMTP públicamente**

### Mejores Prácticas

- ✅ Usa variables de entorno para todas las credenciales
- ✅ Rota las contraseñas periódicamente
- ✅ Usa diferentes credenciales para desarrollo y producción
- ✅ Revisa los permisos de acceso regularmente

## 📋 Plantilla Rápida para Copiar

Copia y pega estas variables en EasyPanel (reemplaza `tu_contraseña_smtp_aqui`):

```bash
SMTP_HOST=c2630942.ferozo.com
SMTP_PORT=465
SMTP_SECURE=ssl
SMTP_USERNAME=novedades@sumpetrol.com.ar
SMTP_PASSWORD=tu_contraseña_smtp_aqui
MARKETING_EMAIL=marketing@sumpetrol.com.ar
VENTAS_EMAIL=ventas@sumpetrol.com.ar
APP_NAME=sumpe-energy
APP_VERSION=1.0.0
APP_ENV=production
LOG_LEVEL=INFO
```

## 🧪 Verificación

### Verificar que las Variables Estén Configuradas

1. **En EasyPanel:**
   - Ve a la sección de variables de entorno
   - Verifica que todas las variables SMTP estén presentes
   - Asegúrate de que `SMTP_PASSWORD` tenga el valor correcto

2. **Probar el Formulario:**
   - Accede a la landing page
   - Envía un mensaje de prueba desde el formulario de contacto
   - Verifica que llegue a `marketing@sumpetrol.com.ar` y `ventas@sumpetrol.com.ar`

3. **Revisar Logs:**
   - Si hay errores, revisa `/data/logs/php-fpm/error.log`
   - Verifica los logs de nginx en `/data/logs/nginx/error.log`

## 🐛 Troubleshooting

### Problema: El formulario no envía emails

**Solución:**
1. Verifica que todas las variables SMTP estén configuradas
2. Verifica que `SMTP_PASSWORD` sea correcta
3. Revisa los logs de PHP-FPM: `/data/logs/php-fpm/error.log`
4. Verifica que el puerto 465 esté abierto para conexiones salientes

### Problema: Error de conexión SMTP

**Solución:**
1. Verifica `SMTP_HOST` y `SMTP_PORT`
2. Asegúrate de que `SMTP_SECURE=ssl` esté configurado
3. Verifica que las credenciales sean correctas
4. Revisa si hay restricciones de firewall

### Comandos de Diagnóstico

```bash
# Ver variables de entorno en el contenedor
docker exec -it <container_name> env | grep SMTP

# Ver logs de PHP
docker exec -it <container_name> tail -f /data/logs/php-fpm/error.log

# Probar conexión SMTP (desde dentro del contenedor)
docker exec -it <container_name> /bin/sh
# Luego dentro del contenedor:
php -r "var_dump(getenv('SMTP_HOST'));"
```

## 📚 Referencias

- **Archivo de ejemplo:** `env.example`
- **Script PHP:** `send-email.php`
- **Documentación de deploy:** `DEPLOY.md`

---

**⚠️ Recuerda:** Las credenciales SMTP son sensibles. Manténlas seguras y nunca las subas al repositorio.

