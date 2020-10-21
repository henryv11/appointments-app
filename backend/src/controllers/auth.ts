import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const tags = ['auth'];

const authControllersPlugin: FastifyPluginCallback = function (app, _, done) {
  app.put<{ Body: Parameters<typeof app.services.auth.registerUser>[0] }>(
    '/auth',
    {
      schema: {
        description: 'Register a new user',
        summary: 'Registration',
        tags,
        body: {
          type: 'object',
          description: "User's registration details",
          required: [
            'username',
            'password',
            'firstName',
            'lastName',
            'dateOfBirth',
            'email',
            'hasAcceptedTermsAndConditions',
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
        },
      },
    },
    async (req, res) => {
      res.status(201);
      console.log('incoming user registration request');
      const user = await app.services.auth.registerUser(req.body);
      console.log({ user });
      const { session, token } = await app.services.auth.getSession({ tokenPayload: user });
      console.log({ session, token });
      return { user, token, refreshToken: session.token };
    },
  );

  app.post<{ Body: Parameters<typeof app.services.auth.loginUser>[0] }>(
    '/auth',
    {
      schema: {
        description: 'Login an existing user',
        summary: 'Login',
        tags,
        body: {
          type: 'object',
          description: "User's login details",
          required: ['password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
    async req => {
      const user = await app.services.auth.loginUser(req.body);
      const { session, token } = await app.services.auth.getSession({ tokenPayload: user });
      return { user, token, refreshToken: session.token };
    },
  );

  app.delete(
    '/auth',
    { authorize: true, schema: { description: 'Logout user', summary: 'Logout', tags } },
    async req => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await app.services.auth.logoutUser({ userId: req.user!.id });
      return '';
    },
  );

  app.get<{ Params: { sessionToken: string } }>(
    '/auth/session/:sessionToken/refresh',
    {
      schema: {
        description: 'Refresh session token',
        summary: '',
        tags,
        params: {
          type: 'object',
          description: "User's current session's refresh token",
          required: ['sessionToken'],
          properties: {
            sessionToken: { type: 'string' },
          },
        },
      },
    },
    async req => {
      const { session, token } = await app.services.auth.refreshSession(req.params.sessionToken);
      const user = await app.repositories.user.findById(session.userId);
      return { user, token, refreshToken: session.token };
    },
  );

  done();
};

export const authControllers = fp(authControllersPlugin);
