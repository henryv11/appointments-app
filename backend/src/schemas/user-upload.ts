import { Static as S, Type as T } from '@sinclair/typebox';
import { bigInt, timestampTz, uploadType } from './data-types';
import { Keys, ListControl, Partial } from './util';

const id = bigInt;
const userId = bigInt;
const fileName = T.String();
const fileType = T.String();
const filePath = T.String();
const fileEncoding = T.String();
const originalFileName = T.String();
const createdAt = timestampTz;
const updatedAt = timestampTz;

export const userUpload = T.Object({
  id,
  userId,
  uploadType,
  fileName,
  fileType,
  filePath,
  fileEncoding,
  originalFileName,
  createdAt,
  updatedAt,
});

export type UserUpload = S<typeof userUpload>;

export const createUserUpload = T.Object({
  userId,
  uploadType,
  fileName,
  fileType,
  filePath,
  fileEncoding,
  originalFileName,
});

export type CreateUserUpload = S<typeof createUserUpload>;

export const filterUserUpload = Partial(userUpload);

export type FilterUserUpload = S<typeof filterUserUpload>;

export const listUserUpload = T.Intersect([filterUserUpload, ListControl(...Keys(userUpload))]);

export type ListUserUpload = S<typeof listUserUpload>;
