
FROM node:15-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm ci

EXPOSE 4000

CMD npm run start

