.DEFAULT_GOAL := help
.PHONY: help install dev build check lint preview docker-build docker-dev docker-down

export DEV_UID := $(shell id -u)
export DEV_GID := $(shell id -g)

DEV_COMPOSE := docker compose -f deploy/compose.dev.yaml

help:
	@printf '%s\n' \
	  'Athletic Intelligence Docs' \
	  '  help         Show available commands' \
	  '  install      Install dependencies (npm ci)' \
	  '  dev          Run the dev server on http://localhost:4321 (without Docker)' \
	  '  build        Build the site into dist/' \
	  '  check        Run astro check' \
	  '  lint         Run ESLint and Prettier' \
	  '  preview      Serve the built dist/ locally' \
	  '  docker-build Build the release image locally as docs:local (static files in /site)' \
	  '  docker-dev   Run the dev server in Docker with HMR on http://localhost:4321' \
	  '  docker-down  Stop the Docker dev server and remove its containers'

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

check:
	npm run check

lint:
	npm run lint

preview:
	npm run preview

docker-build:
	docker build -t docs:local .

docker-dev:
	$(DEV_COMPOSE) up

docker-down:
	$(DEV_COMPOSE) down
