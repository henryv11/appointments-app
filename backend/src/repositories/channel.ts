import { channel, Channel, CreateChannel } from '../schemas';
import { AbstractRepository } from './abstract';

export class ChannelRepository extends AbstractRepository<typeof channel> {
  constructor() {
    super(channel);
  }

  create = ({ boardId, name }: CreateChannel, conn = this.query) =>
    conn<Channel>(
      this.sql`INSERT INTO ${this.table} (board_id, name)
                        ${this.sql.values([boardId, name])}
              RETURNING ${this.columns.sql}`,
    ).then(this.firstRow);
}
