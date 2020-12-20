import { Static, Type } from '@sinclair/typebox';
import TypeUtil from './type-util';

const name = Type.String({ description: "Board's name" });
const id = TypeUtil.BigInt();
const boardId = TypeUtil.BigInt({
  column: 'board_id',
});
const updatedAt = TypeUtil.TimestampTz({
  column: 'updated_at',
});
const createdAt = TypeUtil.TimestampTz({
  column: 'created_at',
});

export const channel = TypeUtil.Table('channel', {
  id,
  boardId,
  name,
  updatedAt,
  createdAt,
});

export type Channel = Static<typeof channel>;

export const filterChannel = TypeUtil.Partial(channel);

export type FilterChannel = Static<typeof filterChannel>;

export const createChannel = Type.Object({ name, boardId });

export type CreateChannel = Static<typeof createChannel>;
