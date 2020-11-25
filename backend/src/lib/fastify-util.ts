import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
export { registerServices, FastifyService };

/* #region  Plugin */
const servicesPlugin: FastifyPluginCallback<{
  services: Record<string, FastifyService>;
  name: keyof FastifyInstance;
}> = (app, config, done) => (
  app.decorate(config.name, config.services),
  Object.values(app[config.name] as Record<string, FastifyService>).forEach(service => service.register(app)),
  done()
);

const registerServices = fp(servicesPlugin);
/* #endregion */

/* #region  Types */
interface FastifyService {
  register(app: FastifyInstance): void;
}
/* #endregion */
