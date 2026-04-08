FROM node:20-alpine AS builder

ARG VITE_HOST_BACKEND
ENV VITE_HOST_BACKEND=$VITE_HOST_BACKEND

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:20-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /app/build /app/build

EXPOSE 3000

CMD ["yarn", "start"]
