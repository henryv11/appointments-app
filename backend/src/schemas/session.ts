import { Static as S, Type as T } from '@sinclair/typebox';
import { bigInt, sessionToken, timestampTz } from './data-types';
import { Partial } from './util';

const id = bigInt;
const userId = bigInt;
const token = sessionToken;
const startedAt = timestampTz;
const endedAt = T.Union([timestampTz, T.Null()]);
const updatedAt = timestampTz;

export const session = T.Object({
  id,
  userId,
  token,
  startedAt,
  endedAt,
  updatedAt,
});

export type Session = S<typeof session>;

export const createSession = T.Object({ userId, token });

export type CreateSession = S<typeof createSession>;

export const filterSession = Partial(session);

export type FilterSession = S<typeof filterSession>;

export const updateSession = Partial(T.Object({ endedAt }));

export type UpdateSession = S<typeof updateSession>;

export const refreshSessionParameters = T.Object({ sessionToken });

export type RefreshSessionParameters = S<typeof refreshSessionParameters>;
