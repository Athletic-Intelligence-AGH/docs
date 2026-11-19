# Jak współtworzyć dokumentację

Krótki skrót zasad pracy. Pełny opis workflow znajdziesz na stronie „Workflow deweloperski” w
dokumentacji.

## Workflow

1. **Issue.** Każda zmiana zaczyna się od issue (szablony: feature, bug, task, spike) z kryteriami
   akceptacji.
2. **Branch.** Utwórz branch z `main` o nazwie `feat/NNN-opis` (lub `fix/`, `docs/`, `chore/`,
   `ci/`), gdzie `NNN` to numer issue, np. `feat/42-strona-onboarding`.
3. **Draft PR.** Otwórz wcześnie Pull Request jako draft, w opisie dodaj `Closes #NNN`. Gdy jest
   gotowy, oznacz „Ready for review”.
4. **Review.** Reviewer odpowiada w ciągu 1 dnia roboczego. Autor rozwiązuje wszystkie komentarze.
5. **Merge.** Squash merge po zielonym CI i minimum jednym approvalu. Tytuł PR staje się commitem na
   `main`, więc musi spełniać Conventional Commits.

## Conventional Commits

Format: `typ(zakres opcjonalny): opis w trybie rozkazującym`.

```text
feat: dodaj stronę o onboardingu nowych członków
fix: popraw link do sidebaru w wersji angielskiej
docs: uzupełnij sekcję o release w README
chore: zaktualizuj zależności Astro
ci: dodaj fetch-depth 0 do checkoutu w workflow
```

Zmiany łamiące kompatybilność oznacz wykrzyknikiem (`feat!: ...`) i opisem w treści commita.

## Zasady małych PR

- Jeden PR, jeden cel. Nie mieszaj treści, motywu i konfiguracji CI.
- Celuj w diff do kilkuset linii, tak aby review zajęło kilkanaście minut.
- Większe zmiany dziel na kolejne PR (najpierw szkielet, potem treść).
- Przed prośbą o review uruchom `npm run lint`, `npm run check` i `npm run build`.
- Nowa strona po polsku powinna mieć też plik w `src/content/docs/en/` (nawet jako zalążek).

Instrukcje uruchomienia i dodawania stron: [README.md](README.md).
