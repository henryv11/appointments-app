import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import {
  RefreshSessionParams,
  refreshSessionParams,
  userLoginBody,
  UserLoginBody,
  UserRegistrationBody,
  userRegistrationBody,
} from '../schemas';

const tags = ['auth'];

const authControllersPlugin: FastifyPluginCallback = function (app, _, done) {
  app.put<{ Body: UserRegistrationBody }>(
    '/auth',
    {
      schema: { description: "User's registration details", summary: 'Registration', tags, body: userRegistrationBody },
    },
    async (req, res) => {
      res.status(201);
      const user = await app.services.auth.registerUser(req.body);
      const session = await app.services.auth.getNewOrContinuedSession(user.id);
      return { user, token: app.jwt.sign({ userId: user.id, sessionId: session.id }), refreshToken: session.token };
    },
  );

  app.post<{ Body: UserLoginBody }>(
    '/auth',
    {
      schema: {
        description: 'Login an existing user',
        summary: 'Login',
        tags,
        body: userLoginBody,
      },
    },
    async req => {
      const user = await app.services.auth.loginUser(req.body);
      const session = await app.services.auth.getNewOrContinuedSession(user.id);
      return { user, token: app.jwt.sign({ userId: user.id, sessionId: session.id }), refreshToken: session.token };
    },
  );

  app.delete(
    '/auth',
    { authorize: true, schema: { description: 'Logout user', summary: 'Logout', tags } },
    async req => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await app.services.auth.logoutUser({ userId: req.user!.userId });
      return '';
    },
  );

  app.get<{ Params: RefreshSessionParams }>(
    '/auth/session/:sessionToken/refresh',
    {
      schema: {
        description: 'Refresh session token',
        tags,
        params: refreshSessionParams,
      },
    },
    async req => {
      const session = await app.services.auth.refreshSession(req.params.sessionToken);
      const user = await app.repositories.user.findById(session.userId);
      return { user, token: app.jwt.sign({ sessionId: session.id, userId: user.id }), refreshToken: session.token };
    },
  );

  done();
};

export const authControllers = fp(authControllersPlugin);
