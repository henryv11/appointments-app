import { Static, Type } from '@sinclair/typebox';
import { dateOfBirth, email, firstName, lastName } from './data-types';
import TypeUtil from './type-util';

const id = TypeUtil.BigInt();
const userId = TypeUtil.BigInt({ column: 'user_id' });
const createdAt = TypeUtil.TimestampTz({ column: 'created_at' });
const updatedAt = TypeUtil.TimestampTz({ column: 'updated_at' });

export const person = TypeUtil.Table('person', {
  id,
  userId,
  firstName,
  lastName,
  email,
  dateOfBirth,
  createdAt,
  updatedAt,
});

export type Person = Static<typeof person>;

export const createPerson = Type.Object({ firstName, lastName, email, dateOfBirth, userId });

export type CreatePerson = Static<typeof createPerson>;

export const filterPerson = Type.Intersect([
  TypeUtil.Partial(person),
  TypeUtil.Partial(Type.Object({ createdAtLaterThan: createdAt, createdAtBeforeThan: createdAt, userId })),
]);

export type FilterPerson = Static<typeof filterPerson>;

export const updatePerson = TypeUtil.Partial(Type.Object({ firstName, lastName, email, dateOfBirth }));

export type UpdatePerson = Static<typeof updatePerson>;

export const listPerson = Type.Intersect([filterPerson, TypeUtil.ListControl(...TypeUtil.Keys(person))]);

export type ListPerson = Static<typeof listPerson>;
