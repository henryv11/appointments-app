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

export type UserRegistration = Pick<User, 'username' | 'password'> &
  Pick<Person, 'firstName' | 'lastName' | 'dateOfBirth' | 'email'> & {
    hasAcceptedTermsAndConditions: boolean;
  };

export type UserProfile = Pick<Person, 'email' | 'firstName' | 'lastName' | 'dateOfBirth'> &
  Pick<User, 'username'> & {
    personCreatedAt: Person['createdAt'];
    personUpdatedAt: Person['updatedAt'];
    userCreatedAt: User['updatedAt'];
    userupdatedAt: User['updatedAt'];
    userId: User['id'];
    personId: Person['id'];
  };
