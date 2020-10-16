import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { personRepository } from './person';
import { personAgreementsRepository } from './person-agreements';
import { sessionRepository } from './session';
import { userRepository } from './user';

const getRepositories = (app: FastifyInstance) => ({
  user: userRepository(app),
  person: personRepository(app),
  personAgreements: personAgreementsRepository(app),
  session: sessionRepository(app),
});

const repositoriesPlugin: FastifyPluginCallback = (app, _, done) => (
  app.decorate('repositories', getRepositories(app)), done()
);

export const repositories = fp(repositoriesPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    repositories: ReturnType<typeof getRepositories>;
  }
}