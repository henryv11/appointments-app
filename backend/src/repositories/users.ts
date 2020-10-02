import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { UsersRepository } from '../@types';

const usersRepositoryPlugin: FastifyPluginCallback = function (app, _, done) {
    const usersRepository: UsersRepository = {
        createUser: ({ username, password }) =>
            app.query('INSERT INTO app_user (username, password) VALUES ($1, $2) RETURNING id, username', [
                username,
                password,
            ]),
        findUserByUsername: username =>
            app.query('SELECT id, username, password FROM app_user WHERE username = $1', [username]),
    };
    app.decorate('usersRepository', usersRepository);
    done();
};

export const usersRepository = fp(usersRepositoryPlugin);
