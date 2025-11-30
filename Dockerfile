FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY .env ./

RUN npm install
COPY . .

# support for legacy OpenSSL algorithms (NECESSARY FOR NodeJS +18)
ENV NODE_OPTIONS=--openssl-legacy-provider

# build the api
RUN npm run build

# build the client
RUN set -x && \
    npm --prefix ./client install && \
    npm --prefix ./client run build
# --------------------------------------------------
FROM builder AS client_builder

# Build the client (only runs when this stage is explicitly targeted)
# NOTE: This will fail if the client directory is not present!
RUN set -x && \
    npm --prefix ./client install && \
    npm --prefix ./client run build

# --------------------------------------------------
FROM node:18-alpine as dev
RUN adduser -D appuser
USER appuser

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/res ./res
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/src ./src
COPY package.json ./

ENV PORT 3000
EXPOSE ${PORT}
ENTRYPOINT ["npm", "run", "start:dev"]

# --------------------------------------------------
FROM node:18-alpine as prod
RUN adduser -D appuser
USER appuser

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/res ./res
COPY package.json ./

COPY --from=client_builder /app/client/dist ./client/dist

ENV PORT 3000
EXPOSE ${PORT}

ENTRYPOINT ["npm", "run", "start:prod"]
