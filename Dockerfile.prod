FROM node:18 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

RUN npm run build

FROM node:18 as production

WORKDIR /app

COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start:prod"]