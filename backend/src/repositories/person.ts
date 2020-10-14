import { FastifyInstance } from 'fastify';
import { CreatedPerson, CreatePerson } from '../@types';

export const personRepository = ({
  database: { query, firstRow },
}: FastifyInstance) => ({
  create: (
    { firstName, lastName, email, dateOfBirth }: CreatePerson,
    queryMethod = query,
  ) =>
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
          date_of_birth as "dateOfBirth",
    `,
      [firstName, lastName, email, dateOfBirth],
    ).then(firstRow),
});
