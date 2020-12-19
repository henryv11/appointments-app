import { Board, CreateBoard, FilterBoard, ListBoard, UpdateBoard } from '../schemas';
import { AbstractRepository } from './abstract';

const table = 'board';

const columns = {
  id: 'id',
  name: 'name',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export class BoardRepository extends AbstractRepository<typeof columns> {
  constructor() {
    super({ columns, table });
  }

  findOne = (filter: FilterBoard) => this.find(filter).then(this.firstRow);

  list = ({ limit = 100, offset = 1, orderBy = 'id', orderDirection = 'ASC', ...filter }: ListBoard) =>
    this.query<Board>(
      this.sql`${this.select(filter)}
              ORDER BY ${this.columns.map[orderBy]} ${orderDirection}
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

  private find = (filter: FilterBoard) => this.query<Board>(this.sql`${this.select(filter)} LIMIT 1`);

  private select = (filter: FilterBoard) =>
    this.sql`SELECT ${this.columns.sql}
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
