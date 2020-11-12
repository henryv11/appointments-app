import { CreateUser, Person, PublicUser, UserAuth } from '../schemas';
import { AbstractRepository } from './abstract';

export class UserRepository extends AbstractRepository {
  create = ({ username, password }: CreateUser, conn = this.query) =>
    conn<PublicUser>(
      `insert into app_user ( username, password )
        values ( $1, $2 )
        returning id, username`,
      [username, password],
    ).then(this.firstRow);

  findOne(filter: Partial<Pick<UserAuth, 'username' | 'id'> & Pick<Person, 'email'>>, conn = this.query) {
    const { where, params } = this.buildFilters(filter);
    return conn<UserAuth>(
      `select id, username, password
        from app_user ${where} limit 1`,
      params,
    ).then(this.firstRow);
  }

  private buildFilters(filter: Partial<Pick<UserAuth, 'username' | 'id'> & Pick<Person, 'email'>>) {
    const where = [];
    const params = [];
    if (filter.id) where.push('id = ?'), params.push(filter.id);
    if (filter.username) where.push('username = ?'), params.push(filter.username);
    if (filter.email) where.push('id = (select user_id from person where email = ?)'), params.push(filter.email);
    return { where: where.length ? 'where ' + where.join(' and ') : '', params };
  }
}
