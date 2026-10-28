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

## Main features

- English and Spanish content with a saved language preference
- System-aware light and dark themes with a manual override
- One page per section (News, CV, Research, Publications, Demos, Outreach), addressed by the URL hash (`#cv`, `#demos`, …); the old `#dissemination` hash opens Demos
- Demos page with links to the interactive paper companions and two mini-games: shape comparison (`shape-comparison.html`) and rod threading (`rod-threading.html`, with a joint-space hard mode at `rod-threading.html?mode=hard`)
- Responsive and print-friendly layouts
- Publication links, downloadable BibTeX, posters, and thesis flyers

Translations live in `i18n.js` (main page) and in each demo page's own `translations` object. Run `node integration-test.js` after editing text to check that every `data-i18n` key has English and Spanish entries.

The production site is published from the repository through GitHub Pages.

## Search indexing after deployment

Add the domain property `ignaciocuiral.com` in Google Search Console, submit `https://ignaciocuiral.com/sitemap.xml`, and request indexing for the home page after substantial updates. Keep the same website URL on ORCID, Google Scholar, DBLP, LinkedIn, GitHub, and university profile pages so search engines can connect those profiles to this site.
