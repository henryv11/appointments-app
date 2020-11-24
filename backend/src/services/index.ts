import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { registerServices } from '../lib';
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

const servicesPlugin: FastifyPluginCallback = (app, _, done) => (
  app.register(registerServices, { services: _services, name: 'services' }), done()
);

export const services = fp(servicesPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    services: typeof _services;
  }
}
