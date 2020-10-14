import { User } from './user';

export interface Session {
  id: number;
  userId: User['number'];
  token: string;
  startedAt: string;
  endedAt: string | null;
  updatedAt: string;
  createdAt: string;
}

export type CreateSession = Pick<Session, 'userId' | 'token'>;

export type CreatedSession = CreateSession & Pick<Session, 'id'>;
