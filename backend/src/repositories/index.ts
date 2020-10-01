import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { usersRepository } from './users';

const repositoriesPlugin: FastifyPluginCallback = function (app, _, done) {
    app.register(usersRepository);
    done();
};

export const repositories = fp(repositoriesPlugin);
