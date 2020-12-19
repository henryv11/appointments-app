import { Static as S, Type as T } from '@sinclair/typebox';
import { bigInt, timestampTz } from './data-types';
import { Keys, ListControl, Partial } from './util';

const id = bigInt;
const name = T.String();
const createdAt = timestampTz;
const updatedAt = timestampTz;

export const board = T.Object({
  id,
  name,
  createdAt,
  updatedAt,
});

export type Board = S<typeof board>;

export const updateBoard = Partial(T.Object({ name }));

export type UpdateBoard = S<typeof updateBoard>;

export const createBoard = T.Object({ name });

export type CreateBoard = S<typeof createBoard>;

export const filterBoard = Partial(board);

export type FilterBoard = S<typeof filterBoard>;

export const listBoard = T.Intersect([filterBoard, ListControl(...Keys(board))]);

export type ListBoard = S<typeof listBoard>;
