import { FastifyInstance } from 'fastify';

export abstract class AbstractService {
  protected repositories!: FastifyInstance['repositories'];
  protected database!: FastifyInstance['database'];
  protected errors!: FastifyInstance['errors'];
  protected log!: FastifyInstance['log'];
  protected services!: FastifyInstance['services'];
  protected jwt!: FastifyInstance['jwt'];

  register({ repositories, database, errors, log, services, jwt }: FastifyInstance) {
    this.repositories = repositories;
    this.database = database;
    this.errors = errors;
    this.services = services;
    this.jwt = jwt;
    this.log = log.child({ service: this.constructor.name });
  }
}
