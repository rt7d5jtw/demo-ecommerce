FROM node:16-alpine
WORKDIR /app

# copies necessary files to work directory
COPY . .
COPY ["package*.json", "tsconfig*.json", "tools.js", ".editorconfig", ".prettierrc", ".eslintrc.js", ".env", "./"]

# install curl for testing the endpoints
# sed is for extracing jwt token from a file
RUN apk update && apk add curl && apk add sed

# builds the api
RUN node -v
RUN npm install
RUN npm run build

# builds the client
# RUN npm --prefix ./client install
# RUN npm --prefix ./client run build

ENV PORT 3000
EXPOSE $PORT
ENTRYPOINT ["npm", "run", "start:prod"]
