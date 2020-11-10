import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { BoardRepository } from './board';
import { ChannelRepository } from './channel';
import { MessageRepository } from './message';
import { PersonRepository } from './person';
import { PersonAgreementsRepository } from './person-agreements';
import { SessionRepository } from './session';
import { UserRepository } from './user';

const getRepositories = (app: FastifyInstance) => ({
  user: new UserRepository(app),
  person: new PersonRepository(app),
  personAgreements: new PersonAgreementsRepository(app),
  session: new SessionRepository(app),
  message: new MessageRepository(app),
  channel: new ChannelRepository(app),
  board: new BoardRepository(app),
});

const repositoriesPlugin: FastifyPluginCallback = (app, _, done) => {
  app.decorate('repositories', {});
  Object.entries(getRepositories(app)).forEach(([repositoryName, repository]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.repositories[repositoryName] = repository;
  });
  Object.freeze(app.repositories);
  done();
};

export const repositories = fp(repositoriesPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    repositories: Readonly<ReturnType<typeof getRepositories>>;
  }
}
