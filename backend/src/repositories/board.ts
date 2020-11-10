import { AbstractRepository } from '../lib';
import { Board, CreateBoard } from '../types';

export class BoardRepository extends AbstractRepository {
  create = ({ name }: CreateBoard, _query = this.query) =>
    _query<Board>(
      `insert into board ( name )
        values ( $1 )
        returning id, name, created_at as "createdAt", updated_at as "updatedAt"`,
      [name],
    ).then(this.firstRow);
}
