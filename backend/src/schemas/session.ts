import { Static, Type } from '@sinclair/typebox';
import TypeUtil from './type-util';

const id = TypeUtil.BigInt();
const userId = TypeUtil.BigInt({ column: 'user_id' });
const token = Type.String();
const startedAt = TypeUtil.TimestampTz({ column: 'started_at' });
const endedAt = Type.Union([TypeUtil.TimestampTz(), Type.Null()], { column: 'ended_at' });
const updatedAt = TypeUtil.TimestampTz({ column: 'updated_at' });
const createdAt = TypeUtil.TimestampTz({ column: 'created_at' });

export const session = TypeUtil.Table('session', {
  id,
  userId,
  token,
  startedAt,
  endedAt,
  updatedAt,
  createdAt,
});

export type Session = Static<typeof session>;

export const createSession = Type.Object({ userId, token });

export type CreateSession = Static<typeof createSession>;

export const filterSession = TypeUtil.Partial(session);

export type FilterSession = Static<typeof filterSession>;

export const updateSession = TypeUtil.Partial(Type.Object({ endedAt }));

export type UpdateSession = Static<typeof updateSession>;
