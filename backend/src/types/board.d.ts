export interface Board {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBoard = Pick<Board, 'name'>;
