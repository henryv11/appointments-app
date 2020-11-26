import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { BoardRepository } from './board';
import { ChannelRepository } from './channel';
import { MessageRepository } from './message';
import { PersonRepository } from './person';
import { PersonAgreementsRepository } from './person-agreements';
import { SessionRepository } from './session';
import { UserRepository } from './user';
import { UserProfileViewRepository } from './user-profile-view';
import { UserUploadRepository } from './user-upload';

const _repositories = Object.freeze({
  user: new UserRepository(),
  person: new PersonRepository(),
  personAgreements: new PersonAgreementsRepository(),
  session: new SessionRepository(),
  message: new MessageRepository(),
  channel: new ChannelRepository(),
  board: new BoardRepository(),
  userView: new UserProfileViewRepository(),
  userUpload: new UserUploadRepository(),
});

const repositoriesPlugin: FastifyPluginCallback = (app, _, done) => (
  app.registerService('repositories', _repositories), done()
);

export const repositories = fp(repositoriesPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    repositories: typeof _repositories;
  }
}
