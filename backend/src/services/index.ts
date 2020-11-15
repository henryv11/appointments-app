import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { registerServices } from '../lib';
import { AuthService } from './auth';
import { BoardService } from './board';
import { SessionService } from './session';

const getServices = () =>
  Object.freeze({
    auth: new AuthService(),
    board: new BoardService(),
    session: new SessionService(),
  });

const servicesPlugin: FastifyPluginCallback = (app, _, done) => (
  app.register(registerServices, { services: getServices(), name: 'services' }), done()
);

export const services = fp(servicesPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    services: Readonly<ReturnType<typeof getServices>>;
  }
}
