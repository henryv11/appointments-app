import { CreateUser, FilterUser, PublicUser, UserAuth } from '../schemas';
import { AbstractRepository } from './abstract';

export class UserRepository extends AbstractRepository {
  create = ({ username, password }: CreateUser, conn = this.query) =>
    conn<PublicUser>(
      this.sql`INSERT INTO ${this.table} (username, password)
                        ${this.sql.values([username, password])}
              RETURNING ${this.publicColumns}`,
    ).then(this.firstRow);

  findOne = (filter: FilterUser, conn = this.query) =>
    conn<UserAuth>(
      this.sql`SELECT ${this.privateColumns}
              FROM ${this.table}
              ${this.getWhereClause(filter)}
              LIMIT 1`,
    ).then(this.firstRow);

  private getWhereClause({ id, username, email }: FilterUser) {
    const where = this.sql.where``;
    if (id) where.and`id = ${id}`;
    if (username) where.and`username = ${username}`;
    if (email) where.and`id = (SELECT user_id FROM person WHERE email = ${email})`;
    return where;
  }

  private get table() {
    return this.sql`app_user`;
  }

  private get privateColumns() {
    return this.sql.columns('id', 'username', 'password');
  }

  private get publicColumns() {
    return this.sql.columns('id', 'username');
  }
}
