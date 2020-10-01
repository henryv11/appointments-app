import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { QueryResult } from 'pg';
import { User } from '../@types';

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

interface UsersRepository {
    createUser: ({
        username,
        password,
    }: Pick<User, 'username' | 'password'>) => Promise<QueryResult<Pick<User, 'id' | 'username'>>>;
    findUserByUsername: (username: string) => Promise<QueryResult<Pick<User, 'username' | 'password' | 'id'>>>;
}

declare module 'fastify' {
    interface FastifyInstance {
        usersRepository: UsersRepository;
    }
}
