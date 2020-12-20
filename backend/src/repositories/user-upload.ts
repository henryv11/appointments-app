import { CreateUserUpload, FilterUserUpload, ListUserUpload, userUpload, UserUpload } from '../schemas';
import { AbstractRepository } from './abstract';

export class UserUploadRepository extends AbstractRepository<typeof userUpload> {
  constructor() {
    super(userUpload);
  }

  findOne = (filter: FilterUserUpload, conn = this.query) =>
    conn<UserUpload>(this.sql`${this.select(filter)} LIMIT 1`).then(this.firstRow);

  findMaybeOne = (filter: FilterUserUpload, conn = this.query) =>
    conn<UserUpload>(this.sql`${this.select(filter)} LIMIT 1`).then(this.maybeFirstRow);

  list = ({ orderBy = 'createdAt', orderDirection = 'ASC', offset = 0, limit = 100, ...filter }: ListUserUpload) =>
    this.query<UserUpload & { totalRows: number }>(
      this.sql`${this.select(filter, this.sql.columns([this.columns.sql, this.sql`COUNT(*) OVER() AS "totalRows"`]))}
            ORDER BY ${this.columns.map[orderBy]} ${this.orderDirection(orderDirection)}
            LIMIT ${limit} OFFSET ${offset}`,
    ).then(this.allRows);

  create = (
    { userId, uploadType, fileName, fileType, filePath, fileEncoding, originalFileName }: CreateUserUpload,
    conn = this.query,
  ) =>
    conn<UserUpload>(
      this.sql`INSERT INTO ${this.table}
                      (user_id, upload_type, file_name, file_type, file_path, file_encoding, original_file_name)
      ${this.sql.values([userId, uploadType, fileName, fileType, filePath, fileEncoding, originalFileName])}
      RETURNING ${this.columns.sql}`,
    ).then(this.firstRow);

  delete = (filter: FilterUserUpload, conn = this.query) =>
    conn(this.sql`DELETE FROM ${this.table} ${this.where(filter, true)}`).then(this.rowCount);

  private where({ id, userId, uploadType }: FilterUserUpload, throwOnEmpty = false) {
    const where = this.sql.where();
    if (id) where.and`id = ${id}`;
    if (userId) where.and`user_id = ${userId}`;
    if (uploadType) where.and`upload_type = ${uploadType}`;
    if (throwOnEmpty && where.isEmpty) throw this.errors.forbidden();
    return where;
  }

  private select(filter: FilterUserUpload, columns = this.columns.sql) {
    return this.sql`SELECT ${columns} FROM ${this.table} ${this.where(filter)}`;
  }
}
