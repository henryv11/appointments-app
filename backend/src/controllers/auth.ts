import { CreateUser } from '@types';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const tags = ['auth'];

const authControllersPlugin: FastifyPluginCallback = function (app, _, done) {
  app
    .put<{ Body: Parameters<typeof app.services.auth.registerUser>[0] }>(
      '/auth',
      {
        schema: {
          description: 'Register a new user',
          summary: 'Registration',
          tags,
          body: {
            type: 'object',
            required: [
              'username',
              'password',
              'firstName',
              'lastName',
              'dateOfBirth',
              'email',
            ],
            properties: {
              username: { type: 'string' },
              password: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              email: { type: 'string' },
              dateOfBirth: { type: 'string' },
              hasAcceptedTermsAndConditions: { type: 'boolean' },
            },
            description: "User's username and password",
          },
        },
      },
      (req, res) => (res.status(201), app.services.auth.registerUser(req.body)),
    )
    .post<{ Body: CreateUser }>(
      '/auth',
      {
        authorize: true,
        schema: {
          description: 'Login an existing user',
          summary: 'Login',
          tags,
          body: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: { type: 'string' },
              password: { type: 'string' },
            },
            description: "User's username and password",
          },
        },
      },
      req => app.services.auth.loginUser(req.body),
    );
  done();
};

export const authControllers = fp(authControllersPlugin);
