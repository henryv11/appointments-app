import { Type as T } from '@sinclair/typebox';

export enum AgreementType {
  TERMS_AND_CONDITIONS = 'TERMS_AND_CONDITIONS',
}

export enum UploadType {
  PROFILE_IMAGE = 'PROFILE_IMAGE',
}

export const agreementType = T.Enum(AgreementType);

export const uploadType = T.Enum(UploadType);

export const bigInt = T.String({
  description: 'Actually represents BigInt data type in postgres but treated as string in NodeJS',
});

export const timestampTz = T.String({ format: 'date-time', description: 'Generic PostgreSQL timestamptz data type' });

export const ascOrderDir = T.Literal('ASC', { description: 'Ascending order direction' });

export const descOrderDir = T.Literal('DESC', { description: 'Descending order direction' });

export const orderDirection = T.Union([ascOrderDir, descOrderDir], {
  description: 'Database ordering direction',
});

export const firstName = T.String({ description: "User's first name" });

export const lastName = T.String({ description: "User's last name" });

export const email = T.String({
  format: 'email',
  description: "User's email address",
  example: 'hello.there@mail.com',
});

export const dateOfBirth = T.String({ format: 'date', description: "User's date of birth", example: '1996-11-20' });

export const sessionToken = T.String({
  minLength: 64,
  maxLength: 64,
  description: "Session's unique token used to refresh user's sessions",
});

export const jsonWebToken = T.String({
  description: 'JSON Web Token in format <Bearer [token]>',
  example:
    'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0IiwiaWF0IjoxNjAxODE0Mzc4fQ.Cqo8aBPhJN-hVN9wpAYNnIbLZ8M8ORMAMj_6ZIQTGV_g1hx3dti5Qjelgup2eh2dEnbP3aNmLqHKA7vYrJZjBQ',
});

export const username = T.String({
  minLength: 6,
  description: "User's username",
});

export const password = T.String({
  minLength: 8,
  // pattern: '^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$',
  description: "User's password",
});
