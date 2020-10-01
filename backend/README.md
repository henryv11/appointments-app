# Backend for appointments app using NodeJS with fastify and postgres

## Server framework

`fastify` for the server framework

> docs @ <https://www.fastify.io/docs/latest/>

## Database

_Postgres_ for database

> docs @ <https://www.postgresql.org/docs/>

Client driver is `pg`

> docs @ <https://node-postgres.com/>

## Migrations

`node-pg-migrate` for migrations

> docs @ <https://salsita.github.io/node-pg-migrate/#/>

### To create a new migration

```bash
user@host:~/appointments-app/backend$ npm run migrate create <migration name>
```

### To run migrations

Running migrations should be done from the docker container

#### Up

```bash
user@container:~/app$ npm run migrate up
```

Up migrations are also ran automatically on app start

#### Down

```bash
user@container:~/app$ npm run migrate down
```

## Running the application

For **development** run the docker-compose in project root

Requires having _docker_ and _docker-compose_ installed

```bash
user@host:~/appointments-app$ docker-compose up --build --force-recreate --remove-orphans
```
