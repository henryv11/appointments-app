import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const genericUserSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
        username: { type: 'string' },
        password: { type: 'string' },
    },
};

const userSchemasPlugin: FastifyPluginCallback = function (fastify, _, done) {
    fastify.addSchema({ $id: 'user', ...genericUserSchema });
    done();
};

export const usersSchemas = fp(userSchemasPlugin);
