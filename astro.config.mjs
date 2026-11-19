// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const GITHUB_EDIT_BASE = 'https://github.com/Athletic-Intelligence-AGH/docs/edit/main/';

export default defineConfig({
  site: 'https://docs.aisports.pl',
  redirects: {
    '/': '/start/wprowadzenie/',
  },
  integrations: [
    starlight({
      title: 'Athletic Intelligence Docs',
      // TODO: logo dostarczy zespół. Podmień plik src/assets/logo.svg (placeholder „AI”).
      logo: { src: './src/assets/logo.svg', alt: 'Athletic Intelligence' },
      defaultLocale: 'root',
      locales: {
        root: { label: 'Polski', lang: 'pl' },
        en: { label: 'English', lang: 'en' },
      },
      editLink: { baseUrl: GITHUB_EDIT_BASE },
      lastUpdated: true,
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Athletic-Intelligence-AGH/docs',
        },
      ],
      sidebar: [
        { label: 'Start', items: ['start/wprowadzenie', 'start/zadanie-od-a-do-z'] },
        {
          label: 'Issues',
          items: [
            'issues/tworzenie-issues',
            'issues/przydzielanie-i-priorytety',
            'issues/cykl-zycia-issue',
          ],
        },
        {
          label: 'Git i Pull Requesty',
          items: ['git/branche-i-commity', 'git/pull-requesty', 'git/code-review'],
        },
        { label: 'Wydania', items: ['wydania/ci-merge-i-release'] },
        { label: 'Repozytorium', items: ['repozytorium/konfiguracja-github'] },
        {
          label: 'Więcej',
          items: [
            { label: 'Hub', link: 'https://hub.aisports.pl' },
            {
              label: 'Organizacja na GitHubie',
              link: 'https://github.com/Athletic-Intelligence-AGH',
            },
          ],
        },
      ],
      customCss: [
        '@fontsource/lexend/400.css',
        '@fontsource/lexend/500.css',
        '@fontsource/lexend/600.css',
        '@fontsource/lexend/700.css',
        './src/styles/tokens.css',
        './src/styles/layout.css',
        './src/styles/content.css',
      ],
      components: {
        Header: './src/components/Header.astro',
        Sidebar: './src/components/Sidebar.astro',
        TableOfContents: './src/components/TableOfContents.astro',
        Pagination: './src/components/Pagination.astro',
        PageTitle: './src/components/PageTitle.astro',
        MobileMenuToggle: './src/components/MobileMenuToggle.astro',
        // Kopia ze Starlight: breakpoint szuflady 900px (800px w oryginale).
        PageFrame: './src/components/PageFrame.astro',
        // Domyślnie dark niezależnie od preferencji systemu.
        ThemeProvider: './src/components/ThemeProvider.astro',
      },
      expressiveCode: {
        themes: ['github-dark', 'github-light'],
        useStarlightUiThemeColors: false,
        styleOverrides: {
          borderRadius: '16px',
          borderColor: 'var(--c-border)',
          codeBackground: 'var(--c-surface-1)',
          codeForeground: 'var(--c-ink)',
          codeFontFamily: 'var(--c-mono)',
          codeFontSize: '14px',
          codeLineHeight: '24px',
          codePaddingInline: '20px',
          uiFontFamily: 'var(--c-mono)',
          uiFontSize: '12px',
          frames: {
            frameBoxShadowCssValue: 'none',
            editorTabBarBackground: 'var(--c-surface-2)',
            editorTabBarBorderBottomColor: 'var(--c-border)',
            editorActiveTabBackground: 'var(--c-surface-2)',
            editorActiveTabForeground: 'var(--c-ink-muted)',
            editorActiveTabBorderColor: 'transparent',
            editorActiveTabIndicatorTopColor: 'transparent',
            editorActiveTabIndicatorBottomColor: 'transparent',
            terminalBackground: 'var(--c-surface-1)',
            terminalTitlebarBackground: 'var(--c-surface-2)',
            terminalTitlebarForeground: 'var(--c-ink-muted)',
            terminalTitlebarBorderBottomColor: 'var(--c-border)',
            terminalTitlebarDotsOpacity: '0',
          },
        },
      },
      sidebar: [{ label: 'Start', items: ['wprowadzenie'] }],
    }),
  ],
});
