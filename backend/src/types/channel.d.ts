import { Board } from './board';

export interface Channel {
  id: number;
  boardId: Board['id'];
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateChannel = Pick<Channel, 'name' | 'boardId'>;
