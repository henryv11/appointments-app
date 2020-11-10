import { AbstractService } from '../lib';
import { CreateBoard } from '../types';

export class BoardService extends AbstractService {
  async createNewBoard(board: CreateBoard) {
    try {
      return await this.repositories.board.create(board);
    } catch (error) {
      throw this.errors.badRequest('board with name already exists');
    }
  }
}