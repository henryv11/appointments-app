import { FastifyInstance } from 'fastify';
import { CreatedPerson, CreatePerson, UpdatePerson } from '../types';

export const personRepository = ({ database: { query, firstRow } }: FastifyInstance) => ({
  create: ({ firstName, lastName, email, dateOfBirth, userId }: CreatePerson, queryMethod = query) =>
    queryMethod<CreatedPerson>(
      `
INSERT INTO person (
  first_name,
  last_name,
  email,
  date_of_birth,
  user_id
) 
VALUES (
  $1,
  $2,
  $3, 
  $4,
  $5
)
RETURNING
  id,
  first_name as "firstName",
  last_name as "lastName",
  email as "email",
  date_of_birth as "dateOfBirth",
  user_id as "userId"
`,
      [firstName, lastName, email, dateOfBirth, userId],
    ).then(firstRow),
  update: ({ id, firstName, lastName, email, dateOfBirth }: UpdatePerson, queryMethod = query) =>
    queryMethod<CreatedPerson>(
      `
UPDATE person
SET
  first_name = COALESCE($2, first_name),
  last_name = COALESCE($3, last_name),
  email = COALESCE($4, email),
  date_of_birth = COALESCE($5, date_of_birth)
WHERE
  id = $1
RETURNING
  id,
  first_name as "firstName",
  last_name as "lastName",
  email as "email",
  date_of_birth as "dateOfBirth",
  user_id as "userId"
`,
      [id, firstName, lastName, email, dateOfBirth],
    ).then(firstRow),
});
