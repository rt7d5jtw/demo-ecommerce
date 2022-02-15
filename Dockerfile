FROM node:16-alpine
WORKDIR /app

COPY . .
COPY ["package*.json", "tsconfig*.json", "tools.js", ".editorconfig", ".prettierrc", ".eslintrc.js", ".env", "./"]
#COPY package*.json ./
#COPY tsconfig*.json ./
#COPY tools.js ./
#COPY .editorconfig ./
#COPY .prettierrc ./
#COPY .eslintrc.js ./
#COPY .env ./

# builds the api
RUN node -v
RUN npm install
RUN npm run build

# builds the client
RUN npm --prefix ./client install
RUN npm --prefix ./client run build

ENV PORT 3000
EXPOSE $PORT
ENTRYPOINT ["npm", "run", "start:prod"]
