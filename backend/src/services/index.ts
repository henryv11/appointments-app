import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { AuthService } from './auth';
import { BoardService } from './board';
import { SessionService } from './session';

const getServices = (app: FastifyInstance) => ({
  auth: new AuthService(app),
  board: new BoardService(app),
  session: new SessionService(app),
});

const servicesPlugin: FastifyPluginCallback = (app, _, done) => {
  app.decorate('services', {});
  Object.entries(getServices(app)).forEach(([serviceName, service]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.services[serviceName] = service;
  });
  Object.freeze(app.services);
  done();
};

export const services = fp(servicesPlugin);

declare module 'fastify' {
  interface FastifyInstance {
    services: ReturnType<typeof getServices>;
  }
}
