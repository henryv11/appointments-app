import { AbstractRepository } from '../lib';
import { CreateMessage, Message } from '../types/message';

export class MessageRepository extends AbstractRepository {
  create = ({ userId, content }: CreateMessage, _query = this.query) =>
    _query<Message>(
      `insert into message ( user_id, content )
        values ( $1, $2 )
        returning id, user_id as "userId", content, created_at as "createdAt", updated_at as "updatedAt"`,
      [userId, content],
    ).then(this.firstRow);
}
