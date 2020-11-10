import { FastifyInstance } from 'fastify';
import { Channel, CreateChannel } from '../types';

export const channelRepository = ({ database: { query, firstRow } }: FastifyInstance) => ({
  create: ({ boardId, name }: CreateChannel, _query = query) =>
    _query<Channel>(
      `insert into channel ( board_id, name )
        values ( $1, $2 )
        returning id, board_id as "boardId", name, created_at as "createdAt", updated_at as "updatedAt"`,
      [boardId, name],
    ).then(firstRow),
});
