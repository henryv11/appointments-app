import { Static as S, Type as T } from '@sinclair/typebox';
import { bigInt, dateOfBirth, email, firstName, lastName, timestampTz, username } from './data-types';
import { Keys, ListControl, Partial } from './util';

const userId = bigInt;
const personId = bigInt;
const userCreatedAt = timestampTz;
const userUpdatedAt = timestampTz;
const personCreatedAt = timestampTz;
const personUpdatedAt = timestampTz;

export const userProfileView = T.Object({
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

export type UserProfileView = S<typeof userProfileView>;

export const filterUserProfileView = Partial(userProfileView);

export type FilterUserProfileView = S<typeof filterUserProfileView>;

export const listUserProfileView = T.Intersect([filterUserProfileView, ListControl(...Keys(userProfileView))]);

export type ListUserProfileView = S<typeof listUserProfileView>;
