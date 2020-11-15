import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import {
  createBoardBody,
  CreateBoardBody,
  getBoardParams,
  GetBoardParams,
  getBoardsQuery,
  GetBoardsQuery,
} from '../schemas';

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

  app.get<{ Params: GetBoardParams }>(
    '/board/:boardId',
    {
      authorize: true,
      schema: { description: 'Get board by id', tags, params: getBoardParams },
    },
    req => app.repositories.board.findOne({ id: req.params.boardId }),
  );

  app.get<{ Querystring: GetBoardsQuery }>(
    '/boards',
    { authorize: true, schema: { description: 'List boards', tags, querystring: getBoardsQuery } },
    req => app.repositories.board.list(req.query),
  );

  done();
};

export const boardControllers = fp(boardControllersPlugin);
