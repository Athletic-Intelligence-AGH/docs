// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const GITHUB_EDIT_BASE = 'https://github.com/Athletic-Intelligence-AGH/docs/edit/main/';

export default defineConfig({
  site: 'https://docs.aisports.pl',
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
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Athletic-Intelligence-AGH/docs' },
      ],
      sidebar: [
        { label: 'Start', items: ['wprowadzenie'] },
      ],
    }),
  ],
});
