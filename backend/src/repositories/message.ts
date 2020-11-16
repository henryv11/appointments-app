import { CreateMessage, Message } from '../schemas';
import { AbstractRepository } from './abstract';

export class MessageRepository extends AbstractRepository {
  create = ({ userId, content }: CreateMessage, conn = this.query) =>
    conn<Message>(
      this.sql`INSERT INTO ${this.table} (user_id, content)
                        ${this.sql.values([userId, content])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);

  private get table() {
    return this.sql`message`;
  }

  private get columns() {
    return this.sql.columns(
      'id',
      'content',
      ['user_id', 'userId'],
      ['created_at', 'createdAt'],
      ['updated_at', 'updatedAt'],
    );
  }
}
