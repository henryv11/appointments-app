import { Static as S, Type as T } from '@sinclair/typebox';
import { bigInt, dateOfBirth, email, firstName, lastName, timestampTz } from './data-types';
import { Keys, ListControl, Partial } from './util';

const id = bigInt;
const userId = bigInt;
const createdAt = timestampTz;
const updatedAt = timestampTz;

export const person = T.Object({
  id,
  userId,
  firstName,
  lastName,
  email,
  dateOfBirth,
  createdAt,
  updatedAt,
});

export type Person = S<typeof person>;

export const createPerson = T.Object({ firstName, lastName, email, dateOfBirth, userId });

export type CreatePerson = S<typeof createPerson>;

export const filterPerson = T.Intersect([
  Partial(person),
  Partial(T.Object({ createdAtLaterThan: createdAt, createdAtBeforeThan: createdAt, userId })),
]);

export type FilterPerson = S<typeof filterPerson>;

export const updatePerson = Partial(T.Object({ firstName, lastName, email, dateOfBirth }));

export type UpdatePerson = S<typeof updatePerson>;

export const listPerson = T.Intersect([filterPerson, ListControl(...Keys(person))]);

export type ListPerson = S<typeof listPerson>;
