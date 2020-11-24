import { CreateSession, FilterSession, Session, UpdateSession } from '../schemas';
import { AbstractRepository } from './abstract';

export class SessionRepository extends AbstractRepository {
  /* #region  Public */
  constructor() {
    super({
      table: 'session',
      columns: ['id', 'token', 'user_id', 'started_at', 'ended_at', 'updated_at', 'created_at'],
    });
  }

  findOne = (filter: FilterSession) => this.find(filter).then(this.firstRow);

  findMaybeOne = (filter: FilterSession) => this.find(filter).then(this.maybeFirstRow);

  update = ({ endedAt }: UpdateSession, filter: FilterSession, conn = this.query) =>
    conn<Session>(
      this.sql`UPDATE ${this.table}
              ${this.sql.set('ended_at', endedAt)}
              ${this.where(filter, true)}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);

  create = ({ userId, token }: CreateSession, conn = this.query) =>
    conn<Session>(
      this.sql`INSERT INTO ${this.table} (user_id, token)
                        ${this.sql.values([userId, token])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);
  /* #endregion */

  /* #region  Private */
  private find = (filter: FilterSession) =>
    this.query<Session>(
      this.sql`SELECT ${this.columns}
              FROM ${this.table}
              ${this.where(filter)}
              LIMIT 1`,
    );

  private where({ endedAt, id, userId, token }: FilterSession, throwOnEmpty = false) {
    const where = this.sql.where();
    if (endedAt) where.and`ended_at = ${endedAt}`;
    if (id) where.and`id = ${id}`;
    if (userId) where.and`user_id = ${userId}`;
    if (token) where.and`token = ${token}`;
    if (throwOnEmpty && where.isEmpty) throw this.errors.forbidden();
    return where;
  }
  /* #endregion */
}
