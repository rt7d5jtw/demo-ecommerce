# docker build -t chocoapp:1.0 .
FROM node:16.15.1-alpine3.15

WORKDIR /app

COPY . .
COPY [ \
  "package*.json", "tsconfig*.json", \
  ".editorconfig", ".prettierrc", \
  ".eslintrc.js", ".env", "./" \
  ]

# install curl for testing the endpoints
# sed is for extracing jwt token from a file
RUN apk update && apk add curl && apk add sed

# builds the api
RUN npm install
RUN npm run build

# builds the client
RUN npm --prefix ./client install
RUN npm --prefix ./client run build

ENV PORT 3000
EXPOSE $PORT 8080
ENTRYPOINT ["npm", "run", "start:prod"]
