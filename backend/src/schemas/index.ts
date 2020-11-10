import { Static as S, Type as T } from '@sinclair/typebox';

const username = T.String();
const password = T.String();
const firstName = T.String();
const lastName = T.String();
const email = T.String({ description: "User's email address" });
const dateOfBirth = T.String({ description: "User's date of birth" });
const hasAcceptedTermsAndConditions = T.Boolean({ description: 'Whether user has accepted terms and conditions' });
const sessionToken = T.String({ description: "User's current session's refresh token" });
const name = T.String({ description: "Board's name" });

export const userRegistrationBody = T.Object({
  username,
  password,
  firstName,
  lastName,
  email,
  dateOfBirth,
  hasAcceptedTermsAndConditions,
});

export const userLoginBody = T.Object({
  username: T.Optional(username),
  password,
  email: T.Optional(email),
});

export const refreshSessionParams = T.Object({
  sessionToken,
});

export const createBoardBody = T.Object({ name });

export type UserRegistrationBody = S<typeof userRegistrationBody>;
export type UserLoginBody = S<typeof userLoginBody>;
export type RefreshSessionParams = S<typeof refreshSessionParams>;
export type CreateBoardBody = S<typeof createBoardBody>;
