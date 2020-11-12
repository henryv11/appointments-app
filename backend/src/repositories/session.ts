import { CreateSession, Session } from '../schemas';
import { AbstractRepository } from './abstract';

export class SessionRepository extends AbstractRepository {
  create = ({ userId, token }: CreateSession, conn = this.query) =>
    conn<Session>(
      `insert into session ( user_id, token )
          values ( $1, $2 )
          returning id, user_id as "userId", token, started_at as "startedAt", ended_at as "endedAt",
          updated_at as "updatedAt", created_at as "createdAt"`,
      [userId, token],
    ).then(this.firstRow);

  findOne(filter: Partial<Pick<Session, 'id' | 'userId' | 'endedAt' | 'token'>>, conn = this.query) {
    const { where, params } = this.buildFilters(filter);
    return conn<Session>(
      this.ordinal(
        `select id, user_id as "userId", token, started_at as "startedAt", ended_at as "endedAt",
          updated_at as "updatedAt", created_at as "createdAt"
          from session ${where} limit 1`,
      ),
      params,
    ).then(this.firstRow);
  }

  update(
    update: Pick<Session, 'endedAt'>,
    filter: Partial<Pick<Session, 'id' | 'userId' | 'endedAt'>>,
    conn = this.query,
  ) {
    const { where, params } = this.buildFilters(filter);
    if (!where) throw new Error('updating session without filters is not allowed');
    return conn<Session>(
      this.ordinal(
        `update session
          set ended_at = coalesce(?, ended_at) ${where}
          returning id, user_id as "userId", token, started_at as "startedAt", ended_at as "endedAt",
          updated_at as "updatedAt", created_at as "createdAt"`,
      ),
      [update.endedAt, ...params],
    ).then(this.firstRow);
  }

  private buildFilters(filter: Partial<Pick<Session, 'id' | 'userId' | 'endedAt' | 'token'>>) {
    const where: string[] = [];
    const params: (string | number | null | Date)[] = [];
    if (filter.id) where.push('id = ?'), params.push(filter.id);
    if (filter.userId) where.push('user_id = ?'), params.push(filter.userId);
    if (filter.endedAt !== undefined) where.push('ended_at = ?'), params.push(filter.endedAt);
    if (filter.token) where.push('token = ?'), params.push(filter.token);
    return { where: where.length ? 'where ' + where.join(' and ') : '', params };
  }
}
