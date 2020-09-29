import Boom from '@hapi/boom';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const errorsPluginCallback: FastifyPluginCallback = function (fastify, _, done) {
    fastify.decorate('errors', Boom);
    done();
};

export const errors = fp(errorsPluginCallback);

interface ErrorsFastifyInstance {
    errors: typeof Boom;
}

declare module 'fastify' {
    interface FastifyInstance extends ErrorsFastifyInstance {}
}
