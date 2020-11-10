import { FastifyInstance } from 'fastify/types/instance';

export class AbstractRepository {
  query: FastifyInstance['database']['query'];
  firstRow: FastifyInstance['database']['firstRow'];
  allRows: FastifyInstance['database']['allRows'];
  transaction: FastifyInstance['database']['transaction'];
  constructor({ database: { query, firstRow, allRows, transaction } }: FastifyInstance) {
    this.query = query;
    this.firstRow = firstRow;
    this.allRows = allRows;
    this.transaction = transaction;
  }
}

export class AbstractService {
  repositories: FastifyInstance['repositories'];
  database: FastifyInstance['database'];
  errors: FastifyInstance['errors'];
  log: FastifyInstance['log'];
  services: FastifyInstance['services'];
  jwt: FastifyInstance['jwt'];
  constructor({ repositories, database, errors, log, services, jwt }: FastifyInstance) {
    this.repositories = repositories;
    this.database = database;
    this.errors = errors;
    this.log = log;
    this.services = services;
    this.jwt = jwt;
  }
}
