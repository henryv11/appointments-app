import { Static, Type } from '@sinclair/typebox';
import { uploadType } from './data-types';
import TypeUtil from './type-util';

const id = TypeUtil.BigInt();
const userId = TypeUtil.BigInt({ column: 'user_id' });
const fileName = Type.String({ column: 'file_name' });
const fileType = Type.String({ column: 'file_type' });
const filePath = Type.String({ column: 'file_path' });
const fileEncoding = Type.String({ column: 'file_encoding' });
const originalFileName = Type.String({ column: 'original_file_name' });
const createdAt = TypeUtil.TimestampTz({ column: 'created_at' });
const updatedAt = TypeUtil.TimestampTz({ column: 'updated_at' });

export const userUpload = TypeUtil.Table('user_upload', {
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

export type UserUpload = Static<typeof userUpload>;

export const createUserUpload = Type.Object({
  userId,
  uploadType,
  fileName,
  fileType,
  filePath,
  fileEncoding,
  originalFileName,
});

export type CreateUserUpload = Static<typeof createUserUpload>;

export const filterUserUpload = TypeUtil.Partial(userUpload);

export type FilterUserUpload = Static<typeof filterUserUpload>;

export const listUserUpload = Type.Intersect([filterUserUpload, TypeUtil.ListControl(TypeUtil.Keys(userUpload))]);

export type ListUserUpload = Static<typeof listUserUpload>;
