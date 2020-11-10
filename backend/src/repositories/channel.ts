import { AbstractRepository } from '../lib';
import { Channel, CreateChannel } from '../types';

export class ChannelRepository extends AbstractRepository {
  create = ({ boardId, name }: CreateChannel, _query = this.query) =>
    _query<Channel>(
      `insert into channel ( board_id, name )
        values ( $1, $2 )
        returning id, board_id as "boardId", name,
        created_at as "createdAt", updated_at as "updatedAt"`,
      [boardId, name],
    ).then(this.firstRow);
}