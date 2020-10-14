
FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm ci

EXPOSE 8080

CMD npm run dev

