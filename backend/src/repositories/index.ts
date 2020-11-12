import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { BoardRepository } from './board';
import { ChannelRepository } from './channel';
import { MessageRepository } from './message';
import { PersonRepository } from './person';
import { PersonAgreementsRepository } from './person-agreements';
import { SessionRepository } from './session';
import { UserRepository } from './user';

const getRepositories = () =>
  Object.freeze({
    user: new UserRepository(),
    person: new PersonRepository(),
    personAgreements: new PersonAgreementsRepository(),
    session: new SessionRepository(),
    message: new MessageRepository(),
    channel: new ChannelRepository(),
    board: new BoardRepository(),
  });

const repositoriesPlugin: FastifyPluginCallback = (app, _, done) => (
  app.decorate('repositories', getRepositories()),
  Object.values(app.repositories).forEach(repo => repo.register(app)),
  done()
);

export const repositories = fp(repositoriesPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    repositories: ReturnType<typeof getRepositories>;
  }
}
