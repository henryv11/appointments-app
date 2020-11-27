import { AuthUser, CreateUser, FilterUser, PublicUser } from '../schemas';
import { AbstractRepository } from './abstract';

export class UserRepository extends AbstractRepository {
  //#region [Public]

  constructor() {
    super({ table: 'app_user', columns: ['id', 'username'] });
  }

  findOne = (filter: FilterUser, conn = this.query) => this.find(filter, conn).then(this.firstRow);

  findMaybeOne = (filter: FilterUser, conn = this.query) => this.find(filter, conn).then(this.maybeFirstRow);

  findOneWithPassword = (filter: FilterUser, conn = this.query) =>
    this.find<AuthUser>(filter, conn, this.sql.columns([this.columns, 'password'])).then(this.firstRow);

  create = ({ username, password }: CreateUser, conn = this.query) =>
    conn<PublicUser>(
      this.sql`INSERT INTO ${this.table} (username, password)
                        ${this.sql.values([username, password])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);

  /* #region  Private */
  private find = <T extends PublicUser | AuthUser = PublicUser>(
    filter: FilterUser,
    conn = this.query,
    columns = this.columns,
  ) =>
    conn<T>(
      this.sql`SELECT ${columns}
              FROM ${this.table}
              ${this.where(filter)}
              LIMIT 1`,
    );

  private where({ id, username, email }: FilterUser) {
    const where = this.sql.where();
    if (id) where.and`id = ${id}`;
    if (username) where.and`username = ${username}`;
    if (email) where.and`id = (SELECT user_id FROM ${this.repositories.person.table} WHERE email = ${email})`;
    return where;
  }

  //#endregion
}
