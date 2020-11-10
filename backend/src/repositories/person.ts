import { FastifyInstance } from 'fastify';
import { CreatedPerson, CreatePerson, UpdatePerson } from '../types';

export const personRepository = ({ database: { query, firstRow } }: FastifyInstance) => ({
  create: ({ firstName, lastName, email, dateOfBirth, userId }: CreatePerson, _query = query) =>
    _query<CreatedPerson>(
      `insert into person ( first_name, last_name, email, date_of_birth, user_id ) 
        values ( $1, $2, $3, $4, $5 )
        returning id, first_name as "firstName", last_name as "lastName", email as "email",
        date_of_birth as "dateOfBirth" user_id as "userId"`,
      [firstName, lastName, email, dateOfBirth, userId],
    ).then(firstRow),
  update: ({ id, firstName, lastName, email, dateOfBirth }: UpdatePerson, _query = query) =>
    _query<CreatedPerson>(
      `update person
        set first_name = coalesce($2, first_name), last_name = coalesce($3, last_name),
        email = coalesce($4, email), date_of_birth = coalesce($5, date_of_birth)
        WHERE id = $1
        returning id, first_name as "firstName", last_name as "lastName", email as "email",
        date_of_birth as "dateOfBirth", user_id as "userId"`,
      [id, firstName, lastName, email, dateOfBirth],
    ).then(firstRow),
});
