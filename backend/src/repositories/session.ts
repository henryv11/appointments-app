import { CreateSession, FilterSession, Session, UpdateSession } from '../schemas';
import { AbstractRepository } from './abstract';

export class SessionRepository extends AbstractRepository {
  create = ({ userId, token }: CreateSession, conn = this.query) =>
    conn<Session>(
      this.sql`insert into ${this.table}
                        (user_id, token)
              values    (${userId}, ${token})
              returning  ${this.columns}`,
    ).then(this.firstRow);

  findOne = (filter: FilterSession, conn = this.query) =>
    conn<Session>(
      this.sql`select ${this.columns}
             from ${this.table}
             ${this.getWhereClause(filter)}
             limit 1`,
    ).then(this.firstRow);

  update({ endedAt }: UpdateSession, filter: FilterSession, conn = this.query) {
    const where = this.getWhereClause(filter);
    if (where.isEmpty) throw new Error('updating session without filters is not allowed');
    return conn<Session>(
      this.sql`update ${this.table}
              ${this.sql.set('ended_at', endedAt)}
              ${where}
              returning ${this.columns}`,
    ).then(this.firstRow);
  }

  private getWhereClause({ endedAt, id, userId, token }: FilterSession) {
    const where = this.sql.where``;
    if (endedAt) where.and`ended_at = ${endedAt}`;
    if (id) where.and`id = ${id}`;
    if (userId) where.and`user_id = ${userId}`;
    if (token) where.and`token = ${token}`;
    return where;
  }

  private get table() {
    return this.sql`session`;
  }

  private get columns() {
    return this.sql`
      id,
      user_id as "userId",
      token,
      started_at as "startedAt",
      ended_at as "endedAt",
      updated_at as "updatedAt",
      created_at as "createdAt"
    `;
  }
}
