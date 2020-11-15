import { Board, CreateBoard, FilterBoard, ListOptions } from '../schemas';
import { AbstractRepository } from './abstract';

export class BoardRepository extends AbstractRepository {
  create = ({ name }: CreateBoard, conn = this.query) =>
    conn<Board>(
      this.sql`insert into ${this.table}
                      (name)
              values  (${name})
              returning ${this.columns}`,
    ).then(this.firstRow);

  findOne = (filter: FilterBoard, conn = this.query) =>
    conn<Board>(
      this.sql`select ${this.columns}
              from ${this.table}
              ${this.getWhereClause(filter)}
              limit 1`,
    ).then(this.firstRow);

  list = (
    {
      limit,
      offset,
      orderBy,
      orderDirection,
      ...filter
    }: FilterBoard & ListOptions<'id' | 'name' | 'created_at' | 'updated_at'>,
    conn = this.query,
  ) =>
    conn(
      this.sql`select ${this.columns}
              from ${this.table}
              ${this.getWhereClause(filter)}
              order by ${orderBy} ${orderDirection}
              limit ${limit || 100} offset ${offset || 1}`,
    ).then(this.allRows);

  private getWhereClause({ name, id }: FilterBoard) {
    const where = this.sql.where``;
    if (name) where.and`name = ${name}`;
    if (id) where.and`id = ${id}`;
    return where;
  }

  private get table() {
    return this.sql`board`;
  }

  private get columns() {
    return this.sql`
    id,
    name,
    created_at as "createdAt", 
    updated_at as "updatedAt"
    `;
  }
}
