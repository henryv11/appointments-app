import { Channel, CreateChannel } from '../schemas';
import { AbstractRepository } from './abstract';

const table = 'channel';

const columns = {
  id: 'id',
  name: 'name',
  boardId: 'board_id',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export class ChannelRepository extends AbstractRepository<typeof columns> {
  constructor() {
    super({ table, columns });
  }

  create = ({ boardId, name }: CreateChannel, conn = this.query) =>
    conn<Channel>(
      this.sql`INSERT INTO ${this.table} (board_id, name)
                        ${this.sql.values([boardId, name])}
              RETURNING ${this.columns.sql}`,
    ).then(this.firstRow);
}
