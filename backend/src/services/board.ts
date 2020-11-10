import { FastifyInstance } from 'fastify';

export const boardService = ({ repositories }: FastifyInstance) => ({
  async createNewBoard({ name }: { name: string }) {
    const board = await repositories.board.create({ name });
    return board;
  },
});
