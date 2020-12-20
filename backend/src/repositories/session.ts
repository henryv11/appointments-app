import { CreateSession, FilterSession, session, Session, UpdateSession } from '../schemas';
import { AbstractRepository } from './abstract';

export class SessionRepository extends AbstractRepository<typeof session> {
  constructor() {
    super(session);
  }

  findOne = (filter: FilterSession, conn = this.query) =>
    conn<Session>(this.sql`${this.select(filter)} LIMIT 1`).then(this.firstRow);

  findMaybeOne = (filter: FilterSession, conn = this.query) =>
    conn<Session>(this.sql`${this.select(filter)} LIMIT 1`).then(this.maybeFirstRow);

  update = ({ endedAt }: UpdateSession, filter: FilterSession, query = this.query) =>
    query<Session>(
      this.sql`UPDATE ${this.table}
              ${this.sql.set('ended_at', endedAt)}
              ${this.where(filter, true)}
              RETURNING ${this.columns.sql}`,
    ).then(this.firstRow);

  create = ({ userId, token }: CreateSession, conn = this.query) =>
    conn<Session>(
      this.sql`INSERT INTO ${this.table} (user_id, token)
                        ${this.sql.values([userId, token])}
              RETURNING ${this.columns.sql}`,
    ).then(this.firstRow);

  private select = (filter: FilterSession) =>
    this.sql`SELECT ${this.columns.sql} FROM ${this.table} ${this.where(filter)}`;

  private where({ endedAt, id, userId, token }: FilterSession, throwOnEmpty = false) {
    const where = this.sql.where();
    if (endedAt) where.and`ended_at = ${endedAt}`;
    if (id) where.and`id = ${id}`;
    if (userId) where.and`user_id = ${userId}`;
    if (token) where.and`token = ${token}`;
    if (throwOnEmpty && where.isEmpty) throw this.errors.forbidden();
    return where;
  }
}
