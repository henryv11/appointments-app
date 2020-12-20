import { Static, Type } from '@sinclair/typebox';
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
export * from './type-util';

export const sessionResponse = Type.Object({ user: publicUser, token: jsonWebToken, refreshToken: sessionToken });

export type SessionResponse = Static<typeof sessionResponse>;

export const getBoardParameters = Type.Object({ boardId: bigInt });

export type GetBoardParameters = Static<typeof getBoardParameters>;

export const loginUser = Object({
  password,
  username: Type.Optional(username),
  email: Type.Optional(email),
});

export type LoginUser = Static<typeof loginUser>;

export const registerUser = Type.Intersect([
  createPerson,
  createUser,
  Type.Object({
    hasAcceptedTermsAndConditions: Type.Boolean(),
  }),
]);

export type RegisterUser = Static<typeof registerUser>;

export const postUploadQuery = Type.Object({
  uploadType,
});

export type PostUploadQuery = Static<typeof postUploadQuery>;

export const getUploadParameters = Type.Object({ uploadId: bigInt });

export type GetUploadParameters = Static<typeof getUploadParameters>;

export const deleteUploadParameters = getUploadParameters;

export type DeleteUploadParameters = Static<typeof deleteUploadParameters>;

export const getUserProfileViewParameters = Type.Object({ userId: bigInt });

export type GetUserProfileViewParameters = Static<typeof getUserProfileViewParameters>;

export const refreshSessionParameters = Type.Object({ sessionToken });

export type RefreshSessionParameters = Static<typeof refreshSessionParameters>;
