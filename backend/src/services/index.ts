import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { authService } from './auth';

const getServices = (app: FastifyInstance) => ({
    auth: authService(app),
});

const servicesPlugin: FastifyPluginCallback = function (app, _, done) {
    app.decorate('services', getServices(app));
    done();
};

export const services = fp(servicesPlugin);

declare module 'fastify' {
    interface FastifyInstance {
        services: ReturnType<typeof getServices>;
    }
}
