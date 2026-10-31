(() => {
    'use strict';

    const VALID_LANGUAGES = ['en', 'es'];
    const VALID_THEMES = ['light', 'dark'];
    const DEFAULT_PANEL = 'panel-news';
    // Hashes used by earlier versions of the site keep working.
    const PANEL_ALIASES = { dissemination: 'demos', home: 'news' };
    const THEME_COLORS = { light: '#23282d', dark: '#0e1012' };

    const navLinks = [...document.querySelectorAll('.site-nav a[data-panel]')];
    const panels = [...document.querySelectorAll('.panel')];
    const themeToggle = document.getElementById('theme-toggle');
    const themeColor = document.querySelector('meta[name="theme-color"]');

    function readPreference(key, fallback) {
        try {
            return localStorage.getItem(key) || fallback;
        } catch (error) {
            return fallback;
        }
    }

    function savePreference(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // Preferences remain available for the current session when storage is blocked.
        }
    }

    let currentLanguage = readPreference('language', 'en');
    if (!VALID_LANGUAGES.includes(currentLanguage)) currentLanguage = 'en';

    function currentTranslations() {
        return translations[currentLanguage] || translations.en;
    }

    // ------------------------------------------------------------------
    // language and theme
    // ------------------------------------------------------------------

    function applyTranslations() {
        const dictionary = currentTranslations();
        const attributes = [
            ['data-i18n-aria-label', 'aria-label'],
            ['data-i18n-title', 'title'],
            ['data-i18n-alt', 'alt']
        ];

        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const value = dictionary[element.dataset.i18n];
            if (typeof value === 'string') element.textContent = value;
        });

        attributes.forEach(([source, target]) => {
            document.querySelectorAll(`[${source}]`).forEach((element) => {
                const value = dictionary[element.getAttribute(source)];
                if (typeof value === 'string') element.setAttribute(target, value);
            });
        });

        document.querySelectorAll('[data-language-only]').forEach((element) => {
            element.hidden = element.dataset.languageOnly !== currentLanguage;
        });

        document.documentElement.lang = currentLanguage;
        document.querySelectorAll('.lang-btn').forEach((button) => {
            const isActive = button.dataset.lang === currentLanguage;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
        updateThemeButton();
    }

    function setLanguage(language) {
        if (!VALID_LANGUAGES.includes(language)) return;

        currentLanguage = language;
        savePreference('language', language);
        applyTranslations();

        const locoVideo = document.getElementById('locoVerseVideo');
        const videoId = language === 'es' ? '0rMbIkIO2SI' : 'gARHGLxpAdU';
        const nextSource = `https://www.youtube.com/embed/${videoId}`;
        if (locoVideo && locoVideo.src !== nextSource) locoVideo.src = nextSource;
    }

    function updateThemeButton() {
        const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
        if (themeColor) themeColor.content = THEME_COLORS[theme];
        if (!themeToggle) return;

        const label = currentTranslations()[theme === 'dark' ? 'themeToLight' : 'themeToDark'];
        themeToggle.setAttribute('aria-label', label);
        themeToggle.setAttribute('title', label);
        themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    function setTheme(theme, persist = true) {
        if (!VALID_THEMES.includes(theme)) return;
        document.documentElement.dataset.theme = theme;
        if (persist) savePreference('theme', theme);
        updateThemeButton();
    }

    // ------------------------------------------------------------------
    // pages: one panel is shown at a time, addressed by the URL hash
    // ------------------------------------------------------------------

    function panelIdFromHash() {
        const slug = decodeURIComponent(window.location.hash.slice(1)).replace(/^panel-/, '');
        if (!slug) return null;
        const id = `panel-${PANEL_ALIASES[slug] || slug}`;
        return panels.some((panel) => panel.id === id) ? id : null;
    }

    function showPanel(targetId) {
        panels.forEach((panel) => {
            panel.hidden = panel.id !== targetId;
        });
        navLinks.forEach((link) => {
            if (link.dataset.panel === targetId) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }

    function initializeNavigation() {
        showPanel(panelIdFromHash() || DEFAULT_PANEL);

        // Hashes that name no page (for example #content from the skip link)
        // leave the current page in place.
        window.addEventListener('hashchange', () => {
            const targetId = panelIdFromHash();
            if (!targetId) return;
            showPanel(targetId);
            window.scrollTo({ top: 0, behavior: 'instant' });
        });
    }

    function initializePreferences() {
        document.querySelectorAll('.lang-btn').forEach((button) => {
            button.addEventListener('click', () => setLanguage(button.dataset.lang));
        });

        themeToggle?.addEventListener('click', () => {
            setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', (event) => {
            if (!readPreference('theme', '')) setTheme(event.matches ? 'dark' : 'light', false);
        });
    }

    function initializeFooter() {
        const year = document.getElementById('current-year');
        if (year) year.textContent = new Date().getFullYear();

        document.querySelector('.back-to-top')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function initialize() {
        initializePreferences();
        initializeNavigation();
        initializeFooter();
        applyTranslations();
        if (currentLanguage !== 'en') setLanguage(currentLanguage);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
