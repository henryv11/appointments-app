import { compare, hash } from 'bcrypt';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { User } from '../../@types';
import { usersRepository } from './repository';
import { usersSchemas } from './schemas';

const usersServicePlugin: FastifyPluginCallback = function (fastify, _, done) {
    fastify
        .register(usersSchemas)
        .register(usersRepository)
        .put<{ Body: Pick<User, 'username' | 'password'> }>(
            '/auth',
            { schema: { body: { $ref: 'user#' } } },
            async function ({ body: { username, password } }) {
                const hashedPassword = await hash(password, 10);
                const {
                    rows: [user],
                } = await fastify.usersRepository.createUser({ username, password: hashedPassword });
                return fastify.signToken(user);
            },
        )
        .post<{ Body: Pick<User, 'username' | 'password'> }>(
            '/auth',
            { schema: { body: { $ref: 'user#' } } },
            async function ({ body: { username, password } }) {
                const {
                    rows: [user],
                } = await fastify.usersRepository.findUserByUsername(username);
                if (!user) return;
                const isValidPassword = await compare(password, user.password);
                if (!isValidPassword) return;
                return fastify.signToken(user);
            },
        );
    done();
};

export const userService = fp(usersServicePlugin);
