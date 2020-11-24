import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { User } from '../schemas';

const tags = ['user'];

const userControllersPlugin: FastifyPluginCallback = function (app, _, done) {
  app.get<{ Querystring: any }>(
    '/profile',
    {
      authorize: true,
      schema: {
        description: 'List user profiles',
        summary: 'User profiles',
        tags,
      },
    },
    req => app.repositories.userView.list(req.query),
  );

  app.get<{ Params: { userId: User['id'] } }>(
    '/profile/:userId',
    { authorize: true, schema: { description: 'Get user profile by user id', tags } },
    req => app.repositories.userView.findOne({ userId: req.params.userId }),
  );

  done();
};

export const userControllers = fp(userControllersPlugin);
