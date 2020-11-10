import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { authService } from './auth';
import { boardService } from './board';
import { sessionService } from './session';

const servicesPlugin: FastifyPluginCallback = (app, _, done) => (
  app.decorate('services', {
    auth: authService(app),
    board: boardService(app),
    session: sessionService(app),
  }),
  done()
);

export const services = fp(servicesPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    services: {
      auth: ReturnType<typeof authService>;
      board: ReturnType<typeof boardService>;
      session: ReturnType<typeof sessionService>;
    };
  }
}
