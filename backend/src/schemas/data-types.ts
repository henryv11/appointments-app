import { Type } from '@sinclair/typebox';

export enum AgreementType {
  TERMS_AND_CONDITIONS = 'TERMS_AND_CONDITIONS',
}

export enum UploadType {
  PROFILE_IMAGE = 'PROFILE_IMAGE',
}

export const agreementType = Type.Enum(AgreementType, { column: 'agreement_type' });

export const uploadType = Type.Enum(UploadType, { column: 'upload_type' });

export const bigInt = Type.String({
  description: 'Actually represents BigInt data type in PostgreSQL but treated as string in NodeJS',
});

export const timestampTz = Type.String({
  format: 'date-time',
  description: 'Generic PostgreSQL timestamptz data type',
});

export const ascOrderDir = Type.Literal('ASC', { description: 'Ascending order direction' });

export const descOrderDir = Type.Literal('DESC', { description: 'Descending order direction' });

export const orderDirection = Type.Union([ascOrderDir, descOrderDir], {
  description: 'Database ordering direction',
});

export const firstName = Type.String({ description: "User's first name", column: 'first_name' });

export const lastName = Type.String({ description: "User's last name", column: 'last_name' });

export const email = Type.String({
  format: 'email',
  description: "User's email address",
  example: 'hello.there@mail.com',
});

export const dateOfBirth = Type.String({
  format: 'date',
  description: "User's date of birth",
  example: '1996-11-20',
  column: 'date_of_birth',
});

export const sessionToken = Type.String({
  // minLength: 64,
  // maxLength: 64,
  description: "Session's unique token used to refresh user's sessions",
});

export const jsonWebToken = Type.String({
  description: 'JSON Web Token in format <Bearer [token]>',
  example:
    'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0IiwiaWF0IjoxNjAxODE0Mzc4fQ.Cqo8aBPhJN-hVN9wpAYNnIbLZ8M8ORMAMj_6ZIQTGV_g1hx3dti5Qjelgup2eh2dEnbP3aNmLqHKA7vYrJZjBQ',
});

export const username = Type.String({
  minLength: 6,
  description: "User's username",
});

export const password = Type.String({
  minLength: 8,
  // pattern: '^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$',
  description: "User's password",
});
