# Wdrożenie docs.aisports.pl

Model jest taki sam jak w `athletic-hub`: tag `vX.Y.Z` buduje obraz z plikami statycznymi (`/site`) i wypycha go do GHCR (`ghcr.io/athletic-intelligence-agh/docs`). Stronę serwuje centralny Caddy z `athletic-infra` z katalogu na VPS. Workflow nie loguje się na VPS i nie używa sekretów poza `GITHUB_TOKEN`.

> **Założenie.** Repo `athletic-hub` nie pokazuje kroku, który kładzie pliki z obrazu do katalogu serwowanego przez Caddy (`/opt/athletic-hub/current`); to najpewniej ręczny krok na VPS. `deploy/deploy-docs` to nasza wersja tego kroku. Jeśli na VPS jest już skrypt dla huba, użyj jego wzorca zamiast tego pliku.

> **Workflow `release.yml` startuje wyłącznie na tag** `vX.Y.Z` lub `vX.Y.Z-rc.N`. Merge do `main` ani PR niczego nie publikuje ani nie wdraża.

## Workflow

| Scenariusz                    | Polecenie                                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Lokalnie bez Dockera          | `make install && make dev` (`npm ci && npm run dev`), http://localhost:4321                                |
| Lokalnie w Dockerze (HMR)     | `make docker-dev`, http://localhost:4321; `make docker-down` zatrzymuje                                    |
| Lint / typy / build           | `make lint`, `make check`, `make build`                                                                    |
| Build obrazu lokalnie         | `make docker-build` (obraz `docs:local`, pliki w `/site`)                                                  |
| Release przez tag             | `git tag vX.Y.Z && git push origin vX.Y.Z`: obraz w GHCR + GitHub Release z notatkami                      |
| Dry-run                       | tag `vX.Y.Z-rc.N`: lint, check, build i budowa obrazu bez pushu, pre-release w GitHubie                    |
| Wdrożenie na VPS (po release) | `sudo deploy-docs vX.Y.Z`                                                                                  |
| Wdrożenie na VPS (bez tagu)   | `docker build -t docs:local .` na VPS, potem jako root `IMAGE=docs:local deploy-docs vX.Y.Z` (patrz niżej) |
| Rollback                      | `sudo deploy-docs <poprzednia wersja>` (skrypt wypisuje ją po wdrożeniu) albo przełączenie symlinka        |

| Plik                | Gdzie trafia                                                         |
| ------------------- | -------------------------------------------------------------------- |
| `deploy-docs`       | `/usr/local/sbin/deploy-docs` na VPS (root, `chmod 755`)             |
| `Caddyfile.snippet` | dopisek do `caddy/Caddyfile` w repo `athletic-infra` (osobny PR tam) |
| `compose.dev.yaml`  | tylko lokalnie: Astro dev w Dockerze (`make docker-dev`)             |

## Pierwsze uruchomienie na VPS

Repo `athletic-infra` nie jest tu modyfikowane; zmiany w nim robi się osobnym PR-em.

### 1. DNS

Rekord `A` (i `AAAA`, jeśli VPS ma IPv6) dla `docs.aisports.pl` na ten sam adres co pozostałe domeny `aisports.pl`. Caddy wystawi certyfikat dopiero, gdy rekord wskazuje na VPS.

### 2. Katalogi

```bash
sudo mkdir -p /opt/athletic-docs/releases
```

Układ po wdrożeniach: `/opt/athletic-docs/releases/vX.Y.Z/` (pliki strony) i `/opt/athletic-docs/current` (względny symlink na bieżące wydanie).

### 3. GHCR

Pakiet `docs` powstanie jako prywatny przy pierwszym release. VPS musi móc go pobrać: `sudo docker login ghcr.io` tokenem z `read:packages` (tak jak dla `athletic-hub`) albo powiązanie pakietu z repo.

### 4. Skrypt

```bash
sudo install -m 755 -o root -g root deploy/deploy-docs /usr/local/sbin/deploy-docs
```

