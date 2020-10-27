import { FastifyInstance } from 'fastify';
import { CreatedSession, CreateSession, Session, UpdateSession, User } from '../types';

export const sessionRepository = ({ database: { query, firstRow, allRows } }: FastifyInstance) => ({
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
    queryMethod<Session>(
      `
SELECT
  id,
  user_id AS "userId",
  token,
  started_at AS "startedAt",
  ended_at AS "endedAt",
  updated_at AS "updatedAt",
  created_at AS "createdAt"
FROM
  session
WHERE
  user_id = $1 AND
  ended_at IS NULL
ORDER BY started_at DESC
LIMIT 1
`,
      [userId],
    ).then(firstRow),
  findSessionByToken: (token: string, queryMethod = query) =>
    queryMethod<Session>(
      `
SELECT
  id,
  user_id AS "userId",
  token,
  started_at AS "startedAt",
  ended_at AS "endedAt",
  updated_at AS "updatedAt",
  created_at AS "createdAt"
FROM
  session
WHERE
  token = $1
LIMIT 1
`,
      [token],
    ).then(firstRow),
  update: (session: UpdateSession, queryMethod = query) =>
    queryMethod<Session>(
      `
UPDATE session
SET
  ended_at = COALESCE($2, ended_at)
WHERE
  id = $1
RETURNING
  id,
  user_id AS "userId",
  token,
  started_at AS "startedAt",
  ended_at AS "endedAt",
  updated_at AS "updatedAt",
  created_at AS "createdAt"
`,
      [session.id, session.endedAt],
    ).then(firstRow),
  endAllBelongingToUser: (userId: User['id'], queryMethod = query) =>
    queryMethod<Session>(
      `
UPDATE session
SET
    ended_at = NOW()
WHERE
  user_id = $1 AND
  ended_at IS NULL
RETURNING
  id,
  user_id AS "userId",
  token,
  started_at AS "startedAt",
  ended_at AS "endedAt",
  updated_at AS "updatedAt",
  created_at AS "createdAt"
`,
      [userId],
    ).then(allRows),
});
