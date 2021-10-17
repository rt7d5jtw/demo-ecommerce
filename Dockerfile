FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
ENV PORT 8080
EXPOSE $PORT
RUN npm run build
