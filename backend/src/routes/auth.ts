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

const authRoutesPlugin: FastifyPluginCallback = function (app, _, done) {
    app.put<{ Body: Pick<User, 'username' | 'password'> }>(
        '/auth',
        {
            schema: registrationSchema,
        },
        ({ body }) => app.authService.registerUser(body),
    ).post<{ Body: Pick<User, 'username' | 'password'> }>(
        '/auth',
        {
            schema: loginSchema,
        },
        ({ body }) => app.authService.loginUser(body),
    );
    done();
};

export const authRoutes = fp(authRoutesPlugin);
