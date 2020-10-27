import { FastifyInstance } from 'fastify';
import { CreateUser, Person, PublicUser, User, UserAuth } from 'types';

export const userRepository = ({ database: { query, firstRow } }: FastifyInstance) => ({
  create: ({ username, password, personId }: CreateUser, queryMethod = query) =>
    queryMethod<PublicUser>(
      `
INSERT INTO app_user (
  username,
  password,
  person_id
)
VALUES (
  $1,
  $2,
  $3
)
RETURNING
  id,
  username
`,
      [username, password, personId],
    ).then(firstRow),
  findByUsername: (username: string, queryMethod = query) =>
    queryMethod<UserAuth>(
      `
SELECT
  id,
  username,
  password
FROM
  app_user
WHERE
  username = $1
LIMIT 1
`,
      [username],
    ).then(firstRow),
  findByEmail: (email: Person['email'], queryMethod = query) =>
    queryMethod<UserAuth>(
      `
WITH person_by_email AS (
  SELECT id FROM person WHERE email = $1
)
SELECT
  id,
  username,
  password
FROM
  app_user
WHERE
  person_id IN (SELECT id FROM person_by_email)
LIMIT 1
`,
      [email],
    ).then(firstRow),
  findById: (id: User['id'], queryMethod = query) =>
    queryMethod<PublicUser>(
      `
SELECT
  id,
  username
FROM
  app_user
WHERE
  id = $1
LIMIT 1
`,
      [id],
    ).then(firstRow),
});
