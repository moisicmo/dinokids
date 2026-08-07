# ── Etapa 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ARG VITE_HOST_BACKEND=https://api-dinokids.luminia.com.bo
ENV VITE_HOST_BACKEND=$VITE_HOST_BACKEND

RUN yarn build

# ── Etapa 2: Producción con nginx ────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/build/client /usr/share/nginx/html

# BACKEND_HOST (sin esquema, ej. "api-dinokids.luminia.com.bo") se usa en la CSP de
# nginx.conf.template — la imagen oficial de nginx corre envsubst automáticamente sobre
# /etc/nginx/templates/*.template al arrancar el contenedor, usando las env vars reales
# del contenedor (no las de build time). Por eso va como ARG+ENV acá, en esta segunda etapa,
# y no alcanza con haberlo declarado en la etapa de build de arriba.
ARG BACKEND_HOST=""
ENV BACKEND_HOST=$BACKEND_HOST

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 4203

CMD ["nginx", "-g", "daemon off;"]
