# Build stage
FROM node:20.11-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20.11-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 8000
CMD [ "npm", "start" ]