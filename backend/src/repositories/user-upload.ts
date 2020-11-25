import { CreateUserUpload, FilterUserUpload, ListOptions, UserUpload } from '../schemas';
import { AbstractRepository } from './abstract';

export class UserUploadRepository extends AbstractRepository {
  //#region [Public]

  constructor() {
    super({
      table: 'user_upload',
      columns: [
        'id',
        'user_id',
        'upload_type',
        'file_name',
        'file_type',
        'file_path',
        'updated_at',
        'created_at',
        'file_encoding',
      ],
    });
  }

  findOne = (filter: FilterUserUpload) => this.find(filter).then(this.firstRow);

  findMaybeOne = (filter: FilterUserUpload) => this.find(filter).then(this.maybeFirstRow);

  list = ({
    orderBy = 'createdAt',
    orderDirection = 'ASC',
    offset = 1,
    limit = 100,
    ...filter
  }: ListOptions<keyof UserUpload> & FilterUserUpload) =>
    this.query<UserUpload>(
      this.sql`${this.select(filter)}
            ORDER BY ${this.toSnakeCase(orderBy)} ${this.orderDirection(orderDirection)}
            LIMIT ${limit} OFFSET ${offset}`,
    ).then(this.allRows);

  create = ({ userId, uploadType, fileName, fileType, filePath }: CreateUserUpload, conn = this.query) =>
    conn<UserUpload>(
      this.sql`INSERT INTO ${this.table} (user_id, upload_type, file_name, file_type, file_path)
                          ${this.sql.values([userId, uploadType, fileName, fileType, filePath])}
            RETURNING ${this.columns}`,
    ).then(this.firstRow);

  //#endregion

  //#region [Private]

  private find = (filter: FilterUserUpload) => this.query<UserUpload>(this.sql`${this.select(filter)} LIMIT 1`);

  private where({ id, userId, uploadType }: FilterUserUpload) {
    const where = this.sql.where();
    if (id) where.and`id = ${id}`;
    if (userId) where.and`user_id = ${userId}`;
    if (uploadType) where.and`upload_type = ${uploadType}`;
    return where;
  }

  private select(filter: FilterUserUpload) {
    return this.sql`SELECT ${this.columns}
                  FROM ${this.table}
                  ${this.where(filter)}`;
  }

  //#endregion
}
