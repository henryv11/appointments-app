
FROM node:15-alpine

# libc6-compat for uwebsocjet.js, grpc
# postgresql-dev for pg-native
# git, python, make, g++ for building
RUN set -x \
    && apk update \
    && apk add --no-cache --update bash git openssh libc6-compat python make g++ postgresql-dev \
    && ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2 \
    && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY . .

RUN npm ci

EXPOSE 8080

CMD npm run dev

