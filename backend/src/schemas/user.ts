import { Static as S, Type as T } from '@sinclair/typebox';
import { bigInt, email, password, sessionToken, timestampTz, username } from './data-types';
import { Partial } from './util';

const id = bigInt;
const createdAt = timestampTz;
const updatedAt = timestampTz;

export const user = T.Object({
  id,
  username,
  password,
  createdAt,
  updatedAt,
});

export type User = S<typeof user>;

export const publicUser = T.Object({ id, username, createdAt, updatedAt });

export type PublicUser = S<typeof publicUser>;

export const createUser = T.Object({ username, password });

export type CreateUser = S<typeof createUser>;

export const filterUser = T.Intersect([Partial(user), Partial(T.Object({ email, sessionToken }))]);

export type FilterUser = S<typeof filterUser>;