Skrypt waliduje wersję (tylko stabilne `vX.Y.Z`), blokuje równoległe uruchomienia (`flock`), pobiera obraz, wyciąga z niego `/site` (`docker create` + `docker cp`) do `releases/<wersja>`, sprawdza obecność `index.html` i `404.html`, atomowo przełącza symlink `current` (`ln -sfn` + `mv -T`) i zostawia 5 ostatnich wydań. Na końcu wypisuje poprzednią wersję.

### 5. Caddy i wolumen (repo `athletic-infra`)

Do `caddy/Caddyfile` dopisz zawartość `Caddyfile.snippet` (nie jest SPA, więc brak fallbacku do `/index.html`; nieistniejące strony dostają `404.html`):

```caddyfile
docs.aisports.pl {
    encode zstd gzip

    root * /srv/docs/current

    @immutable path /_astro/*
    header @immutable Cache-Control "public, max-age=31536000, immutable"

    @pagefind path /pagefind/*
    header @pagefind Cache-Control "public, max-age=3600"

    @html not path /_astro/* /pagefind/*
    header @html Cache-Control "no-cache"

    try_files {path} {path}/index.html
    file_server

    handle_errors {
        rewrite * /404.html
        file_server
    }
}
```

W `compose.yaml` usługi `caddy` dodaj wolumen obok `/opt/athletic-hub:/srv/hub:ro`:

```yaml
volumes:
  - ./caddy/Caddyfile:/etc/caddy/Caddyfile:ro
  - /opt/athletic-hub:/srv/hub:ro
  - /opt/athletic-docs:/srv/docs:ro
```

Zastosuj zmianę kontenera (`docker compose up -d caddy`, bo nowy wolumen wymaga odtworzenia kontenera), a po samej zmianie Caddyfile wystarczy `docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile`. Katalog `current` musi istnieć przed pierwszym żądaniem, więc najpierw zrób krok 6.

Składnia snippetu została sprawdzona przez `caddy validate` (caddy:2) i przetestowana na zbudowanej stronie: 200 dla stron (także bez końcowego `/`), 404 z `404.html` dla nieistniejących, `Cache-Control` zgodny z założeniami.

### 6. Pierwsze wdrożenie

Po pierwszym tagu:

```bash
sudo deploy-docs v0.1.0
curl -fsSI https://docs.aisports.pl/
```

#### Bez release'u (przed pierwszym tagiem)

Zbuduj obraz na VPS ze źródeł i użyj tego samego skryptu z lokalnym obrazem (`IMAGE`). Skrypt nie wywołuje `docker pull` dla obrazów spoza `ghcr.io`.

```bash
git clone https://github.com/Athletic-Intelligence-AGH/docs.git /tmp/docs-src
cd /tmp/docs-src
docker build -t docs:local .
sudo -i   # IMAGE przekazujemy w środowisku roota
IMAGE=docs:local deploy-docs v0.0.1   # nazwa katalogu wydania; nie musi być istniejącym tagiem
curl -fsSI https://docs.aisports.pl/
```

Później, po wydaniu prawdziwego taga, `sudo deploy-docs vX.Y.Z` przełączy stronę na obraz z GHCR (inny katalog w `releases`, ten sam symlink).

### 7. GitHub

W repozytorium nic nie trzeba konfigurować pod deploy: workflow używa wyłącznie `GITHUB_TOKEN` (push do GHCR, tworzenie Release). W Settings → Actions → General upewnij się, że workflowy mogą zapisywać pakiety; workflow deklaruje potrzebne uprawnienia sam. Sekrety `VPS_*` i environment `production` nie są potrzebne, dopóki wdrożenie jest ręczne.

## Rollback

```bash
sudo deploy-docs <poprzednia wersja>      # ponowne wyciągnięcie obrazu
# albo natychmiast, bez obrazu (wydanie nadal leży w releases/):
cd /opt/athletic-docs && sudo ln -sfn releases/<poprzednia wersja> .current.new && sudo mv -T .current.new current
```
