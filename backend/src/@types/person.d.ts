export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

export type CreatePerson = Pick<Person, 'firstName' | 'lastName' | 'email' | 'dateOfBirth'>;

export type CreatedPerson = Pick<Person, 'id'> & CreatePerson;
