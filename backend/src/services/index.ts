import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { usersService } from './auth';

const servicesPlugin: FastifyPluginCallback = (app, _, done) => {
    app.register(usersService);
    done();
};

export const services = fp(servicesPlugin);
