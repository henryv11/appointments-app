import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { authRoutes } from './auth';

const routesPlugin: FastifyPluginCallback = function (app, _, done) {
    app.register(authRoutes);
    done();
};

export const routes = fp(routesPlugin);
