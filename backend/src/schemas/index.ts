import { Static as S, Type as T } from '@sinclair/typebox';
import { bigInt, email, jsonWebToken, password, sessionToken, uploadType, username } from './data-types';
import { createPerson } from './person';
import { createUser, publicUser } from './user';

export * from './board';
export * from './channel';
export * from './data-types';
export * from './message';
export * from './person';
export * from './person-agreements';
export * from './session';
export * from './user';
export * from './user-profile-view';
export * from './user-upload';
export * from './util';

export const sessionResponse = T.Object({ user: publicUser, token: jsonWebToken, refreshToken: sessionToken });

export type SessionResponse = S<typeof sessionResponse>;

export const getBoardParameters = T.Object({ boardId: bigInt });

export type GetBoardParameters = S<typeof getBoardParameters>;

export const loginUser = T.Object({
  password,
  username: T.Optional(username),
  email: T.Optional(email),
});

export type LoginUser = S<typeof loginUser>;

export const registerUser = T.Intersect([
  createPerson,
  createUser,
  T.Object({
    hasAcceptedTermsAndConditions: T.Boolean(),
  }),
]);

export type RegisterUser = S<typeof registerUser>;

export const postUploadQuery = T.Object({
  uploadType,
});

export type PostUploadQuery = S<typeof postUploadQuery>;

export const getUploadParameters = T.Object({ uploadId: bigInt });

export type GetUploadParameters = S<typeof getUploadParameters>;

export const deleteUploadParameters = getUploadParameters;

export type DeleteUploadParameters = S<typeof deleteUploadParameters>;

export const getUserProfileViewParameters = T.Object({ userId: bigInt });

export type GetUserProfileViewParameters = S<typeof getUserProfileViewParameters>;
