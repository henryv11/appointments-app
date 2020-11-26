import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { AuthService } from './auth';
import { BoardService } from './board';
import { SessionService } from './session';
import { UploadService } from './upload';

const _services = Object.freeze({
  auth: new AuthService(),
  board: new BoardService(),
  session: new SessionService(),
  upload: new UploadService(),
});

const servicesPlugin: FastifyPluginCallback = (app, _, done) => (app.registerService('services', _services), done());

export const services = fp(servicesPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    services: typeof _services;
  }
}
