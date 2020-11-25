import { FastifyPluginCallback } from 'fastify';
import { RefreshSessionParams, refreshSessionParams } from '../schemas';

const tags = ['session'];

export const sessionControllers: FastifyPluginCallback = function (app, _, done) {
  app.get<{ Params: RefreshSessionParams }>(
    '/session/:sessionToken/refresh',
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
