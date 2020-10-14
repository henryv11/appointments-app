FROM node:lts-alpine as build


WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --silent

COPY . .

RUN tsc

CMD node dist/index.js
