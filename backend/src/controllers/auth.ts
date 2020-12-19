import { FastifyPluginCallback } from 'fastify';
import {
  loginUser,
  LoginUser,
  refreshSessionParameters,
  RefreshSessionParameters,
  registerUser,
  RegisterUser,
  sessionResponse,
} from '../schemas';

const tags = ['auth'];
const path = '/auth';

export const authControllers: FastifyPluginCallback = function (app, _, done) {
  app.put<{ Body: RegisterUser }>(
    path,
    {
      schema: {
        description: "User's registration details",
        summary: 'Registration',
        tags,
        body: registerUser,
        response: {
          201: sessionResponse,
        },
      },
    },
    (req, res) => (res.status(201), app.services.auth.registerUser(req.body)),
  );

  app.post<{ Body: LoginUser }>(
    path,
    {
      schema: {
        description: 'Login an existing user',
        summary: 'Login',
        tags,
        body: loginUser,
        response: {
          200: sessionResponse,
        },
      },
    },
    req => app.services.auth.loginUser(req.body),
  );

  app.delete(
    path,
    {
      authorize: true,
      schema: {
        description: 'Logout user',
        summary: 'Logout',
        tags,
        response: {
          200: { type: 'string' },
        },
      },
    },
    req =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      app.services.auth.logoutUser({ userId: req.user!.userId }).then(() => 'logged out'),
  );

  app.get<{ Params: RefreshSessionParameters }>(
    `${path}/:sessionToken`,
    {
      schema: {
        description: 'Refresh session token',
        tags,
        params: refreshSessionParameters,
        response: {
          200: sessionResponse,
        },
      },
    },
    req => app.services.session.refreshSession(req.params.sessionToken),
  );

  done();
};
