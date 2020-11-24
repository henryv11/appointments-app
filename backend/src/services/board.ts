import { CreateBoard } from '../schemas';
import { AbstractService } from './abstract';

export class BoardService extends AbstractService {
  /* #region  Public */
  async createNewBoard(board: CreateBoard) {
    return await this.repositories.board.create(board).catch(() => {
      throw this.errors.badRequest(`board with name ${board.name} already exists`);
    });
  }
  /* #endregion */
}
