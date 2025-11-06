# 🚀 Guía de Deploy - Sumpetrol Energy

Guía de despliegue del proyecto Sumpetrol Energy en EasyPanel.

## 📋 Información del Proyecto

- **Nombre:** sumpe-energy-app
- **Versión:** 1.0.0
- **Descripción:** Landing page moderna para Sumpetrol Energy con diseño bordó, sección interactiva de minería y energías renovables
- **Repositorio:** git@github.com:ideasdevops/sumpetrol_energy.git

## 🐳 Configuración Docker

### Dockerfile
- **Archivo:** `Dockerfile`
- **Base Image:** `nginx:alpine`
- **Puerto:** `80`

## 📦 Volúmenes Requeridos

Configura los siguientes volúmenes en EasyPanel:

| Tipo | Nombre Local | Ruta en Contenedor | Descripción |
|------|--------------|-------------------|-------------|
| VOLUME | data | `/data` | Datos generales de la aplicación |
| VOLUME | logs | `/data/logs` | Logs de nginx, PHP-FPM y supervisor |
| VOLUME | database | `/data/database` | Base de datos (si se implementa en el futuro) |
| VOLUME | supervisor-config | `/etc/supervisor/conf.d` | Configuración de supervisor |

## 🔧 Variables de Entorno

No se requieren variables de entorno obligatorias para el funcionamiento básico.

**Opcional (para send-email.php):**
```
SMTP_HOST=c2630942.ferozo.com
SMTP_PORT=465
SMTP_USER=novedades@sumpetrol.com.ar
SMTP_PASS=tu_contraseña_smtp
```

## 📝 Configuración en EasyPanel

### 1. Crear Aplicación

1. Ve a EasyPanel
2. Clic en "New App" o "+ Service"
3. Selecciona **"SSH Git"** como tipo de aplicación
4. Configura:
   - **Repositorio:** `git@github.com:ideasdevops/sumpetrol_energy.git`
   - **Branch:** `main`
   - **Dockerfile:** `Dockerfile`
   - **Puerto:** `80`

### 2. Configurar Volúmenes

En la sección "Mounts", añade:

1. **VOLUME** - Nombre: `data`, Ruta: `/data`
2. **VOLUME** - Nombre: `logs`, Ruta: `/data/logs`
3. **VOLUME** - Nombre: `database`, Ruta: `/data/database`
4. **VOLUME** - Nombre: `supervisor-config`, Ruta: `/etc/supervisor/conf.d`

### 3. Variables de Entorno (Opcional)

Si necesitas configurar el envío de emails, añade las variables SMTP en la sección de variables de entorno.

### 4. Deploy

1. Haz clic en **"Deploy"**
2. Espera a que el build complete
3. Verifica que el contenedor esté corriendo

## 🔍 Verificación

### Health Check
El contenedor incluye un endpoint de health check:
```
GET http://tu-dominio/health
```
Debe responder: `healthy`

### Verificar Funcionamiento
1. Accede a la URL de tu aplicación
2. Verifica que la landing page se carga correctamente
3. Prueba la sección interactiva de Minería y Energías Renovables
4. Prueba el formulario de contacto (si está configurado)

## 📊 Logs

Los logs están disponibles en:
- **Nginx Access:** `/data/logs/nginx/access.log`
- **Nginx Error:** `/data/logs/nginx/error.log`
- **PHP-FPM:** `/data/logs/php-fpm/error.log`
- **Supervisor:** `/data/logs/supervisor/supervisord.log`

## 🛠️ Troubleshooting

### Problema: Contenedor no inicia
- Verifica que todos los volúmenes estén configurados
- Revisa los logs del contenedor en EasyPanel
- Verifica que el puerto 80 esté disponible

### Problema: PHP no funciona
- Verifica que PHP-FPM esté corriendo: `docker exec -it <container> ps aux | grep php`
- Revisa los logs de PHP-FPM en `/data/logs/php-fpm/error.log`
- Verifica permisos en `/usr/share/nginx/html`

### Problema: Formulario de contacto no envía emails
- Verifica que las variables SMTP estén configuradas
- Revisa si PHPMailer está instalado (requiere instalación adicional)
- Verifica los logs de PHP para errores

### Comandos Útiles

```bash
# Ver logs en tiempo real
docker logs -f <container_name>

# Acceder al contenedor
docker exec -it <container_name> /bin/sh

# Verificar nginx
docker exec -it <container_name> nginx -t

# Verificar PHP-FPM
docker exec -it <container_name> php-fpm81 -t

# Verificar healthcheck
curl http://localhost/health
```

## 📚 Archivos Importantes

- `Dockerfile` - Configuración del contenedor
- `index.html` - Página principal
- `style.css` - Estilos
- `app.js` - Funcionalidades JavaScript
- `send-email.php` - Script de envío de emails
- `assets/` - Imágenes y logos

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. Haz commit y push de los cambios a GitHub
2. En EasyPanel, haz clic en **"Redeploy"** o **"Restart"**
3. El contenedor se reconstruirá con los nuevos cambios

## 📞 Soporte

Para problemas o consultas:
- **GitHub Issues:** https://github.com/ideasdevops/sumpetrol_energy/issues
- **Email:** devops@ideasdevops.com

---

**Desarrollado con ❤️ por IdeasDevOps**

