import { Channel } from 'grpc';
import { CreateChannel } from '../schemas';
import { AbstractRepository } from './abstract';

export class ChannelRepository extends AbstractRepository {
  create = ({ boardId, name }: CreateChannel, conn = this.query) =>
    conn<Channel>(
      this.sql`INSERT INTO ${this.table} (board_id, name)
                        ${this.sql.values([boardId, name])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);

  private get table() {
    return this.sql`channel`;
  }

  private get columns() {
    return this.sql.columns(
      'id',
      'name',
      ['board_id', 'boardId'],
      ['created_at', 'createdAt'],
      ['updated_at', 'updatedAt'],
    );
  }
}
