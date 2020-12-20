import { Static, Type } from '@sinclair/typebox';
import TypeUtil from './type-util';

const id = TypeUtil.BigInt();
const userId = TypeUtil.BigInt({
  column: 'user_id',
});
const content = Type.String({});
const createdAt = Type.String({
  column: 'created_at',
});
const updatedAt = Type.String({
  column: 'updated_at',
});

export const message = TypeUtil.Table('message', {
  id,
  userId,
  content,
  createdAt,
  updatedAt,
});

export type Message = Static<typeof message>;

const createMessage = Type.Object({ userId, content });

export type CreateMessage = Static<typeof createMessage>;
