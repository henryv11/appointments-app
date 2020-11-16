import { Static as S, TLiteral, Type as T } from '@sinclair/typebox';

export enum AgreementType {
  TERMS_AND_CONDITIONS = 'TERMS_AND_CONDITIONS',
}

const getGenericListControlObject = <T extends string[]>(...orderByKeys: T) =>
  T.Object(
    {
      limit: T.Optional(T.Number()),
      offset: T.Optional(T.Number()),
      orderBy: T.Optional(
        T.Union(
          orderByKeys.map(key => T.Literal(key) as TLiteral<T[number]>),
          {
            description: 'Columns you can order by',
            type: 'string',
          },
        ),
      ),
      orderDirection: T.Optional(orderDirection),
    },
    { description: 'Generic database sorting and pagination options', type: 'string' },
  );

const ascOrderDir = T.Literal('ASC');
const descOrderDir = T.Literal('DESC');
const orderDirection = T.Union([ascOrderDir, descOrderDir], {
  description: 'Database ordering direction',
  type: 'string',
});
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

export const getBoardsQuery = getGenericListControlObject('id', 'name', 'created_at', 'updated_at');

export type UserRegistrationBody = S<typeof userRegistrationBody>;
export type UserLoginBody = S<typeof userLoginBody>;
export type RefreshSessionParams = S<typeof refreshSessionParams>;
export type CreateBoardBody = S<typeof createBoardBody>;
export type GetBoardParams = S<typeof getBoardParams>;
export type GetBoardsQuery = S<typeof getBoardsQuery>;
export type AuthResponse = S<typeof authResponse>;
export type AscOrderDir = S<typeof ascOrderDir>;
export type DescOrderDir = S<typeof descOrderDir>;
export type OrderDirection = S<typeof orderDirection>;
export interface ListOptions<T extends string = string> {
  limit?: number;
  offset?: number;
  orderBy?: T;
  orderDirection?: OrderDirection;
}

/**
 *    Board table
 **/
export interface Board {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
export type UpdateBoard = Pick<Board, 'name'>;
export type FilterBoard = Partial<Pick<Board, 'id' | 'name' | 'createdAt' | 'updatedAt'>>;
export type CreateBoard = Pick<Board, 'name'>;

/**
 *    Channel table
 **/
export interface Channel {
  id: number;
  boardId: Board['id'];
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
export type FilterChannel = Partial<Pick<Channel, 'id' | 'name' | 'boardId' | 'createdAt' | 'updatedAt'>>;
export type CreateChannel = Pick<Channel, 'name' | 'boardId'>;

/**
 *    Message table
 **/
export interface Message {
  id: number;
  userId: User['id'];
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
export type CreateMessage = Pick<Message, 'userId' | 'content'>;

/**
 *    Person agreements table
 **/
export interface PersonAgreement {
  agreementType: AgreementType;
  personId: Person['id'];
  hasAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export type CreatePersonAgreement = Pick<PersonAgreement, 'agreementType' | 'personId' | 'hasAccepted'>;

/**
 *    Person table
 **/
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
export type UpdatePerson = Partial<CreatePerson>;
export type CreatePerson = Omit<Person, 'id' | 'createdAt' | 'updatedAt'>;
export type FilterPerson = Pick<Person, 'id'>;

/**
 *    Session table
 **/
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
export type FilterSession = Partial<Pick<Session, 'id' | 'userId' | 'endedAt' | 'token'>>;
export type UpdateSession = Pick<Session, 'endedAt'>;

/**
 *    User table
 **/
export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
export type PublicUser = Pick<User, 'id' | 'username'>;
export type UserAuth = Pick<User, 'password'> & PublicUser;
export type CreateUser = Pick<User, 'username' | 'password'>;
export type UserLogin = Partial<Pick<User, 'username'> & Pick<Person, 'email'>> & Pick<User, 'password'>;
export type FilterUser = Partial<Pick<UserAuth, 'username' | 'id'> & Pick<Person, 'email'>>;
