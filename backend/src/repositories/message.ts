import { CreateMessage, Message } from '../schemas';
import { AbstractRepository } from './abstract';

const table = 'message';

const columns = {
  id: 'id',
  content: 'content',
  userId: 'user_id',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export class MessageRepository extends AbstractRepository<typeof columns> {
  constructor() {
    super({ table, columns });
  }

  create = ({ userId, content }: CreateMessage, conn = this.query) =>
    conn<Message>(
      this.sql`INSERT INTO ${this.table} (user_id, content)
                        ${this.sql.values([userId, content])}
              RETURNING ${this.columns.sql}`,
    ).then(this.firstRow);
}
