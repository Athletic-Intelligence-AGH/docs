# Athletic Intelligence Docs

Dokumentacja zespołów AGH Athletic Intelligence, publikowana pod adresem
[docs.aisports.pl](https://docs.aisports.pl). Strona jest zbudowana w
[Astro](https://astro.build) z motywem [Starlight](https://starlight.astro.build), a treść
(po polsku, z wersją angielską) żyje w tym repozytorium jako pliki Markdown.

## Wymagania

- Node.js 22 (minimum 22.12)
- npm (dołączony do Node.js; wersje zależności przypina `package-lock.json`)

## Uruchomienie lokalne

```bash
npm ci            # instalacja zależności
npm run dev       # serwer deweloperski na http://localhost:4321
npm run build     # build produkcyjny do katalogu dist/
npm run preview   # podgląd zbudowanej strony
npm run lint      # ESLint + sprawdzenie formatowania Prettierem
npm run format    # automatyczne formatowanie (Prettier)
npm run check     # sprawdzanie typów i treści (astro check)
```

Przed otwarciem PR uruchom `npm run lint`, `npm run check` i `npm run build`.

## Workflow

| Scenariusz                | Polecenie                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Lokalnie bez Dockera      | `make install && make dev` (http://localhost:4321)                                     |
| Lokalnie w Dockerze (HMR) | `make docker-dev`, `make docker-down`                                                  |
| Lint, typy, build         | `make lint`, `make check`, `make build`                                                |
| Obraz release lokalnie    | `make docker-build` (`docs:local`)                                                     |
| Release                   | tag `vX.Y.Z` (obraz w GHCR + GitHub Release), `-rc.N` to dry-run                       |
| VPS                       | `sudo deploy-docs vX.Y.Z`, pierwsze uruchomienie: [deploy/README.md](deploy/README.md) |

## Struktura katalogów

```text
.
├── astro.config.mjs          # konfiguracja Astro i Starlight (sidebar, języki, edit link)
├── src/
│   ├── assets/               # logo i inne zasoby (np. logo.svg)
│   ├── content.config.ts     # definicja kolekcji treści
│   └── content/docs/         # treść po polsku (język domyślny)
│       ├── <grupa>/          # strony pogrupowane tematycznie
│       └── en/               # tłumaczenia angielskie (ta sama struktura)
├── .github/                  # szablony issues i PR, CODEOWNERS, Dependabot, workflowy
├── deploy/                   # wdrożenie na VPS (patrz deploy/README.md)
├── CONTRIBUTING.md           # zasady pracy zespołu
└── package.json
```

## Jak dodać stronę

1. Utwórz plik Markdown w `src/content/docs/<grupa>/`, np. `src/content/docs/proces/review.md`.
2. Dodaj frontmatter:

   ```md
   ---
   title: Code review
   description: Jak prowadzimy review Pull Requestów.
   ---
   ```

3. Dodaj wpis w sidebarze w `astro.config.mjs` (pole `starlight.sidebar`), używając ścieżki bez
   rozszerzenia, np. `'proces/review'`.
4. Dodaj wersję angielską w `src/content/docs/en/<grupa>/review.md` z tym samym slugiem. Jeśli
   tłumaczenia jeszcze nie ma, zostaw krótki plik z adnotacją „English translation pending”.
5. Sprawdź stronę przez `npm run dev` i uruchom `npm run lint`.

## Logo

Logo to plik `src/assets/logo.svg`. Obecnie jest to placeholder („AI”).

> TODO (zespół): dostarczyć docelowe logo i podmienić plik `src/assets/logo.svg`. Konfiguracja w
> `astro.config.mjs` nie wymaga zmian, o ile nazwa pliku pozostaje taka sama.

## Edytuj na GitHubie i „ostatnia aktualizacja”

- Każda strona ma link „Edytuj stronę” prowadzący do pliku w gałęzi `main` tego repozytorium
  (`editLink.baseUrl` w `astro.config.mjs`). Edycja z poziomu GitHuba tworzy branch i PR.
- Data „Ostatnia aktualizacja” (`lastUpdated: true`) jest liczona z historii git. Wymaga to
  **pełnej historii**: w CI checkout musi używać `fetch-depth: 0`. Przy płytkim klonie wszystkie
  strony dostaną tę samą (błędną) datę. Lokalnie unikaj `git clone --depth`.

## Release i wdrożenie

1. Zmiany wchodzą przez PR i merge do `main` (zielone CI).
2. Wypuszczenie wersji to tag z numerem semantycznym:

   ```bash
   git checkout main && git pull
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

3. Workflow `release.yml` uruchamia lint, `astro check` i build, buduje obraz z plikami
   statycznymi (`ghcr.io/athletic-intelligence-agh/docs:vX.Y.Z`, jak w `athletic-hub`) i tworzy
   GitHub Release z automatycznymi notatkami. Wymaga tylko `GITHUB_TOKEN`.
4. Wdrożenie na [docs.aisports.pl](https://docs.aisports.pl) to ręczny krok na VPS:
   `sudo deploy-docs vX.Y.Z` (wyciąga pliki z obrazu, atomowo przełącza symlink, który serwuje
   Caddy). Skrypt i założenia opisuje [deploy/README.md](deploy/README.md).
5. Tag pre-release z sufiksem `-rc.N` (np. `v1.2.0-rc.1`) to próba (dry-run): workflow buduje i
   waliduje stronę oraz obraz, ale **nie wypycha obrazu** do GHCR.

Szczegóły wdrożenia, serwera i procedury awaryjnej opisuje [deploy/README.md](deploy/README.md).

## Ustawienia GitHub do wklikania

Poniższe ustawienia konfiguruje administrator organizacji ręcznie w interfejsie GitHuba.
Repozytorium ich nie ustawia samo, to jest tylko opis oczekiwanej konfiguracji.

### Branch protection dla `main`

_Settings → Branches → Add branch ruleset / protection rule_

- Wymagany Pull Request przed merge, minimum 1 approval.
- Wymagane status checki z `ci.yml` (nazwy jobów wybierz po pierwszym uruchomieniu workflowu).
- Branche muszą być aktualne względem `main` przed merge.
- Wymagane rozwiązanie wszystkich konwersacji.
- Zakaz force-push i usuwania gałęzi `main`.

### Merge

_Settings → General → Pull Requests_

- Tylko squash merge (wyłącz merge commit i rebase merge).
- Domyślny tytuł commita: tytuł PR (Conventional Commits).
- Włączone „Automatically delete head branches”.

### Environment `production`

_Settings → Environments → New environment → `production`_

Sekrety środowiska (używane przez `release.yml`):

| Sekret                 | Opis                                       |
| ---------------------- | ------------------------------------------ |
| `VPS_HOST`             | adres hosta VPS                            |
| `VPS_USER`             | użytkownik SSH do wdrożeń                  |
| `VPS_SSH_KEY`          | prywatny klucz SSH tego użytkownika        |
| `VPS_HOST_FINGERPRINT` | fingerprint klucza hosta (weryfikacja SSH) |

Opcjonalnie włącz „Required reviewers” dla środowiska oraz ogranicz je do tagów `v*`.

### Ochrona tagów

_Settings → Rules → Rulesets → New tag ruleset_

- Wzorzec `v*`: tworzenie tagów tylko dla maintainerów, zakaz aktualizacji i usuwania.

### Actions permissions

_Settings → Actions → General_

- Dozwolone tylko akcje z GitHuba i zweryfikowanych wydawców (lub wskazana lista).
- Domyślne uprawnienia `GITHUB_TOKEN`: tylko odczyt (workflowy podnoszą je jawnie).
- Workflowy z forków wymagają zatwierdzenia przed uruchomieniem.
