import { Static as S, Type as T } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const tags = ['auth'];

const userRegistrationBody = T.Object({
  username: T.String(),
  password: T.String(),
  firstName: T.String(),
  lastName: T.String(),
  email: T.String(),
  dateOfBirth: T.String(),
  hasAcceptedTermsAndConditions: T.Boolean(),
});

const userLoginBody = T.Object({
  username: T.Optional(T.String()),
  password: T.String(),
  email: T.Optional(T.String()),
});

const refreshSessionParams = T.Object({
  sessionToken: T.String({ description: "User's current session's refresh token" }),
});

const authControllersPlugin: FastifyPluginCallback = function (app, _, done) {
  app.put<{ Body: S<typeof userRegistrationBody> }>(
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

  app.post<{ Body: S<typeof userLoginBody> }>(
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

  app.get<{ Params: S<typeof refreshSessionParams> }>(
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
