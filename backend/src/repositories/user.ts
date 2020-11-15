import { CreateUser, Person, PublicUser, User, UserAuth } from '../schemas';
import { AbstractRepository } from './abstract';

export class UserRepository extends AbstractRepository {
  create = ({ username, password }: CreateUser, conn = this.query) =>
    conn<PublicUser>(
      this.sql`insert into ${this.table}
                      (username, password)
              values  (${username}, ${password})
              returning ${this.publicColumns}`,
    ).then(this.firstRow);

  findOne = (filter: Partial<Pick<UserAuth, 'username' | 'id'> & Pick<Person, 'email'>>, conn = this.query) =>
    conn<UserAuth>(
      this.sql`select ${this.privateColumns}
              from ${this.table}
              ${this.getWhereClause(filter)}
              limit 1`,
    ).then(this.firstRow);

  private getWhereClause({ id, username, email }: Partial<Pick<User, 'username' | 'id'> & Pick<Person, 'email'>>) {
    const where = this.sql.where``;
    if (id) where.and`id = ${id}`;
    if (username) where.and`username = ${username}`;
    if (email) where.and`id = (select user_id from person where email = ${email})`;
    return where;
  }

  private get table() {
    return this.sql`app_user`;
  }

  private get privateColumns() {
    return this.sql`id, username, password`;
  }

  private get publicColumns() {
    return this.sql`id, username`;
  }
}
