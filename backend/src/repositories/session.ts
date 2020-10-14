import { CreatedSession, CreateSession, User } from '@types';
import { FastifyInstance } from 'fastify';

export const sessionRepository = ({ database: { query, firstRow } }: FastifyInstance) => ({
  create: ({ userId, token }: CreateSession, queryMethod = query) =>
    queryMethod<CreatedSession>(
      `
      INSERT INTO session (
        user_id,
        token
      )
      VALUES (
        $1,
        $2
      )
      RETURNING
        id,
        user_id AS "userId",
        token
      `,
      [userId, token],
    ).then(firstRow),
  findActiveForUser: (userId: User['id'], queryMethod = query) =>
    queryMethod<CreatedSession>(
      `
        SELECT
          id,
          user_id AS "userId",
          token
        FROM
          session
        WHERE
          user_id = $1 AND
          ended_at IS NULL
        LIMIT 1
        `,
      [userId],
    ).then(firstRow),
});
