import { CreateSession, FilterSession, Session, UpdateSession } from '../schemas';
import { AbstractRepository } from './abstract';

export class SessionRepository extends AbstractRepository {
  create = ({ userId, token }: CreateSession, conn = this.query) =>
    conn<Session>(
      this.sql`INSERT INTO ${this.table} (user_id, token)
                        ${this.sql.values([userId, token])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);

  findOne = (filter: FilterSession, conn = this.query) =>
    conn<Session>(
      this.sql`SELECT ${this.columns}
              FROM ${this.table}
              ${this.getWhereClause(filter)}
              LIMIT 1`,
    ).then(this.firstRow);

  update = ({ endedAt }: UpdateSession, filter: FilterSession, conn = this.query) =>
    conn<Session>(
      this.sql`UPDATE ${this.table}
              ${this.sql.set('ended_at', endedAt)}
              ${this.getWhereClause(filter, true)}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);

  private getWhereClause({ endedAt, id, userId, token }: FilterSession, throwOnEmpty = false) {
    const where = this.sql.where``;
    if (endedAt) where.and`ended_at = ${endedAt}`;
    if (id) where.and`id = ${id}`;
    if (userId) where.and`user_id = ${userId}`;
    if (token) where.and`token = ${token}`;
    if (throwOnEmpty && where.isEmpty) throw this.errors.forbidden();
    return where;
  }

  private get table() {
    return this.sql`session`;
  }

  private get columns() {
    return this.sql.columns(
      'id',
      'token',
      ['user_id', 'userId'],
      ['started_at', 'startedAt'],
      ['ended_at', 'endedAt'],
      ['updated_at', 'updatedAt'],
      ['created_at', 'createdAt'],
    );
  }
}
