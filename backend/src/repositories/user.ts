import { CreateUser, FilterUser, PublicUser, User } from '../schemas';
import { AbstractRepository } from './abstract';

const table = 'app_user';

const columns = {
  id: 'id',
  username: 'username',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export class UserRepository extends AbstractRepository<typeof columns> {
  constructor() {
    super({ table, columns });
  }

  auth = {
    findOne: (filter: FilterUser, conn = this.query) =>
      conn<User>(this.sql`${this.select(filter, this.sql.columns([this.columns.sql, 'password']))}
      LIMIT 1`).then(this.firstRow),
  };

  findOne = (filter: FilterUser, conn = this.query) =>
    conn<PublicUser>(this.sql`${this.select(filter)} LIMIT 1`).then(this.firstRow);

  findMaybeOne = (filter: FilterUser, conn = this.query) =>
    conn<PublicUser>(this.sql`${this.select(filter)} LIMIT 1`).then(this.maybeFirstRow);

  create = ({ username, password }: CreateUser, conn = this.query) =>
    conn<PublicUser>(
      this.sql`INSERT INTO ${this.table} (username, password)
                        ${this.sql.values([username, password])}
              RETURNING ${this.columns.sql}`,
    ).then(this.firstRow);

  private select(filter: FilterUser, columns = this.columns.sql) {
    return this.sql`SELECT ${columns}
                  FROM ${this.table}
                  ${this.where(filter)}`;
  }

  private where({ id, username, email, sessionToken }: FilterUser) {
    const where = this.sql.where();
    if (id) where.and`id = ${id}`;
    if (username) where.and`username = ${username}`;
    if (email) where.and`id = (SELECT user_id FROM ${this.repositories.person.table} WHERE email = ${email})`;
    if (sessionToken)
      where.and`id = (
        SELECT user_id
        FROM ${this.repositories.session.table}
        WHERE token = ${sessionToken} AND ended_at IS NULL
      )`;
    return where;
  }
}
