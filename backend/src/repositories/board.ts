import { Board, CreateBoard, FilterBoard, ListOptions, UpdateBoard } from '../schemas';
import { AbstractRepository } from './abstract';

export class BoardRepository extends AbstractRepository {
  //#region [Public]

  constructor() {
    super({
      columns: ['id', 'name', 'created_at', 'updated_at'],
      table: 'board',
    });
  }

  findOne = (filter: FilterBoard) => this.find(filter).then(this.firstRow);

  list = ({
    limit,
    offset,
    orderBy = 'id',
    orderDirection = 'ASC',
    ...filter
  }: FilterBoard & ListOptions<keyof Board>) =>
    this.query<Board>(
      this.sql`${this.select(filter)}
              ORDER BY ${this.toSnakeCase(orderBy)} ${orderDirection}
              LIMIT ${limit || 100} OFFSET ${offset || 1}`,
    ).then(this.allRows);

  create = ({ name }: CreateBoard, conn = this.query) =>
    conn<Board>(
      this.sql`INSERT INTO ${this.table} (name)
                        ${this.sql.values([name])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);

  update = ({ name }: UpdateBoard, filter: FilterBoard, conn = this.query) =>
    conn<Board>(
      this.sql`UPDATE ${this.table}
              ${this.sql.set([['name', name]])}
              ${this.where(filter, true)}
              RETURNING ${this.columns}`,
    ).then(this.allRows);

  //#endregion

  //#region [Private]

  private find = (filter: FilterBoard) => this.query<Board>(this.sql`${this.select(filter)} LIMIT 1`);

  private select = (filter: FilterBoard) =>
    this.sql`SELECT ${this.columns}
            FROM ${this.table}
            ${this.where(filter)}`;

  private where({ name, id }: FilterBoard, throwOnEmpty = false) {
    const where = this.sql.where();
    if (name) where.and`name = ${name}`;
    if (id) where.and`id = ${id}`;
    if (throwOnEmpty && where.isEmpty) throw this.errors.forbidden();
    return where;
  }

  //#endregion
}
