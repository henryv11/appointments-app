import { Static, Type } from '@sinclair/typebox';
import { bigInt, email, password, sessionToken, username } from './data-types';
import TypeUtil from './type-util';

const id = bigInt;
const createdAt = TypeUtil.TimestampTz({ column: 'created_at' });
const updatedAt = TypeUtil.TimestampTz({ column: 'updated_at' });

export const user = TypeUtil.Table('app_user', {
  id,
  username,
  password,
  createdAt,
  updatedAt,
});

export type User = Static<typeof user>;

export const publicUser = Type.Object({ id, username, createdAt, updatedAt });

export type PublicUser = Static<typeof publicUser>;

export const createUser = Type.Object({ username, password });

export type CreateUser = Static<typeof createUser>;

export const filterUser = Type.Intersect([
  TypeUtil.Partial(user),
  TypeUtil.Partial(Type.Object({ email, sessionToken })),
]);

export type FilterUser = Static<typeof filterUser>;
