import { CreateUser, Person, PublicUser, User, UserAuth } from '../schemas';
import { AbstractRepository } from './abstract';

export class UserRepository extends AbstractRepository {
  create = ({ username, password }: CreateUser, conn = this.query) =>
    conn<PublicUser>(
      `insert into app_user ( username, password )
        values ( $1, $2 )
        returning id, username`,
      [username, password],
    ).then(this.firstRow);

  findByUsername = (username: string, conn = this.query) =>
    conn<UserAuth>(
      `select id, username, password
      from app_user
      where username = $1
      limit 1`,
      [username],
    ).then(this.firstRow);

  findByEmail = (email: Person['email'], conn = this.query) =>
    conn<UserAuth>(
      `select id, username, password
      from app_user
      where id = (select user_id from person where email = $1)
      limit 1`,
      [email],
    ).then(this.firstRow);

  findById = (id: User['id'], conn = this.query) =>
    conn<PublicUser>(
      `select id, username
      from app_user
      where id = $1 limit 1`,
      [id],
    ).then(this.firstRow);
}
