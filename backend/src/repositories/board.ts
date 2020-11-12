import { Board, CreateBoard } from '../schemas';
import { AbstractRepository } from './abstract';

export class BoardRepository extends AbstractRepository {
  create = ({ name }: CreateBoard, _query = this.query) =>
    _query<Board>(
      `insert into board ( name )
        values ( $1 )
        returning id, name, created_at as "createdAt", updated_at as "updatedAt"`,
      [name],
    ).then(this.firstRow);

  findById = (id: Board['id'], _query = this.query) =>
    _query<Board>(
      `select id, name, created_at as "createdAt", updated_at as "updatedAt"
        from board
        where id = $1`,
      [id],
    );

  list(filter: { name?: string; nameLike?: string; limit?: number; offset?: number }, _query = this.query) {
    const where = [];
    const params = [];
    if (filter.name) where.push('name = ?'), params.push(filter.name);
    if (filter.nameLike) where.push('name ilike ?'), params.push(filter.nameLike);
    return _query(
      `select id, name, created_at as "createdAt", updated_at as "updatedAt"
        from board` +
        (where.length ? ' where ' + where.join(' and ') : '') +
        ' limit ? offset ?',
      [...params, filter.limit || 100, filter.offset || 0],
    );
  }
}
