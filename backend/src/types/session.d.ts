import { User } from './user';

export interface Session {
  id: number;
  userId: User['number'];
  token: string;
  startedAt: Date;
  endedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
}

export type CreateSession = Pick<Session, 'userId' | 'token'>;

export type CreatedSession = CreateSession & Pick<Session, 'id'>;

export type UpdateSession = Pick<Session, 'id'> & Partial<Pick<Session, 'endedAt'>>;
