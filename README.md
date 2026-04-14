# Sense Digital Web

Sitio estatico en HTML para la web comercial de Sense Digital.

## Estructura

- [index.html](/Users/felipeotalora/Desktop/Proyectos/sense-digital-web/index.html)
- [servicios/](/Users/felipeotalora/Desktop/Proyectos/sense-digital-web/servicios)
- [blog/](/Users/felipeotalora/Desktop/Proyectos/sense-digital-web/blog)
- [DEPLOY.md](/Users/felipeotalora/Desktop/Proyectos/sense-digital-web/DEPLOY.md)

## Deploy

El proyecto incluye estos workflows:

- [.github/workflows/deploy.yml](/Users/felipeotalora/Desktop/Proyectos/sense-digital-web/.github/workflows/deploy.yml)
- [.github/workflows/blog-scheduler.yml](/Users/felipeotalora/Desktop/Proyectos/sense-digital-web/.github/workflows/blog-scheduler.yml)

Revisa la guia completa en:

- [DEPLOY.md](/Users/felipeotalora/Desktop/Proyectos/sense-digital-web/DEPLOY.md)

## Blog programado (8:00 a. m. Bogota)

Publicacion automatica diaria via cron de GitHub Actions.

### Archivos clave

- `blog/posts-manifest.json`: articulos ya publicados
- `blog/drafts-manifest.json`: articulos programados
- `blog/drafts/*.html`: borradores
- `scripts/publish-scheduled-posts.mjs`: script de publicacion

### Como programar un nuevo articulo

1. Crea el HTML en `blog/drafts/`.
2. Agrega su metadata en `blog/drafts-manifest.json` con:
   - `slug`
   - `title`
   - `excerpt`
   - `category`
   - `publishAt` (ejemplo: `2026-04-20T08:00:00-05:00`)
   - `coverImage`
   - `draftFile`
3. Haz push a `main`.
4. El cron diario a las 8:00 a. m. (Bogota) lo movera a `blog/posts/` y actualizara el manifest.
