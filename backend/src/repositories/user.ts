import { FastifyInstance } from 'fastify';
import { CreateUser, Person, PublicUser, User, UserAuth } from '../types';

export const userRepository = ({ database: { query, firstRow } }: FastifyInstance) => ({
  create: ({ username, password }: CreateUser, _query = query) =>
    _query<PublicUser>(
      `insert into app_user ( username, password )
        values ( $1, $2 )
        returning id, username`,
      [username, password],
    ).then(firstRow),
  findByUsername: (username: string, _query = query) =>
    _query<UserAuth>(
      `select id, username, password
        from app_user
        where username = $1
        limit 1`,
      [username],
    ).then(firstRow),
  findByEmail: (email: Person['email'], _query = query) =>
    _query<UserAuth>(
      `select id, username, password
        from app_user
        where id = (select user_id from person where email = $1)
        limit 1`,
      [email],
    ).then(firstRow),
  findById: (id: User['id'], _query = query) =>
    _query<PublicUser>(
      `select id, username
        from app_user
        where id = $1 limit 1`,
      [id],
    ).then(firstRow),
});
