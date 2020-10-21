import { CreatePerson, Person } from './person';

export interface User {
  id: number;
  personId: Person['id'];
  username: string;
  password: string;
  createdAt: number;
  updatedAt: number;
}

export type PublicUser = Pick<User, 'id' | 'username'>;

export type UserRegistration = Pick<User, 'username' | 'password'> &
  CreatePerson & { hasAcceptedTermsAndConditions: boolean };

export type UserAuth = Pick<User, 'username' | 'password' | 'id'>;

export type CreateUser = Pick<User, 'personId' | 'username' | 'password'>;

export type UserLogin = Pick<User, 'username' | 'password'> & Pick<Person, 'email'>;
