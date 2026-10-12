// Writes sitemap.xml into the build output, listing every prerendered page.
// Run after `nx build guide` (see the "build" script in package.json).
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE_URL = 'https://coral-island-guide-cn.pages.dev';
const OUTPUT_DIR = 'dist/packages/guide/browser';
// Personal progress pages and beta/live comparison pages are not useful in search results.
const EXCLUDED_PREFIXES = ['/my', '/only-in-beta', '/only-in-live'];

function findPages(dir, route = '') {
    const pages = [];
    for (const name of readdirSync(dir)) {
        const fullPath = join(dir, name);
        if (statSync(fullPath).isDirectory()) {
            if (name !== 'assets') pages.push(...findPages(fullPath, `${route}/${name}`));
        } else if (name === 'index.html') {
            pages.push(route || '/');
        }
    }
    return pages;
}

const pages = findPages(OUTPUT_DIR)
    .filter(route => !EXCLUDED_PREFIXES.some(prefix => route === prefix || route.startsWith(prefix + '/')))
    .sort();

const urls = pages.map(route => `  <url><loc>${SITE_URL}${encodeURI(route)}</loc></url>`).join('\n');
writeFileSync(
    join(OUTPUT_DIR, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`sitemap.xml: ${pages.length} pages`);
