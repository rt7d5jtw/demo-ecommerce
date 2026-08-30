# --------------------------------------------------
# Stage 1: Build the Client
# --------------------------------------------------
FROM node:18-alpine AS client_builder
WORKDIR /build/client

# Necessary for NodeJS 18+ with Webpack 5 / older OpenSSL
ENV NODE_OPTIONS=--openssl-legacy-provider

# Install dependencies first for better Docker layer caching
COPY client/package*.json ./
RUN npm install

# Copy source and build
COPY client/ ./
RUN npm run build

# --------------------------------------------------
# Stage 2: Build the Server
# --------------------------------------------------
FROM node:18-alpine AS server_builder
WORKDIR /build/server

COPY server/package*.json ./
COPY server/tsconfig*.json ./
COPY .env* ./

RUN npm install

COPY server/ ./
RUN npm run build

# --------------------------------------------------
# Stage 3: Development Environment
# --------------------------------------------------
FROM node:18-alpine AS dev
RUN adduser -D appuser
USER appuser
WORKDIR /app

# Copy server files into the container's root working directory
COPY --from=server_builder /build/server/dist ./dist
COPY --from=server_builder /build/server/node_modules ./node_modules
COPY --from=server_builder /build/server/.env* ./
COPY --from=server_builder /build/server/res ./res
COPY --from=server_builder /build/server/tsconfig*.json ./
COPY --from=server_builder /build/server/src ./src
COPY --from=server_builder /build/server/package.json ./

ENV PORT=3000
EXPOSE ${PORT}
ENTRYPOINT ["npm", "run", "start:dev"]

# --------------------------------------------------
# Stage 4: Production Environment
# --------------------------------------------------
FROM node:18-alpine AS prod
RUN adduser -D appuser
USER appuser
WORKDIR /app

# Copy server artifacts
COPY --from=server_builder /build/server/dist ./dist
COPY --from=server_builder /build/server/node_modules ./node_modules
COPY --from=server_builder /build/server/.env* ./
COPY --from=server_builder /build/server/res ./res
COPY --from=server_builder /build/server/package.json ./

# Copy client build artifacts into the path the NestJS API expects to serve from
COPY --from=client_builder /build/client/dist ./client/dist

ENV PORT=3000
EXPOSE ${PORT}
ENTRYPOINT ["npm", "run", "start:prod"]
