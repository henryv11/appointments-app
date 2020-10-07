import { User } from '@types';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const tags = ['auth'];

const userSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
        username: { type: 'string' },
        password: { type: 'string' },
    },
    description: "User's username and password",
};

const tokenSchema = {
    type: 'string',
    description: 'Valid Json Web Token',
    summary: 'Json Web Token',
    example:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0IiwiaWF0IjoxNjAxODE0Mzc4fQ.Cqo8aBPhJN-hVN9wpAYNnIbLZ8M8ORMAMj_6ZIQTGV_g1hx3dti5Qjelgup2eh2dEnbP3aNmLqHKA7vYrJZjBQ',
};

const badRequestSchema = {
    type: 'string',
    description: 'Login or registration attempt was unsuccessful',
    example: 'Bad Request',
};

const authControllersPlugin: FastifyPluginCallback = function (app, _, done) {
    app.put<{ Body: Pick<User, 'username' | 'password'> }>(
        '/auth',
        {
            schema: {
                description: 'Register a new user',
                summary: 'Registration',
                tags,
                body: userSchema,
                response: { 201: tokenSchema, 400: badRequestSchema },
            },
        },
        async function (req, res) {
            const token = await app.services.auth.registerUser(req.body);
            res.status(201);
            return token;
        },
    ).post<{ Body: Pick<User, 'username' | 'password'> }>(
        '/auth',
        {
            authorize: true,
            schema: {
                description: 'Login an existing user',
                summary: 'Login',
                tags,
                body: userSchema,
                response: { 200: tokenSchema, 400: badRequestSchema },
            },
        },
        ({ body }) => app.services.auth.loginUser(body),
    );
    done();
};

export const authControllers = fp(authControllersPlugin);
