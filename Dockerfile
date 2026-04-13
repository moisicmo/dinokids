FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ARG VITE_HOST_BACKEND=https://api-dinokids.luminia.com.bo
ENV VITE_HOST_BACKEND=$VITE_HOST_BACKEND

RUN yarn build

FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/build ./build

EXPOSE 4203

ENV PORT=4203
ENV NODE_ENV=production

CMD ["yarn", "start"]
