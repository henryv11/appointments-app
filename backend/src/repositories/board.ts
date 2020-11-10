import { FastifyInstance } from 'fastify';
import { Board, CreateBoard } from '../types';

export const boardRepository = ({ database: { query, firstRow } }: FastifyInstance) => ({
  create: ({ name }: CreateBoard, _query = query) =>
    _query<Board>(
      `insert into board ( name )
        values ( $1 )
        returning id, name, created_at as "createdAt", updated_at as "updatedAt"`,
      [name],
    ).then(firstRow),
});
