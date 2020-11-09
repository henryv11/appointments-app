import { User } from './user';

export interface Person {
  id: number;
  userId: User['id'];
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  createdAt: number;
  updatedAt: number;
}

export type UpdatePerson = Pick<Person, 'id'> & Partial<CreatePerson>;

export type CreatePerson = Pick<Person, 'userId' | 'firstName' | 'lastName' | 'email' | 'dateOfBirth'>;

export type CreatedPerson = Pick<Person, 'id'> & CreatePerson;
