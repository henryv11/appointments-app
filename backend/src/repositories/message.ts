import { CreateMessage, Message } from '../schemas';
import { AbstractRepository } from './abstract';

export class MessageRepository extends AbstractRepository {
  /* #region  Public */
  constructor() {
    super({ table: 'message', columns: ['id', 'content', 'user_id', 'created_at', 'updated_at'] });
  }

  create = ({ userId, content }: CreateMessage, conn = this.query) =>
    conn<Message>(
      this.sql`INSERT INTO ${this.table} (user_id, content)
                        ${this.sql.values([userId, content])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);
  /* #endregion */
}
