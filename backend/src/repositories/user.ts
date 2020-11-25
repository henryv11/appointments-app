import { AuthUser, CreateUser, FilterUser, PublicUser } from '../schemas';
import { AbstractRepository } from './abstract';

export class UserRepository extends AbstractRepository {
  //#region [Public]

  constructor() {
    super({ table: 'app_user', columns: ['id', 'username'] });
  }

  findOne = (filter: FilterUser) => this.find(filter).then(this.firstRow);

  findMaybeOne = (filter: FilterUser) => this.find(filter).then(this.maybeFirstRow);

  findOneWithPassword = (filter: FilterUser) => this.select<AuthUser>(filter, this.privateColumns).then(this.firstRow);

  create = ({ username, password }: CreateUser, conn = this.query) =>
    conn<PublicUser>(
      this.sql`INSERT INTO ${this.table} (username, password)
                        ${this.sql.values([username, password])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);

  //#endregion

  //#region [Private]

  private get privateColumns() {
    return this.sql.columns(['id', 'username', 'password']);
  }

  private find = (filter: FilterUser) => this.select<PublicUser>(filter, this.columns);

  private select = <T extends PublicUser | AuthUser>(filter: FilterUser, columns = this.columns) =>
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
    if (email) where.and`id = (SELECT user_id FROM ${this.repositories.person.table} WHERE email = ${email})`;
    return where;
  }

  //#endregion
}
