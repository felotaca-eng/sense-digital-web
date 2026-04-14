import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const siteUrl = 'https://sense-digital.co';
const today = new Date().toISOString().slice(0, 10);

const staticPaths = [
  '/',
  '/nosotros.html',
  '/contacto.html',
  '/blog/',
  '/servicios/marketing-digital.html',
  '/servicios/desarrollo-web.html',
  '/servicios/apps-moviles.html',
  '/servicios/automatizacion-ia.html',
  '/servicios/whatsapp-ia.html',
  '/servicios/diseno-branding.html',
  '/servicios/query-erp.html',
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function loadPublishedPosts() {
  const manifestPath = path.join(root, 'blog', 'posts-manifest.json');
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((post) => ({
        loc: `${siteUrl}/blog/${String(post.url || '').replace(/^\//, '')}`,
        lastmod: String(post.publishAt || '').slice(0, 10) || today,
      }))
      .filter((post) => post.loc.includes('/blog/posts/') && post.loc.endsWith('.html'));
  } catch {
    return [];
  }
}

async function main() {
  const postUrls = await loadPublishedPosts();
  const pages = [
    ...staticPaths.map((pathname) => ({
      loc: `${siteUrl}${pathname}`,
      lastmod: today,
    })),
    ...postUrls,
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map(
      (entry) =>
        `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n  </url>`
    ),
    '</urlset>',
    '',
  ].join('\n');

  const outputPath = path.join(root, 'sitemap.xml');
  await fs.writeFile(outputPath, xml, 'utf8');
  console.log(`Sitemap generado con ${pages.length} URLs en ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
