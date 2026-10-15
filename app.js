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
    const demoTabs = [...document.querySelectorAll('.demo-tab')];
    const demoPanels = [...document.querySelectorAll('.demo-panel')];
    const demoFrameIds = ['manipulate-iframe', 'shape-iframe', 'representations-iframe', 'data-driven-iframe'];
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

        document.documentElement.lang = currentLanguage;
        document.querySelectorAll('.lang-btn').forEach((button) => {
            const isActive = button.dataset.lang === currentLanguage;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
        updateThemeButton();
    }

    function demoTargetOrigin() {
        return window.location.protocol === 'file:' ? '*' : window.location.origin;
    }

    function notifyDemoFrames() {
        const theme = document.documentElement.dataset.theme || 'light';
        demoFrameIds.forEach((id) => {
            document.getElementById(id)?.contentWindow?.postMessage(
                { type: 'setPreferences', language: currentLanguage, theme },
                demoTargetOrigin()
            );
        });
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

        notifyDemoFrames();
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
        notifyDemoFrames();
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

    // ------------------------------------------------------------------
    // demo tabs
    // ------------------------------------------------------------------

    function activateDemo(targetId) {
        const targetTab = demoTabs.find((tab) => tab.dataset.target === targetId);
        if (!targetTab) return;

        demoTabs.forEach((tab) => {
            const isActive = tab === targetTab;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
            tab.tabIndex = isActive ? 0 : -1;
        });

        demoPanels.forEach((panel) => {
            const isActive = panel.id === targetId;
            panel.classList.toggle('active', isActive);
            panel.hidden = !isActive;
        });
    }

    function handleDemoKeydown(event) {
        const currentIndex = demoTabs.indexOf(event.currentTarget);
        let nextIndex = currentIndex;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % demoTabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + demoTabs.length) % demoTabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = demoTabs.length - 1;
        if (nextIndex === currentIndex) return;

        event.preventDefault();
        demoTabs[nextIndex].focus();
        activateDemo(demoTabs[nextIndex].dataset.target);
    }

    function initializeDemoTabs() {
        demoTabs.forEach((tab, index) => {
            tab.id = `demo-tab-${index + 1}`;
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-controls', tab.dataset.target);
            tab.addEventListener('click', () => activateDemo(tab.dataset.target));
            tab.addEventListener('keydown', handleDemoKeydown);
        });

        demoPanels.forEach((panel, index) => {
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', demoTabs[index]?.id || '');
        });

        activateDemo(demoTabs[0]?.dataset.target);
    }

    // ------------------------------------------------------------------
    // embedded demos: height and step-to-step navigation
    // ------------------------------------------------------------------

    function initializeDemoFrames() {
        demoFrameIds.forEach((id) => {
            document.getElementById(id)?.addEventListener('load', notifyDemoFrames);
        });

        window.addEventListener('message', (event) => {
            const frame = demoFrameIds
                .map((id) => document.getElementById(id))
                .find((candidate) => candidate?.contentWindow === event.source);
            if (!frame) return;

            if (event.data?.type === 'demoHeight' && Number.isFinite(event.data.height)) {
                const contentHeight = Math.min(Math.max(Math.ceil(event.data.height), 560), 6000);
                frame.style.height = `${contentHeight}px`;
            }

            if (event.data?.type === 'demoNavigate') {
                const targetId = event.data.target;
                if (!demoPanels.some((panel) => panel.id === targetId)) return;
                activateDemo(targetId);
                const tab = demoTabs.find((candidate) => candidate.dataset.target === targetId);
                tab?.focus({ preventScroll: true });
                document.querySelector('.demo-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
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
        initializeDemoTabs();
        initializeDemoFrames();
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
