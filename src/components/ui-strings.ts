/** Teksty interfejsu spoza tłumaczeń Starlight (PL jest domyślny, EN dla lang zaczynającego się od „en”). */
const strings = {
  pl: {
    docs: 'Dokumentacja',
    brandName: 'Athletic Intelligence',
    brandSub: 'Docs',
    searchDocs: 'Szukaj w dokumentacji',
    closeMenu: 'Zamknij menu',
    menuLabel: 'Menu dokumentacji',
    navLabel: 'Dokumentacja',
    language: 'Język',
    hub: 'Hub',
    themeToLight: 'Przełącz na jasny motyw',
    themeToDark: 'Przełącz na ciemny motyw',
    pagerLabel: 'Poprzednia i następna strona',
  },
  en: {
    docs: 'Documentation',
    brandName: 'Athletic Intelligence',
    brandSub: 'Docs',
    searchDocs: 'Search the documentation',
    closeMenu: 'Close menu',
    menuLabel: 'Documentation menu',
    navLabel: 'Documentation',
    language: 'Language',
    hub: 'Hub',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    pagerLabel: 'Previous and next page',
  },
} as const;

export function ui(lang: string | undefined) {
  return lang?.toLowerCase().startsWith('en') ? strings.en : strings.pl;
}

export const HUB_URL = 'https://hub.aisports.pl';

/** Lokalizacje (zgodne z `locales` w astro.config.mjs). `prefix` to ścieżka bazowa języka. */
export const LOCALES = [
  { code: 'pl', short: 'PL', label: 'Polski', prefix: '' },
  { code: 'en', short: 'EN', label: 'English', prefix: '/en' },
] as const;
