import { Channel, CreateChannel } from '../schemas';
import { AbstractRepository } from './abstract';

export class ChannelRepository extends AbstractRepository {
  //#region [Public]

  constructor() {
    super({ table: 'channel', columns: ['id', 'name', 'board_id', 'created_at', 'updated_at'] });
  }

  create = ({ boardId, name }: CreateChannel, conn = this.query) =>
    conn<Channel>(
      this.sql`INSERT INTO ${this.table} (board_id, name)
                        ${this.sql.values([boardId, name])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);

  //#endregion
}
