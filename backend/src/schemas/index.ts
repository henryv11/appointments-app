import { Static as S, Type as T } from '@sinclair/typebox';

export enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc',
}

const orderDirection = T.Enum(OrderDirection, { description: 'Database sorting order' });
const id = T.Number({ description: 'Generic database table primary key' });
const username = T.String({ description: "User's username" });
const password = T.String({ description: "User's password" });
const firstName = T.String({ description: "User's first name" });
const lastName = T.String({ description: "User's last name" });
const email = T.String({ description: "User's email address" });
const dateOfBirth = T.String({ description: "User's date of birth" });
const hasAcceptedTermsAndConditions = T.Boolean({ description: 'Whether user has accepted terms and conditions' });
const sessionToken = T.String({ description: "User's current session's refresh token" });
const boardName = T.String({ description: "Board's name" });
const jsonWebToken = T.String({ description: 'jwt' });
const publicUser = T.Object(
  {
    id,
    username,
  },
  { description: "User's public details" },
);

export const authResponse = T.Object(
  {
    user: publicUser,
    token: jsonWebToken,
    refreshToken: sessionToken,
  },
  { description: 'generic successful auth response body' },
);

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

export const createBoardBody = T.Object({ name: boardName });

export const getBoardParams = T.Object({
  boardId: id,
});

export const getBoardsQuery = T.Object({
  page: T.Optional(T.Number()),
  pageSize: T.Optional(T.Number()),
  orderBy: T.Optional(T.String()),
  orderDir: T.Optional(orderDirection),
});

export type UserRegistrationBody = S<typeof userRegistrationBody>;
export type UserLoginBody = S<typeof userLoginBody>;
export type RefreshSessionParams = S<typeof refreshSessionParams>;
export type CreateBoardBody = S<typeof createBoardBody>;
export type GetBoardParams = S<typeof getBoardParams>;
export type GetBoardsQuery = S<typeof getBoardsQuery>;
export type AuthResponse = S<typeof authResponse>;

export interface Board {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBoard = Pick<Board, 'name'>;

export interface Channel {
  id: number;
  boardId: Board['id'];
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateChannel = Pick<Channel, 'name' | 'boardId'>;

export interface Message {
  id: number;
  userId: User['id'];
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateMessage = Pick<Message, 'userId' | 'content'>;

export interface PersonAgreement {
  agreementType: AgreementType;
  personId: Person['id'];
  hasAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreatePersonAgreement = Pick<PersonAgreement, 'agreementType' | 'personId' | 'hasAccepted'>;

export type CreatedPersonAgreement = CreatePersonAgreement;

export type AgreementType = 'TERMS_AND_CONDITIONS';

export interface Person {
  id: number;
  userId: User['id'];
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UpdatePerson = Pick<Person, 'id'> & Partial<CreatePerson>;

export type CreatePerson = Omit<Person, 'id' | 'createdAt' | 'updatedAt'>;

export type CreatedPerson = Pick<Person, 'id'> & CreatePerson;

export interface Session {
  id: number;
  userId: User['id'];
  token: string;
  startedAt: Date;
  endedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
}

export type CreateSession = Pick<Session, 'userId' | 'token'>;

export type CreatedSession = CreateSession & Pick<Session, 'id'>;

export type UpdateSession = Pick<Session, 'id'> & Partial<Pick<Session, 'endedAt'>>;

export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Pick<User, 'id' | 'username'>;

export type UserRegistration = Pick<User, 'username' | 'password'> &
  Omit<CreatePerson, 'userId'> & { hasAcceptedTermsAndConditions: boolean };

export type UserAuth = Pick<User, 'username' | 'password' | 'id'>;

export type CreateUser = Pick<User, 'username' | 'password'>;

export type UserLogin = Partial<Pick<User, 'username'> & Pick<Person, 'email'>> & Pick<User, 'password'>;
