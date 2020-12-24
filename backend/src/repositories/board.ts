import { board, Board, CreateBoard, FilterBoard, ListBoard, UpdateBoard } from '../schemas';
import { AbstractRepository } from './abstract';

export class BoardRepository extends AbstractRepository<typeof board> {
  constructor() {
    super(board);
  }

  findOne = (filter: FilterBoard, conn = this.query) =>
    conn<Board>(this.sql`${this.select(filter)} LIMIT 1`).then(this.firstRow);

  list = ({ limit = 100, offset = 1, orderBy = 'id', orderDirection = 'ASC', ...filter }: ListBoard) =>
    this.query<Board & { totalRows: number }>(
      this.sql`${this.select(filter, this.sql.columns([this.columns.sql, this.sql`COUNT(*) OVER() AS "totalRows"`]))}
              ORDER BY ${this.columns.map[orderBy]} ${this.orderDirection(orderDirection)}
              LIMIT ${limit} OFFSET ${offset}`,
    ).then(this.allRows);

  create = ({ name }: CreateBoard, conn = this.query) =>
    conn<Board>(
      this.sql`INSERT INTO ${this.table} (name)
                        ${this.sql.values([name])}
              RETURNING ${this.columns.sql}`,
    ).then(this.firstRow);

  update = ({ name }: UpdateBoard, filter: FilterBoard, conn = this.query) =>
    conn<Board>(
      this.sql`UPDATE ${this.table}
              ${this.sql.set([['name', name]])}
              ${this.where(filter, true)}
              RETURNING ${this.columns.sql}`,
    ).then(this.allRows);

  private select = (filter: FilterBoard, columns = this.columns.sql) =>
    this.sql`SELECT ${columns}
            FROM ${this.table}
            ${this.where(filter)}`;

  private where({ name, id }: FilterBoard, throwOnEmpty = false) {
    const where = this.sql.where();
    if (id) where.and`id = ${id}`;
    if (name) where.and`name = ${name}`;
    if (throwOnEmpty && where.isEmpty) throw this.errors.forbidden();
    return where;
  }
}
