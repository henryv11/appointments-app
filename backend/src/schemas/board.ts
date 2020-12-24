import { Static, Type } from '@sinclair/typebox';
import TypeUtil from './type-util';

const id = TypeUtil.BigInt();
const name = Type.String();
const createdAt = TypeUtil.TimestampTz({
  column: 'created_at',
});
const updatedAt = TypeUtil.TimestampTz({
  column: 'updated_at',
});

export const board = TypeUtil.Table('board', {
  id,
  name,
  createdAt,
  updatedAt,
});

export type Board = Static<typeof board>;

export const updateBoard = TypeUtil.Partial(Type.Object({ name }));

export type UpdateBoard = Static<typeof updateBoard>;

export const createBoard = Type.Object({ name });

export type CreateBoard = Static<typeof createBoard>;

export const filterBoard = TypeUtil.Partial(board);

export type FilterBoard = Static<typeof filterBoard>;

export const listBoard = Type.Intersect([filterBoard, TypeUtil.ListControl(TypeUtil.Keys(board))]);

export type ListBoard = Static<typeof listBoard>;
