FROM node:18 AS build

WORKDIR /app

# COPY package*.json ./
COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8080

RUN npm run build

FROM node:18 AS production

WORKDIR /app

# COPY package.json package-lock.json ./

COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start:prod"]