// Site checks: node tools/integration-test.js (from any directory)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE_URL = 'https://ignaciocuiral.com/';
const I18N = 'assets/js/i18n.js';

const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(ROOT, file));

// Resolves a site path (relative to the repository root) to the file that is served for it.
function servedFile(sitePath) {
    const clean = sitePath.split(/[?#]/, 1)[0];
    return clean === '' || clean.endsWith('/') ? `${clean}index.html` : clean;
}

// Resolves an href or src of a page to the file that is served for it.
function referencedFile(htmlFile, reference) {
    const target = reference.split(/[?#]/, 1)[0];
    if (target === '') return htmlFile;
    const sitePath = target.startsWith('/')
        ? target.slice(1)
        : path.posix.join(path.posix.dirname(htmlFile), target);
    return servedFile(sitePath.replace(/^\.\//, ''));
}

function parseTranslations(file) {
    const source = read(file);
    const declaration = source.indexOf('const translations = {');
    if (declaration < 0) throw new Error(`${file}: translations object not found`);
    const objectStart = source.indexOf('{', declaration);
    const boundary = file === I18N ? source.length : source.indexOf('const isEmbedded', objectStart);
    const objectEnd = source.lastIndexOf('};', boundary);
    return Function(`return (${source.slice(objectStart, objectEnd + 1)})`)();
}

// index.html and assets/js/i18n.js are generated from sections/ by tools/build.js.
const generator = require('./build.js');
const generated = generator.status();
if (generated.stale.length) throw new Error(generator.describe(generated));
console.log('index.html and assets/js/i18n.js: up to date with sections/');

// Each page with its public URL and the script that holds its translations
// (each game and demo folder holds index.html, style.css and script.js).
const pages = [
    { html: 'index.html', url: SITE_URL, dictionary: I18N },
    { html: 'games/shape-comparison/index.html', url: `${SITE_URL}games/shape-comparison/` },
    { html: 'games/rod-threading/index.html', url: `${SITE_URL}games/rod-threading/` },
    { html: 'games/egg-incubator/index.html', url: `${SITE_URL}games/egg-incubator/` },
    { html: 'games/cavity-inspection/index.html', url: `${SITE_URL}games/cavity-inspection/` },
    { html: 'demos/cable-challenge/index.html', url: `${SITE_URL}demos/cable-challenge/` },
    { html: 'demos/shape-features/index.html', url: `${SITE_URL}demos/shape-features/` }
];
for (const page of pages) {
    page.dictionary = page.dictionary || path.posix.join(path.posix.dirname(page.html), 'script.js');
}

for (const { html: htmlFile, dictionary: dictionaryFile } of pages) {
    const html = read(htmlFile);
    const dictionary = read(dictionaryFile);
    const parsedTranslations = parseTranslations(dictionaryFile);
    // IDs written by the script (markup templates) share the document with those of the page.
    const ids = [...(html + dictionary).matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const keys = [...new Set(
        [...html.matchAll(/data-i18n(?:-aria-label|-title|-alt)?="([^"]+)"/g)].map(match => match[1])
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

// Every local href and src of every page has to resolve to a file of the repository.
for (const htmlFile of [...pages.map(page => page.html), '404.html']) {
    const html = read(htmlFile);
    let checked = 0;
    for (const match of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
        const reference = match[1];
        if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) continue;
        const file = referencedFile(htmlFile, reference);
        if (!exists(file)) throw new Error(`${htmlFile}: missing local file for ${reference} (${file})`);
        checked++;
    }
    console.log(`${htmlFile}: ${checked} local links resolve`);
}

const index = read('index.html');
if (index.includes('habra-akelarre')) {
    throw new Error('index.html: the Akelarre game is served at habra-akelarre/ but must not be linked from the site');
}

for (const { html: htmlFile, url: expectedCanonical } of pages) {
    const html = read(htmlFile);
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    const ogUrl = html.match(/<meta\s+property="og:url"\s+content="([^"]+)"/i)?.[1];
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
    const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim();
    if (canonical !== expectedCanonical) {
        throw new Error(`${htmlFile}: expected canonical ${expectedCanonical}, found ${canonical || 'none'}`);
    }
    if (ogUrl && ogUrl !== expectedCanonical) throw new Error(`${htmlFile}: og:url ${ogUrl} differs from the canonical URL`);
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
for (const url of JSON.stringify(jsonLd).match(/https:\/\/ignaciocuiral\.com\/[^"#]+/g) || []) {
    if (!exists(servedFile(url.slice(SITE_URL.length)))) throw new Error(`index.html: JSON-LD links to missing ${url}`);
}
console.log('index.html: Person/ProfilePage structured data parsed');

const sitemap = read('sitemap.xml');
for (const { url } of pages) {
    if (!sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`sitemap.xml: missing ${url}`);
}
for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (!exists(servedFile(url.slice(SITE_URL.length)))) throw new Error(`sitemap.xml: ${url} has no page`);
}

const robots = read('robots.txt');
if (!robots.includes(`Sitemap: ${SITE_URL}sitemap.xml`)) {
    throw new Error('robots.txt: sitemap URL does not match the deployed site');
}
console.log('sitemap.xml and robots.txt: production URLs are consistent');

// The URLs of moved pages and files are forwarded by 404.html: the old path must be free
// (otherwise GitHub Pages never serves the 404 page) and the new path must exist.
const notFound = read('404.html');
const moved = [...notFound.matchAll(/'(\/[^']+)': '(\/[^']+)'/g)];
if (!moved.length) throw new Error('404.html: redirect map not found');
for (const [, from, to] of moved) {
    if (exists(from.slice(1))) throw new Error(`404.html: ${from} still exists, so it is never forwarded`);
    if (!exists(servedFile(to.slice(1)))) throw new Error(`404.html: ${from} is forwarded to the missing ${to}`);
}
console.log(`404.html: ${moved.length} moved URLs are forwarded to existing files`);

const akelarre = read('habra-akelarre/index.html');
const akelarreGame = read('habra-akelarre/js/juego.js');
if (!/^<!DOCTYPE html>\s*<html lang="es">/i.test(akelarre)) {
    throw new Error('habra-akelarre/index.html: the game must declare Spanish as its language');
}
if (!akelarre.includes('<meta name="robots" content="noindex, nofollow">') || sitemap.includes('habra-akelarre') ||
    notFound.includes('habra-akelarre')) {
    throw new Error('habra-akelarre: the unlinked game must stay out of search indexes, the sitemap and 404.html');
}
if (!akelarre.includes('id="reloj-arco"') || !akelarre.includes('pathLength="100"') ||
    !akelarreGame.includes("strokeDashoffset = String(100 * (1 - proporcion))") ||
    !read('habra-akelarre/css/juego.css').includes('transform-origin: center')) {
    throw new Error('habra-akelarre: the countdown arc must use normalized remaining time');
}
if (akelarreGame.includes("classList.toggle('aviso'") || !akelarreGame.includes("classList.toggle('precaucion'")) {
    throw new Error('habra-akelarre: the timer warning state must not collide with event notices');
}
if (!akelarreGame.includes("clase === 'persistente'") || !akelarreGame.includes('class="fiesta-objetos"')) {
    throw new Error('habra-akelarre: party guests must display their persistent objects');
}
const akelarreIds = [...akelarre.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicateAkelarreIds = [...new Set(akelarreIds.filter((id, index) => akelarreIds.indexOf(id) !== index))];
if (duplicateAkelarreIds.length) {
    throw new Error(`habra-akelarre/index.html: duplicate IDs ${duplicateAkelarreIds}`);
}
for (const match of akelarre.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"]+)"/g)) {
    const asset = match[1];
    if (/^https?:/.test(asset)) continue;
    if (!exists(path.posix.join('habra-akelarre', asset.split(/[?#]/, 1)[0]))) {
        throw new Error(`habra-akelarre/index.html: missing asset ${asset}`);
    }
}
console.log(`habra-akelarre/index.html: ${akelarreIds.length} unique IDs; local assets found; Spanish language declared`);

// The solution of every cavity-inspection site is replayed with the controller
// of the page: each viewpoint has to be reached and its defect reported.
const CAVITY = 'games/cavity-inspection/script.js';
const cavity = read(CAVITY);
const coreStart = cavity.indexOf('const Core = (() => {');
const coreEnd = cavity.indexOf('// end of the simulation core', coreStart);
if (coreStart < 0 || coreEnd < 0) throw new Error(`${CAVITY}: simulation core not found`);
const Core = Function(`${cavity.slice(coreStart, coreEnd)}\nreturn Core;`)();
const world = Core.createWorld();
Core.SITES.forEach((site, index) => {
    world.scene = Core.buildScene(site);
    const run = new Core.SolutionRun(world, site);
    while (!run.finished) run.step();
    const failed = run.events.filter((event) => !event.arrived || !event.found);
    if (run.events.length !== site.defects.length || failed.length) {
        throw new Error(`${CAVITY}: site ${index + 1} is not solved by the controller: ${JSON.stringify(run.events)}`);
    }
    console.log(`${CAVITY}: site ${index + 1} solved by the controller in ${run.time.toFixed(1)} s`);
});
