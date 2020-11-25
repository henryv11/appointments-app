import { ListOptions, UserProfileView, UserProfileViewFilter } from '../schemas';
import { AbstractRepository } from './abstract';

export class UserProfileViewRepository extends AbstractRepository {
  //#region  [Public]

  constructor() {
    super();
    this.columns = this.sql.columns([
      'username',
      'email',
      ['user_id', 'userId'],
      ['p.id', 'personId'],
      ['date_of_birth', 'dateOfBirth'],
      ['first_name', 'firstName'],
      ['last_name', 'lastName'],
      ['p.created_at', 'personCreatedAt'],
      ['p.updated_at', 'personUpdatedAt'],
      ['u.created_at', 'userCreatedAt'],
      ['u.updated_at', 'userUpdatedAt'],
    ]);
  }

  findOne = (filter: UserProfileViewFilter) => this.find(filter).then(this.firstRow);

  findMaybeOne = (filter: UserProfileViewFilter) => this.find(filter).then(this.maybeFirstRow);

  list = ({
    limit = 100,
    offset = 1,
    orderDirection = 'DESC',
    orderBy = 'createdAt',
    ...filter
  }: UserProfileViewFilter & ListOptions<string>) =>
    this.query<UserProfileView>(
      this.sql`${this.select(filter)}
            LIMIT ${limit} OFFSET ${offset}
            ORDER BY ${this.toSnakeCase(orderBy)} ${this.orderDirection(orderDirection)}`,
    ).then(this.allRows);

  //#endregion

  //#region  [Private]

  private find = (filter: UserProfileViewFilter) =>
    this.query<UserProfileView>(this.sql`${this.select(filter)} LIMIT 1`);

  private select = (filter: UserProfileViewFilter) =>
    this.sql`SELECT ${this.columns}
            FROM ${this.repositories.user.table} u
            LEFT JOIN ${this.repositories.person.table} p
            ON u.id = p.user_id
            ${this.where(filter)}`;

  private where({ userId, personId, firstName, lastName, email }: UserProfileViewFilter) {
    const where = this.sql.where();
    if (userId) where.and`u.id = ${userId}`;
    if (personId) where.and`p.id = ${personId}`;
    if (firstName) where.and`first_name = ${firstName}`;
    if (lastName) where.and`last_name = ${lastName}`;
    if (email) where.and`email = ${email}`;
    return where;
  }

  //#endregion
}
