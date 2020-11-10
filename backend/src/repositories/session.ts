import { AbstractRepository } from '../lib';
import { CreateSession, Session, UpdateSession, User } from '../schemas';

export class SessionRepository extends AbstractRepository {
  create = ({ userId, token }: CreateSession, _query = this.query) =>
    _query<Session>(
      `insert into session ( user_id, token )
          values ( $1, $2 )
          returning id, user_id as "userId", token, started_at as "startedAt", ended_at as "endedAt",
          updated_at as "updatedAt", created_at as "createdAt"`,
      [userId, token],
    ).then(this.firstRow);

  findActiveForUser = (userId: User['id'], _query = this.query) =>
    _query<Session>(
      `select id, user_id as "userId", token, started_at as "startedAt", ended_at as "endedAt",
      updated_at as "updatedAt", created_at as "createdAt"
      from session
      where user_id = $1 and ended_at is null
      order by started_at desc
      limit 1`,
      [userId],
    ).then(this.firstRow);

  findSessionByToken = (token: string, _query = this.query) =>
    _query<Session>(
      `select id, user_id as "userId", token, started_at as "startedAt", ended_at as "endedAt",
      updated_at as "updatedAt", created_at as "createdAt"
      from session
      where token = $1
      limit 1`,
      [token],
    ).then(this.firstRow);

  update = (session: UpdateSession, _query = this.query) =>
    _query<Session>(
      `update session
      set ended_at = coalesce($2, ended_at)
      where id = $1
      returning id, user_id as "userId", token, started_at as "startedAt", ended_at as "endedAt",
      updated_at as "updatedAt", created_at as "createdAt"`,
      [session.id, session.endedAt],
    ).then(this.firstRow);

  endAllBelongingToUser = (userId: User['id'], _query = this.query) =>
    _query<Session>(
      `update session
      set ended_at = now()
      where user_id = $1 and ended_at is null
      returning id, user_id as "userId", token, started_at as "startedAt", ended_at as "endedAt",
      updated_at as "updatedAt", created_at as "createdAt"`,
      [userId],
    ).then(this.allRows);
}
