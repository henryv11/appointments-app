import { compare, hash } from 'bcrypt';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { AuthService } from '../@types';

const usersServicePlugin: FastifyPluginCallback = function (app, _, done) {
    const authService: AuthService = {
        async registerUser({ username, password }) {
            const hashedPassword = await hash(password, 10);
            const {
                rows: [user],
            } = await app.usersRepository.createUser({ username, password: hashedPassword }).catch(() => {
                throw app.errors.badRequest();
            });
            return app.signToken(user);
        },

        async loginUser({ username, password }) {
            const {
                rows: [user],
            } = await app.usersRepository.findUserByUsername(username);
            if (!user) throw app.errors.badRequest();
            const isValidPassword = await compare(password, user.password);
            if (!isValidPassword) throw app.errors.badRequest();
            return app.signToken(user);
        },
    };
    app.decorate('authService', authService);
    done();
};

export const usersService = fp(usersServicePlugin);
