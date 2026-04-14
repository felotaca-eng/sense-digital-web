import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const blogDir = path.join(root, 'blog');
const draftsManifestPath = path.join(blogDir, 'drafts-manifest.json');
const postsManifestPath = path.join(blogDir, 'posts-manifest.json');
const draftsDir = path.join(blogDir, 'drafts');
const postsDir = path.join(blogDir, 'posts');
const SITE_URL = 'https://sense-digital.co';

async function readJson(filePath, fallback = []) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function toAbsoluteUrl(url = '') {
  if (!url) return `${SITE_URL}/logo.png`;
  if (/^https?:\/\//i.test(url)) return url;
  const clean = String(url).replace(/^\.?\//, '').replace(/^(\.\.\/)+/, '');
  return `${SITE_URL}/${clean}`;
}

function upsertMeta(html, pattern, replacement, fallbackInsert) {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace('</head>', `${fallbackInsert}\n</head>`);
}

function normalizePostHtml(html, coverUrl) {
  let next = html;

  // Normaliza dominio viejo y logo del navbar.
  next = next.replace(/https:\/\/sensedigital\.co/g, SITE_URL);
  next = next.replace(/(<a[^>]*class="nav-logo"[^>]*>\s*<img[^>]*src=")[^"]+(")/g, `$1/logo.png$2`);

  // Sincroniza portada para SEO/social.
  next = upsertMeta(
    next,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${coverUrl}" />`,
    `<meta property="og:image" content="${coverUrl}" />`
  );
  next = upsertMeta(
    next,
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${coverUrl}" />`,
    `<meta name="twitter:image" content="${coverUrl}" />`
  );
  next = next.replace(/("image"\s*:\s*")[^"]+(")/, `$1${coverUrl}$2`);

  return next;
}

async function main() {
  const drafts = await readJson(draftsManifestPath, []);
  const posts = await readJson(postsManifestPath, []);

  const existingSlugs = new Set(posts.map((p) => p.slug));
  const now = new Date();
  let publishedCount = 0;

  for (const draft of drafts) {
    if (!draft?.slug || !draft?.draftFile || !draft?.publishAt) continue;
    if (existingSlugs.has(draft.slug)) continue;

    const publishDate = new Date(draft.publishAt);
    if (Number.isNaN(publishDate.getTime())) continue;
    if (publishDate > now) continue;

    const source = path.join(draftsDir, draft.draftFile);
    const targetFile = `${draft.slug}.html`;
    const target = path.join(postsDir, targetFile);

    try {
      const rawDraft = await fs.readFile(source, 'utf8');
      const coverUrl = toAbsoluteUrl(draft.coverImage);
      const normalized = normalizePostHtml(rawDraft, coverUrl);
      await fs.writeFile(target, normalized, 'utf8');
    } catch (err) {
      console.warn(`No se pudo publicar draft ${draft.draftFile}: ${err.message}`);
      continue;
    }

    posts.push({
      slug: draft.slug,
      title: draft.title,
      excerpt: draft.excerpt,
      category: draft.category,
      publishAt: draft.publishAt,
      coverImage: draft.coverImage,
      url: `posts/${targetFile}`,
    });

    existingSlugs.add(draft.slug);
    publishedCount += 1;
    console.log(`Publicado: ${draft.slug}`);
  }

  posts.sort((a, b) => new Date(b.publishAt) - new Date(a.publishAt));
  await fs.writeFile(postsManifestPath, JSON.stringify(posts, null, 2) + '\n', 'utf8');

  if (publishedCount === 0) {
    console.log('No hay articulos para publicar en este ciclo.');
  } else {
    console.log(`Total articulos publicados: ${publishedCount}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
