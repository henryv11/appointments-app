import { FastifyPluginCallback } from 'fastify';
import {
  board,
  createBoard,
  CreateBoard,
  filterBoard,
  FilterBoard,
  getBoardParameters,
  GetBoardParameters,
} from '../schemas';

const tags = ['board'];
const path = '/board';

export const boardControllers: FastifyPluginCallback = function (app, _, done) {
  app.post<{ Body: CreateBoard }>(
    path,
    {
      authorize: true,
      schema: {
        description: 'Create new board',
        tags,
        body: createBoard,
        response: {
          201: board,
        },
      },
    },
    (req, res) => (res.status(201), app.services.board.createNewBoard(req.body)),
  );

  app.get<{ Params: GetBoardParameters }>(
    `${path}/:boardId`,
    {
      authorize: true,
      schema: {
        description: 'Get board by id',
        tags,
        params: getBoardParameters,
        response: {
          200: board,
        },
      },
    },
    req => app.repositories.board.findOne({ id: req.params.boardId }),
  );

  app.get<{ Querystring: FilterBoard }>(
    path,
    {
      authorize: true,
      schema: {
        description: 'List boards',
        tags,
        querystring: filterBoard,
      },
    },
    req => app.repositories.board.list(req.query),
  );

  done();
};
