import { CreateMessage, message, Message } from '../schemas';
import { AbstractRepository } from './abstract';

export class MessageRepository extends AbstractRepository<typeof message> {
  constructor() {
    super(message);
  }

  create = ({ userId, content }: CreateMessage, conn = this.query) =>
    conn<Message>(
      this.sql`INSERT INTO ${this.table} (user_id, content)
                        ${this.sql.values([userId, content])}
              RETURNING ${this.columns.sql}`,
    ).then(this.firstRow);
}
