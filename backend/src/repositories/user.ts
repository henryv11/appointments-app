import { CreateUser, Person, PublicUser, User, UserAuth } from '../schemas';
import { AbstractRepository } from './abstract';

export class UserRepository extends AbstractRepository {
  create = ({ username, password }: CreateUser, _query = this.query) =>
    _query<PublicUser>(
      `insert into app_user ( username, password )
        values ( $1, $2 )
        returning id, username`,
      [username, password],
    ).then(this.firstRow);

  findByUsername = (username: string, _query = this.query) =>
    _query<UserAuth>(
      `select id, username, password
      from app_user
      where username = $1
      limit 1`,
      [username],
    ).then(this.firstRow);

  findByEmail = (email: Person['email'], _query = this.query) =>
    _query<UserAuth>(
      `select id, username, password
      from app_user
      where id = (select user_id from person where email = $1)
      limit 1`,
      [email],
    ).then(this.firstRow);

  findById = (id: User['id'], _query = this.query) =>
    _query<PublicUser>(
      `select id, username
      from app_user
      where id = $1 limit 1`,
      [id],
    ).then(this.firstRow);
}
