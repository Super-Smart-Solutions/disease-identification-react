FROM node:21-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm instal

COPY . .

RUN npm run build

