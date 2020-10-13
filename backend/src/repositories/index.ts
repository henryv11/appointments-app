import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { personRepository } from './person';
import { personAgreementsRepository } from './person-agreements';
import { userRepository } from './user';

const getRepositories = (app: FastifyInstance) => ({
  user: userRepository(app),
  person: personRepository(app),
  personAgreements: personAgreementsRepository(app),
});

const repositoriesPlugin: FastifyPluginCallback = function (app, _, done) {
  app.decorate('repositories', getRepositories(app));
  done();
};

export const repositories = fp(repositoriesPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    repositories: ReturnType<typeof getRepositories>;
  }
}
