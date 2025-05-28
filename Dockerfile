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

# Copy package.json và node_modules nếu cần
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start:prod"]