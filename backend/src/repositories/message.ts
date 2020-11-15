import { CreateMessage, Message } from '../schemas';
import { AbstractRepository } from './abstract';

export class MessageRepository extends AbstractRepository {
  create = ({ userId, content }: CreateMessage, conn = this.query) =>
    conn<Message>(
      this.sql`insert into ${this.table}
                      ( user_id, content )
              values  (${userId}, ${content})
              returning ${this.columns}`,
    ).then(this.firstRow);

  private get table() {
    return this.sql`message`;
  }

  private get columns() {
    return this.sql`
    id,
    user_id as "userId",
    content,
    created_at as "createdAt",
    updated_at as "updatedAt"
    `;
  }
}
