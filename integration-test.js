const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://nachocz.github.io/ignacio-cuiral-zueco.github.io/';

function parseTranslations(file) {
    const source = fs.readFileSync(file, 'utf8');
    const declaration = source.indexOf('const translations = {');
    if (declaration < 0) throw new Error(`${file}: translations object not found`);
    const objectStart = source.indexOf('{', declaration);
    const boundary = file === 'i18n.js' ? source.length : source.indexOf('const isEmbedded', objectStart);
    const objectEnd = source.lastIndexOf('};', boundary);
    return Function(`return (${source.slice(objectStart, objectEnd + 1)})`)();
}

const checks = [
    ['index.html', 'i18n.js'],
    ['robotics-demo.html', 'robotics-demo.html'],
    ['shape-comparison.html', 'shape-comparison.html'],
    ['shape-features-demo.html', 'shape-features-demo.html']
];

for (const [htmlFile, dictionaryFile] of checks) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    const dictionary = fs.readFileSync(dictionaryFile, 'utf8');
    const parsedTranslations = parseTranslations(dictionaryFile);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const keys = [...new Set(
        [...html.matchAll(/data-i18n(?:-aria-label|-title)?="([^"]+)"/g)].map(match => match[1])
    )];
    const missing = keys.filter(key =>
        !new RegExp(`(?:^|[,\\s{])${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`, 'm')
            .test(dictionary));
    const missingEnglish = keys.filter(key => typeof parsedTranslations.en?.[key] !== 'string');
    const missingSpanish = keys.filter(key => typeof parsedTranslations.es?.[key] !== 'string');
    if (duplicates.length || missing.length || missingEnglish.length || missingSpanish.length) {
        throw new Error(`${htmlFile}: duplicate IDs ${duplicates}; missing keys ${missing}; missing EN ${missingEnglish}; missing ES ${missingSpanish}`);
    }
    console.log(`${htmlFile}: ${ids.length} unique IDs; ${keys.length} translation keys found`);
}

const index = fs.readFileSync('index.html', 'utf8');
for (const match of index.matchAll(/<iframe[^>]+src="([^"]+)"/g)) {
    if (/^https?:/.test(match[1])) continue;
    const localPath = match[1].split(/[?#]/, 1)[0];
    if (!fs.existsSync(path.resolve(localPath))) throw new Error(`Missing iframe ${match[1]}`);
    console.log(`iframe found: ${match[1]}`);
}

const canonicalPages = new Map([
    ['index.html', SITE_URL],
    ['robotics-demo.html', `${SITE_URL}robotics-demo.html`],
    ['shape-comparison.html', `${SITE_URL}shape-comparison.html`],
    ['shape-features-demo.html', `${SITE_URL}shape-features-demo.html`]
]);

for (const [htmlFile, expectedCanonical] of canonicalPages) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
    const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim();
    if (canonical !== expectedCanonical) {
        throw new Error(`${htmlFile}: expected canonical ${expectedCanonical}, found ${canonical || 'none'}`);
    }
    if (!title || !description) throw new Error(`${htmlFile}: missing title or meta description`);
    console.log(`${htmlFile}: SEO metadata found; canonical ${canonical}`);
}

const jsonLdSource = index.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
if (!jsonLdSource) throw new Error('index.html: JSON-LD not found');
const jsonLd = JSON.parse(jsonLdSource);
const person = jsonLd['@graph']?.find(entry => entry['@type'] === 'Person');
if (!person || !person.alternateName?.includes('Ignacio Cuiral Zueco')) {
    throw new Error('index.html: Person JSON-LD is missing the unhyphenated name');
}
if (!person.sameAs?.some(url => url.startsWith('https://orcid.org/'))) {
    throw new Error('index.html: Person JSON-LD is missing ORCID');
}
console.log('index.html: Person/ProfilePage structured data parsed');

const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
for (const canonical of canonicalPages.values()) {
    if (!sitemap.includes(`<loc>${canonical}</loc>`)) {
        throw new Error(`sitemap.xml: missing ${canonical}`);
    }
}

const robots = fs.readFileSync('robots.txt', 'utf8');
if (!robots.includes(`Sitemap: ${SITE_URL}sitemap.xml`)) {
    throw new Error('robots.txt: sitemap URL does not match the deployed site');
}
console.log('sitemap.xml and robots.txt: production URLs are consistent');
