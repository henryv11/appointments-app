import { FastifyInstance } from 'fastify';

export class AbstractService {
  repositories!: FastifyInstance['repositories'];
  database!: FastifyInstance['database'];
  errors!: FastifyInstance['errors'];
  log!: FastifyInstance['log'];
  services!: FastifyInstance['services'];
  jwt!: FastifyInstance['jwt'];

  register({ repositories, database, errors, log, services, jwt }: FastifyInstance) {
    this.repositories = repositories;
    this.database = database;
    this.errors = errors;
    this.log = log.child({ service: this.constructor.name });
    this.services = services;
    this.jwt = jwt;
  }
}
