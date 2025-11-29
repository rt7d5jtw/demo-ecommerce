# docker build -t ecommerce-demo:1.0 .
FROM node:16.15.1-alpine3.15

# Optional argument for PORT to bind to
ARG OPT_PORT

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

# Default port
ENV PORT 3000
EXPOSE $PORT ${OPT_PORT}

ENTRYPOINT ["npm", "run", "start:prod"]
