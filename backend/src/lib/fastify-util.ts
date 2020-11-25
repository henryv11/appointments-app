import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

//#region [Plugin]

const servicesPlugin: FastifyPluginCallback<{
  services: Record<string, FastifyService>;
  name: keyof FastifyInstance;
}> = (app, config, done) => (
  app.decorate(config.name, config.services),
  Object.values(app[config.name] as Record<string, FastifyService>).forEach(service => service.register(app)),
  done()
);

export const registerServices = fp(servicesPlugin);

//#endregion

//#region [Types]

export interface FastifyService {
  register(app: FastifyInstance): void;
}

//#endregion
