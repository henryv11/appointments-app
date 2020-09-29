# Build the base image
FROM node:lts-alpine as build

ARG ENV=development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --silent

COPY . .

RUN tsc

CMD node dist/index.js
