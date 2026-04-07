# Deploy automatico para `sense-digital-web`

Este proyecto queda listo para publicar una web estatica en Hostinger por `GitHub Actions + FTP`.

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

- `FTP_HOST`: host FTP, por ejemplo `93.127.190.65`
- `FTP_PORT`: normalmente `21`
- `FTP_USERNAME`: usuario FTP
- `FTP_PASSWORD`: contrasena FTP
- `FTP_SERVER_DIR`: carpeta destino, en tu caso `/public_html/`

## Datos para Hostinger

Segun tu panel actual:

- `FTP_HOST`: `93.127.190.65`
- `FTP_PORT`: `21`
- `FTP_USERNAME`: `u877003020.sense-digital.co`
- `FTP_SERVER_DIR`: `/public_html/`

Solo te faltaria definir o cambiar la contrasena FTP y guardarla en `FTP_PASSWORD`.

## Preparacion en Hostinger

### 1. Cambiar o confirmar la contrasena FTP

En Hostinger:

- `Archivos`
- `Cuentas FTP`
- `Cambiar la contrasena de FTP`

Usa una contrasena dedicada para deploy.

### 2. Guardar los secrets en GitHub

En GitHub:

- `Settings`
- `Secrets and variables`
- `Actions`
- `New repository secret`

Crea:

- `FTP_HOST`
- `FTP_PORT`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_SERVER_DIR`

### 3. Probar un deploy automatico

Haz un cambio pequeno y subelo:

```bash
git add .
git commit -m "test: ftp deploy"
git push
```

Luego revisa el workflow en GitHub Actions.

## Separacion con el blog en WordPress

Tu idea sigue encajando bien:

- `sense-digital.co` o `www.sense-digital.co`: web estatica principal
- `blog.sense-digital.co`: WordPress para contenido SEO

## Notas importantes

- El workflow sube solo lo necesario para la web estatica.
- El archivo `logo sense digital  (1).png` queda excluido para no ensuciar `public_html`.
- Si luego mueves WordPress a `blog.sense-digital.co`, no mezcles ese blog dentro del mismo repo de la web estatica.
