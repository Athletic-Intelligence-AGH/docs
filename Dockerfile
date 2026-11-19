# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

WORKDIR /app

# Zależności osobno, żeby warstwa była cache'owana.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Jak w athletic-hub: obraz to tylko nośnik plików statycznych, serwuje je centralny Caddy.
FROM alpine:3.22

COPY --from=build /app/dist /site

WORKDIR /site
