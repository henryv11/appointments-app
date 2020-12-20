import { Static, Type } from '@sinclair/typebox';
import TypeUtil from './type-util';

const email = TypeUtil.Email();
const username = Type.String();
const userId = TypeUtil.BigInt({ column: 'user_id' });
const personId = TypeUtil.BigInt({ column: 'p.id' });
const userCreatedAt = TypeUtil.TimestampTz({ column: 'u.created_at' });
const userUpdatedAt = TypeUtil.TimestampTz({ column: 'u.updated_at' });
const personCreatedAt = TypeUtil.TimestampTz({ column: 'p.created_at' });
const personUpdatedAt = TypeUtil.TimestampTz({ column: 'p.updated_at' });
const firstName = Type.String({ column: 'first_name' });
const lastName = Type.String({ column: 'last_name' });
const dateOfBirth = Type.String({ column: 'date_of_birth' });

export const userProfileView = Type.Object({
  username,
  dateOfBirth,
  firstName,
  lastName,
  email,
  userId,
  personId,
  userCreatedAt,
  userUpdatedAt,
  personCreatedAt,
  personUpdatedAt,
});

export type UserProfileView = Static<typeof userProfileView>;

export const filterUserProfileView = TypeUtil.Partial(userProfileView);

export type FilterUserProfileView = Static<typeof filterUserProfileView>;

export const listUserProfileView = Type.Intersect([
  filterUserProfileView,
  TypeUtil.ListControl(...TypeUtil.Keys(userProfileView)),
]);

export type ListUserProfileView = Static<typeof listUserProfileView>;
