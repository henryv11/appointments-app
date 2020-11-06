import { CreatePerson, Person } from './person';

export interface User {
  id: BigInt;
  username: string;
  password: string;
  createdAt: number;
  updatedAt: number;
}

export type PublicUser = Pick<User, 'id' | 'username'>;

export type UserRegistration = Pick<User, 'username' | 'password'> &
  Omit<CreatePerson, 'userId'> & { hasAcceptedTermsAndConditions: boolean };

export type UserAuth = Pick<User, 'username' | 'password' | 'id'>;

export type CreateUser = Pick<User, 'username' | 'password'>;

export type UserLogin = Partial<Pick<User, 'username'> & Pick<Person, 'email'>> & Pick<User, 'password'>;
