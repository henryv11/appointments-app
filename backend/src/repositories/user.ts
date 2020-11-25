import { AuthUser, CreateUser, FilterUser, PublicUser } from '../schemas';
import { AbstractRepository } from './abstract';

export class UserRepository extends AbstractRepository {
  //#region [Public]

  constructor() {
    super({ table: 'app_user', columns: ['id', 'username'] });
  }

  findOne = (filter: FilterUser) => this.find(filter).then(this.firstRow);

  findMaybeOne = (filter: FilterUser) => this.find(filter).then(this.maybeFirstRow);

  findOneWithPassword = (filter: FilterUser) =>
    this.find<AuthUser>(filter, this.sql.columns([this.columns, 'password'])).then(this.firstRow);

  create = ({ username, password }: CreateUser, conn = this.query) =>
    conn<PublicUser>(
      this.sql`INSERT INTO ${this.table} (username, password)
                        ${this.sql.values([username, password])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);

  /* #region  Private */
  private find = <T extends PublicUser | AuthUser = PublicUser>(filter: FilterUser, columns = this.columns) =>
    this.query<T>(
      this.sql`SELECT ${columns}
              FROM ${this.table}
              ${this.where(filter)}
              LIMIT 1`,
    );

  private where({ id, username, email }: FilterUser) {
    const where = this.sql.where();
    if (id) where.and`id = ${id}`;
    if (username) where.and`username = ${username}`;
    if (email) where.and`id = (SELECT user_id FROM ${this.repositores.person.table} WHERE email = ${email})`;
    return where;
  }

  //#endregion
}
