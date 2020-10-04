import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { usersRepository } from './users';

const getRepositories = (app: FastifyInstance) => ({
    users: usersRepository(app),
});

const repositoriesPlugin: FastifyPluginCallback = function (app, _, done) {
    app.decorate('repositories', getRepositories(app));
    done();
};

export const repositories = fp(repositoriesPlugin);

declare module 'fastify' {
    interface FastifyInstance {
        repositories: ReturnType<typeof getRepositories>;
    }
}
