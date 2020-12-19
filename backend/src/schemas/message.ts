import { User } from './user';

export interface Message {
  id: number;
  userId: User['id'];
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateMessage = Pick<Message, 'userId' | 'content'>;
