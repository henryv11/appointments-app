import { Channel } from 'grpc';
import { CreateChannel } from '../schemas';
import { AbstractRepository } from './abstract';

export class ChannelRepository extends AbstractRepository {
  create = ({ boardId, name }: CreateChannel, conn = this.query) =>
    conn<Channel>(
      this.sql`insert into ${this.table}
                      (board_id, name)
              values  (${boardId}, ${name})
              returning ${this.columns}`,
    ).then(this.firstRow);

  private get table() {
    return this.sql`channel`;
  }

  private get columns() {
    return this.sql`
    id,
    board_id as "boardId",
    name,
    created_at as "createdAt",
    updated_at as "updatedAt"
    `;
  }
}
