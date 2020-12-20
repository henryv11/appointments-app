import { createServiceFetch } from '@/lib/services';

const fetch = createServiceFetch('board');

export async function createBoard(token: string, body: Pick<Board, 'name'>) {
  const res = await fetch<Board>({ method: 'POST', body, token });
  if (res.status !== 201) throw new Error('failed to create board');
  return res.json();
}

export async function getBoard(token: string, boardId: Board['id']) {
  const res = await fetch<Board>({ method: 'GET', path: boardId, token });
  if (res.status !== 200) throw new Error('failed to get board');
  return res.json();
}

export async function listBoards(token: string, filters: any) {
  const res = await fetch<Board[]>({ method: 'GET', query: filters, token });
  if (res.status !== 200) throw new Error('failed to list boards');
  return res.json();
}

export interface Board {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
