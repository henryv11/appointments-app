import { CreateSession, FilterSession, Session, UpdateSession } from '../schemas';
import { AbstractRepository } from './abstract';

const table = 'session';

const columns = {
  id: 'id',
  token: 'token',
  userId: 'user_id',
  startedAt: 'started_at',
  endedAt: 'ended_at',
  updatedAt: 'updated_at',
  createdAt: 'created_at',
} as const;

export class SessionRepository extends AbstractRepository<typeof columns> {
  constructor() {
    super({ table, columns });
  }

  findOne = (filter: FilterSession, conn = this.query) => this.find(filter, conn).then(this.firstRow);

  findMaybeOne = (filter: FilterSession, query = this.query) => this.find(filter, query).then(this.maybeFirstRow);

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

  private find = (filter: FilterSession, query = this.query) =>
    query<Session>(
      this.sql`SELECT ${this.columns.sql}
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
}
