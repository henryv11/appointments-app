import { Board, CreateBoard, FilterBoard, ListOptions, UpdateBoard } from '../schemas';
import { AbstractRepository } from './abstract';

export class BoardRepository extends AbstractRepository {
  create = ({ name }: CreateBoard, conn = this.query) =>
    conn<Board>(
      this.sql`INSERT INTO ${this.table} (name)
                        ${this.sql.values([name])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);

  findOne = (filter: FilterBoard, conn = this.query) =>
    conn<Board>(
      this.sql`SELECT ${this.columns}
              FROM ${this.table}
              ${this.getWhereClause(filter)}
              LIMIT 1`,
    ).then(this.firstRow);

  update = ({ name }: UpdateBoard, filter: FilterBoard, conn = this.query) =>
    conn<Board>(
      this.sql`UPDATE ${this.table}
              ${this.sql.set([['name', name]])}
              ${this.getWhereClause(filter, true)}
              RETURNING ${this.columns}`,
    ).then(this.allRows);

  list = (
    {
      limit,
      offset,
      orderBy = 'id',
      orderDirection = 'ASC',
      ...filter
    }: FilterBoard & ListOptions<'id' | 'name' | 'created_at' | 'updated_at'>,
    conn = this.query,
  ) =>
    conn(
      this.sql`SELECT ${this.columns}
              FROM ${this.table}
              ${this.getWhereClause(filter)}
              ORDER BY ${orderBy} ${orderDirection}
              LIMIT ${limit || 100} OFFSET ${offset || 1}`,
    ).then(this.allRows);

  private getWhereClause({ name, id }: FilterBoard, throwOnEmpty = false) {
    const where = this.sql.where``;
    if (name) where.and`name = ${name}`;
    if (id) where.and`id = ${id}`;
    if (throwOnEmpty && where.isEmpty) throw this.errors.forbidden();
    return where;
  }

  private get table() {
    return this.sql`board`;
  }

  private get columns() {
    return this.sql.columns('id', 'name', ['created_at', 'createdAt'], ['updated_at', 'updatedAt']);
  }
}
