import { CreatedPerson, CreatePerson, UpdatePerson } from '@types';
import { FastifyInstance } from 'fastify';

export const personRepository = ({ database: { query, firstRow } }: FastifyInstance) => ({
  create: ({ firstName, lastName, email, dateOfBirth }: CreatePerson, queryMethod = query) =>
    queryMethod<CreatedPerson>(
      `
        INSERT INTO person (
          first_name,
          last_name,
          email,
          date_of_birth
        ) 
        VALUES (
          $1,
          $2,
          $3, 
          $4
        )
        RETURNING
          id,
          first_name as "firstName",
          last_name as "lastName",
          email as "email",
          date_of_birth as "dateOfBirth"
    `,
      [firstName, lastName, email, dateOfBirth],
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
    `,
      [id, firstName, lastName, email, dateOfBirth],
    ).then(firstRow),
});
