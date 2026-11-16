# Ignacio Cuiral-Zueco — personal site

A bilingual research portfolio focused on robotics, deformable-object manipulation, and shape control. The site is built with semantic HTML, modern CSS, and dependency-free JavaScript so it can be served directly by GitHub Pages.

[View the published website](https://ignaciocuiral.com/)

The site is served from the custom domain in `CNAME`. Old `nachocz.github.io/ignacio-cuiral-zueco.github.io/` links redirect there, and all canonical URLs, the sitemap and `robots.txt` use `https://ignaciocuiral.com/`.

## Local preview

From the repository root, run:

```powershell
py -m http.server 8000
```

Then open `http://localhost:8000`.

## Repository layout

```
index.html                 main page, generated from sections/ (do not edit)
404.html                   not-found page; forwards the URLs of moved pages and files
sections/                  sources of the main page, one folder per section
  layout.html              page frame: head, metadata, top bar and footer
  layout.text.js           English and Spanish text of the top bar and footer
  news/                    content.html (markup) and text.js (English and Spanish text)
  cv/
  research/
  publications/
  demos/
  misc/
assets/
  css/styles.css           styles of the main page
  js/app.js                section switching, language and theme
  js/i18n.js               English and Spanish text of the main page, generated from sections/ (do not edit)
  images/
    profile/               portrait (also the favicon and the social preview image)
    news/                  photos of the News section
    research/              figures of the research lines
    demos/                 thumbnails of the interactive research demos
    misc/                  outreach media and the "People I admire" thumbnails (admire/)
  downloads/               BibTeX file, posters and thesis flyers
games/                     mini-games of the Demos section, one folder each
  shape-comparison/        index.html, style.css, script.js, thumbnail.jpg
  rod-threading/
  egg-incubator/
  cavity-inspection/
demos/                     standalone interactive demos (not linked from the main page)
  cable-challenge/         index.html, style.css, script.js
  shape-features/
tools/                     development scripts, excluded from the published site
  build.js                 assembles index.html and assets/js/i18n.js from sections/
  integration-test.js
  cavity-sites.js
CNAME, robots.txt, sitemap.xml, _config.yml
```

## Editing the main page

The main page is served as a single `index.html`, as before, but its sources are split by section. To change a section, edit its folder in `sections/` and run:

```powershell
node tools/build.js
```

The build inserts each `content.html` at its marker in `layout.html` (`<!-- News: sections/news/content.html -->`, …) and merges the `text.js` files into `assets/js/i18n.js`. Commit the sources and the two generated files together. Links and image paths in `content.html` are written relative to the site root, as they appear in `index.html`.

A `text.js` file holds an object with an `en` and an `es` block that define the same keys; a key may be defined in only one file. A section can use keys of another one (the award names of `news/text.js` also appear in the CV). The build stops on a syntax error, a key missing in one language or a duplicate key.

The first comment of each generated file carries a stamp of its content. If `index.html` or `i18n.js` was edited directly, the build stops instead of overwriting it: move the change into `sections/` and build again, or run `node tools/build.js --force` to discard it. `node tools/build.js --check` reports whether the generated files are up to date, and the integration test fails if they are not.

## Games and demos

Each game and demo folder is self-contained: the page markup is in `index.html`, its styles in `style.css`, and its code and `translations` object in `script.js`. Pages link to each other with relative paths, so the site works from any local server rooted at the repository.

## Main features

- English and Spanish content with a saved language preference
- System-aware light and dark themes with a manual override
- One page per section (News, CV, Research, Publications, Demos, Miscellany), addressed by the URL hash (`#cv`, `#demos`, `#misc`, …); the old `#dissemination` hash opens Demos and the old `#outreach` hash opens Miscellany
- Demos page with links to the interactive research demos and four bilingual mini-games: shape comparison (`games/shape-comparison/`), rod threading (`games/rod-threading/`, with a joint-space hard mode at `games/rod-threading/?mode=hard`), the dino egg incubator (`games/egg-incubator/`) and cavity inspection (`games/cavity-inspection/`, with its five sites at `?site=1` to `?site=5`). In the three research mini-games, Show solution runs the controller of the corresponding paper: the shape-servoing loop of the tutorial, ergodic heat coverage control (EHCC), and the null-space controller of the passive soft extension
- Responsive and print-friendly layouts
- Publication links, downloadable BibTeX, posters, and thesis flyers

## Moved URLs

Until November 2026 the games and demos were single files at the root (`rod-threading.html`, `robotics-demo.html`, …) and the downloads lived under `assets/images/`, `assets/ERF_2026/` and the root. GitHub Pages serves `404.html` for those paths, and its `MOVED` map forwards each one to the new location, keeping the query string and the hash. When a page or a downloadable file moves again, add its old path to that map; the integration test checks that every old path is free and that every new path exists.

## Checks and generated content

Translations live in `sections/` (main page, see above) and in the `translations` object of each game or demo `script.js`. Run `node tools/integration-test.js` after editing text or moving files. It checks that `index.html` and `assets/js/i18n.js` are up to date with `sections/`, that every `data-i18n` key has English and Spanish entries, that every local `href` and `src` resolves to a file, that canonical URLs, the sitemap and the `404.html` forwards are consistent, and it replays the controller solution of every cavity-inspection site.

The simulation core of `games/cavity-inspection/script.js` (from `const Core = (() => {` to `// end of the simulation core`) ports the model and the controller of [passive_soft_extension_control](https://github.com/nachocz/passive_soft_extension_control) (`docs/js/sim`) and embeds its identified span map. Its five sites are generated by `node tools/cavity-sites.js` (about three minutes), which writes them into the `SITES` literal of that script: viewpoints sampled from collision-free null-space motions, a closed-loop run of the controller to each viewpoint, and each damaged part placed on the optical axis of the configuration that the controller reached.

The production site is published from the repository through GitHub Pages.

## Search indexing after deployment

Add the domain property `ignaciocuiral.com` in Google Search Console, submit `https://ignaciocuiral.com/sitemap.xml`, and request indexing for the home page after substantial updates. Keep the same website URL on ORCID, Google Scholar, DBLP, LinkedIn, GitHub, and university profile pages so search engines can connect those profiles to this site.
