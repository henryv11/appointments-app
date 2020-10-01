import { compare, hash } from 'bcrypt';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { User } from '../@types';

const tags = ['auth'];

const userSchema = {
    description: "user's username and password",
    type: 'object',
    required: ['username', 'password'],
    properties: {
        username: { type: 'string' },
        password: { type: 'string' },
    },
};

const tokenSchema = { type: 'string', description: 'hello', summary: 'hello', example: 'fidget' };

const baseSchema = {
    tags,
    body: userSchema,
    response: { 200: tokenSchema },
};

const registrationSchema = {
    description: 'Register a new user',
    summary: 'Registration',
    ...baseSchema,
};

const loginSchema = {
    description: 'Login an existing user',
    summary: 'Login',
    ...baseSchema,
};

const usersServicePlugin: FastifyPluginCallback = function (app, _, done) {
    app.put<{ Body: Pick<User, 'username' | 'password'> }>(
        '/auth',
        {
            schema: registrationSchema,
        },
        async function ({ body: { username, password } }) {
            const hashedPassword = await hash(password, 10);
            const {
                rows: [user],
            } = await app.usersRepository.createUser({ username, password: hashedPassword }).catch(() => {
                throw app.errors.badRequest();
            });
            return app.signToken(user);
        },
    ).post<{ Body: Pick<User, 'username' | 'password'> }>(
        '/auth',
        {
            schema: loginSchema,
        },
        async function ({ body: { username, password } }) {
            const {
                rows: [user],
            } = await app.usersRepository.findUserByUsername(username);
            if (!user) throw app.errors.badRequest();
            const isValidPassword = await compare(password, user.password);
            if (!isValidPassword) throw app.errors.badRequest();
            return app.signToken(user);
        },
    );
    done();
};

export const usersService = fp(usersServicePlugin);
