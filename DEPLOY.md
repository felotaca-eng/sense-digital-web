# Deploy automatico para `sense-digital-web`

Este proyecto queda listo para publicar una web estatica por `GitHub Actions + SSH + rsync + Nginx`.

## Flujo recomendado

1. Crea un repositorio en GitHub para `sense-digital-web`.
2. Agrega el remoto:

```bash
git remote add origin git@github.com:TU_USUARIO/sense-digital-web.git
```

3. Crea la rama principal:

```bash
git branch -M main
```

4. Haz el primer push:

```bash
git add .
git commit -m "chore: bootstrap static site deploy"
git push -u origin main
```

5. Cada `push` nuevo a `main` dispara el deploy automatico.

## Secrets de GitHub

En el repositorio de GitHub crea estos secrets:

- `DEPLOY_HOST`: IP o dominio del servidor
- `DEPLOY_PORT`: normalmente `22`
- `DEPLOY_USER`: usuario SSH con acceso al servidor
- `DEPLOY_PATH`: carpeta destino, por ejemplo `/var/www/sense-digital-web`
- `DEPLOY_SSH_PRIVATE_KEY`: llave privada usada por GitHub Actions

## Preparacion del servidor

### 1. Crear carpeta de publicacion

```bash
sudo mkdir -p /var/www/sense-digital-web
sudo chown -R $USER:$USER /var/www/sense-digital-web
```

### 2. Configurar Nginx

Usa como base:

- [deploy/nginx/sense-digital-web.conf](/Users/felipeotalora/Desktop/Proyectos/sense-digital-web/deploy/nginx/sense-digital-web.conf)

Copia el archivo al servidor y ajusta el `server_name` al subdominio real que vas a usar para la web estatica.

Ejemplo:

```bash
sudo cp sense-digital-web.conf /etc/nginx/sites-available/sense-digital-web
sudo ln -s /etc/nginx/sites-available/sense-digital-web /etc/nginx/sites-enabled/sense-digital-web
sudo nginx -t
sudo systemctl reload nginx
```

### 3. SSL

Cuando el dominio ya apunte al servidor:

```bash
sudo certbot --nginx -d web.sense-digital.co
```

## Separacion con el blog en WordPress

Tu idea encaja bien:

- `web.sense-digital.co` o `www.sense-digital.co`: web estatica en HTML
- `blog.sense-digital.co`: WordPress para contenido SEO

Asi no mezclas despliegue de marketing site con el blog y puedes optimizar cada cosa por separado.

## Notas importantes

- El workflow hace `rsync --delete`, o sea elimina en servidor archivos que ya no existan en el repo.
- El paso final recarga `nginx`, asi que el usuario de deploy debe tener permiso para `sudo nginx -t` y `sudo systemctl reload nginx`.
- Si prefieres no dar `sudo`, puedo cambiar el flujo para que solo sincronice archivos y el reload lo hagas manual o via otro usuario.

