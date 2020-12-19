import { Static as S, Type as T } from '@sinclair/typebox';
import { bigInt, timestampTz } from './data-types';
import { Partial } from './util';

const name = T.String({ description: "Board's name" });
const id = bigInt;
const boardId = bigInt;
const updatedAt = timestampTz;
const createdAt = timestampTz;

export const channel = T.Object({
  id,
  boardId,
  name,
  updatedAt,
  createdAt,
});

export type Channel = S<typeof channel>;

export const filterChannel = Partial(channel);

export type FilterChannel = S<typeof filterChannel>;

export const createChannel = T.Object({ name, boardId });

export type CreateChannel = S<typeof createChannel>;
