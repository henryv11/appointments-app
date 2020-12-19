import { FastifyPluginCallback } from 'fastify';
import {
  getUserProfileViewParameters,
  GetUserProfileViewParameters,
  listUserProfileView,
  ListUserProfileView,
} from '../schemas';

const tags = ['user'];
const path = '/user/profile';

export const userControllers: FastifyPluginCallback = function (app, _, done) {
  app.get<{ Querystring: ListUserProfileView }>(
    path,
    {
      authorize: true,
      schema: {
        description: 'List user profiles',
        summary: 'User profiles',
        tags,
        querystring: listUserProfileView,
      },
    },
    req => app.repositories.userView.list(req.query),
  );

  app.get<{ Params: GetUserProfileViewParameters }>(
    `${path}/:userId`,
    {
      authorize: true,
      schema: {
        description: 'Get user profile by user id',
        tags,
        params: getUserProfileViewParameters,
      },
    },
    req => app.repositories.userView.findOne({ userId: req.params.userId }),
  );

  done();
};
