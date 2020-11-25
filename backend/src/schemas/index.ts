import { Static as S, TLiteral, Type as T } from '@sinclair/typebox';

/* #region  Enums */
export enum AgreementType {
  TERMS_AND_CONDITIONS = 'TERMS_AND_CONDITIONS',
}

export enum UploadType {
  PROFILE_IMAGE = 'PROFILE_IMAGE',
}
/* #endregion */

/* #region  Utils */
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
/* #endregion */

/* #region  Schemas */
const ascOrderDir = T.Literal('ASC');
const descOrderDir = T.Literal('DESC');
const orderDirection = T.Union([ascOrderDir, descOrderDir], {
  description: 'Database ordering direction',
  type: 'string',
});
const id = T.Number({ description: 'Generic database table primary key' });
const username = T.String({
  minLength: 6,
  description: "User's username",
});
const password = T.String({
  minLength: 8,
  // pattern: '^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$',
  description: "User's password",
});
const firstName = T.String({ description: "User's first name" });
const lastName = T.String({ description: "User's last name" });
const email = T.String({ format: 'email', description: "User's email address" });
const dateOfBirth = T.String({ format: 'date', description: "User's date of birth" });
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

export const postUploadQuery = T.Object({ uploadType: T.Enum(UploadType) });

export const listUploadQuery = T.Union([
  getGenericListControlObject(
    'id',
    'userId',
    'uploadType',
    'fileName',
    'fileType',
    'filePath',
    'updatedAt',
    'createdAt',
  ),
  T.Object({ id, userId: id, uploadType: T.Enum(UploadType) }),
]);

export const getBoardsQuery = getGenericListControlObject('id', 'name', 'createdAt', 'updatedAt');
/* #endregion */

/* #region  Schema Types */
export type SessionToken = S<typeof sessionToken>;

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

export type PostUploadQuery = S<typeof postUploadQuery>;

export type ListUploadQuery = S<typeof listUploadQuery>;
/* #endregion */

/* #region  General Types */
export interface ListOptions<T extends string = string> {
  limit?: number;
  offset?: number;
  orderBy?: T;
  orderDirection?: OrderDirection;
}

/* #region  Boards table */
export interface Board {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
export type UpdateBoard = Pick<Board, 'name'>;

export type FilterBoard = Partial<Pick<Board, 'id' | 'name' | 'createdAt' | 'updatedAt'>>;

export type CreateBoard = Pick<Board, 'name'>;
/* #endregion */

/* #region  Channels table */
export interface Channel {
  id: number;
  boardId: Board['id'];
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FilterChannel = Partial<Pick<Channel, 'id' | 'name' | 'boardId' | 'createdAt' | 'updatedAt'>>;

export type CreateChannel = Pick<Channel, 'name' | 'boardId'>;
/* #endregion */

/* #region  Messages table */
export interface Message {
  id: number;
  userId: User['id'];
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateMessage = Pick<Message, 'userId' | 'content'>;
/* #endregion */

/* #region  Persons agreements table */
export interface PersonAgreement {
  agreementType: AgreementType;
  personId: Person['id'];
  hasAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreatePersonAgreement = Pick<PersonAgreement, 'agreementType' | 'personId' | 'hasAccepted'>;
/* #endregion */

/* #region  Persons table */
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
/* #endregion */

/* #region  Sessions table */
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
/* #endregion */

/* #region  Users table */
export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Pick<User, 'id' | 'username'>;

export type AuthUser = Pick<User, 'password'> & PublicUser;

export type CreateUser = Pick<User, 'username' | 'password'>;

export type LoginUser = Partial<Pick<User, 'username'> & Pick<Person, 'email'>> & Pick<User, 'password'>;

export type FilterUser = Partial<Pick<AuthUser, 'username' | 'id'> & Pick<Person, 'email'>>;
/* #endregion */

/* #region  User profile view */
type UserProfileViewBase = Pick<User, 'username'> &
  Pick<Person, 'dateOfBirth' | 'firstName' | 'lastName' | 'userId' | 'email'>;

export interface UserProfileView extends UserProfileViewBase {
  userCreatedAt: User['createdAt'];
  userUpdatedAt: User['updatedAt'];
  personCreatedAt: Person['createdAt'];
  personUpdatedAt: Person['updatedAt'];
  personId: Person['id'];
}

export type UserProfileViewFilter = Partial<
  Pick<UserProfileView, 'username' | 'dateOfBirth' | 'firstName' | 'lastName' | 'userId' | 'personId' | 'email'>
>;
/* #endregion */

/* #region  User uploads table */
export interface UserUpload {
  id: number;
  userId: User['id'];
  uploadType: UploadType;
  fileName: string;
  fileType: string;
  filePath: string;
  fileEncoding: BufferEncoding;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserUpload = Pick<
  UserUpload,
  'userId' | 'uploadType' | 'fileName' | 'fileType' | 'filePath' | 'fileEncoding'
>;
export type FilterUserUpload = Partial<
  Pick<UserUpload, 'userId' | 'uploadType' | 'id' | 'fileName' | 'fileType' | 'filePath' | 'createdAt' | 'updatedAt'>
>;
/* #endregion */
/* #endregion */
