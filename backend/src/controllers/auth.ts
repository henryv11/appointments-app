import { FastifyPluginCallback } from 'fastify';
import {
  authResponse,
  refreshSessionParams,
  RefreshSessionParams,
  userLoginBody,
  UserLoginBody,
  UserRegistrationBody,
  userRegistrationBody,
} from '../schemas';

const tags = ['auth'];

export const authControllers: FastifyPluginCallback = function (app, _, done) {
  app.put<{ Body: UserRegistrationBody }>(
    '/auth',
    {
      schema: {
        description: "User's registration details",
        summary: 'Registration',
        tags,
        body: userRegistrationBody,
        response: {
          201: authResponse,
        },
      },
    },
    (req, res) => (res.status(201), app.services.auth.registerUser(req.body)),
  );

  app.post<{ Body: UserLoginBody }>(
    '/auth',
    {
      schema: {
        description: 'Login an existing user',
        summary: 'Login',
        tags,
        body: userLoginBody,
        response: {
          200: authResponse,
        },
      },
    },
    req => app.services.auth.loginUser(req.body),
  );

  app.delete('/auth', { authorize: true, schema: { description: 'Logout user', summary: 'Logout', tags } }, req =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    app.services.auth.logoutUser({ userId: req.user!.userId }),
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
    req => app.services.session.refreshSession(req.params.sessionToken),
  );

  done();
};
