import { Person } from './person';

export interface User {
  id: number;
  personId: Person['id'];
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export type PublicUser = Pick<User, 'id' | 'username'>;

export type UserLogin = Pick<User, 'username' | 'password'>;

export type UserAuth = PublicUser & UserLogin;

export type CreateUser = Pick<User, 'personId'> & UserLogin;
