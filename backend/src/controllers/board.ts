import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { createBoardBody, CreateBoardBody } from '../schemas';

const tags = ['board'];

const boardControllersPlugin: FastifyPluginCallback = function (app, _, done) {
  app.post<{ Body: CreateBoardBody }>(
    '/board',
    {
      authorize: true,
      schema: {
        description: 'Create new board',
        tags,
        body: createBoardBody,
      },
    },
    (req, res) => (res.status(201), app.services.board.createNewBoard(req.body)),
  );
  done();
};

export const boardControllers = fp(boardControllersPlugin);
