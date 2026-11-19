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
    }),
  ],
});
