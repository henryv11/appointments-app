import { FilterUserProfileView, ListUserProfileView, UserProfileView } from '../schemas';
import { AbstractRepository } from './abstract';

const columns = {
  personId: 'p.id',
  personCreatedAt: 'p.created_at',
  personUpdatedAt: 'p.updated_at',
  userCreatedAt: 'u.created_at',
  userUpdatedAt: 'u.updated_at',
  username: 'username',
  email: 'email',
  userId: 'user_id',
  firstName: 'first_name',
  lastName: 'last_name',
  dateOfBirth: 'date_of_birth',
} as const;

export class UserProfileViewRepository extends AbstractRepository<typeof columns> {
  constructor() {
    super({ columns });
  }

  findOne = (filter: FilterUserProfileView, conn = this.query) =>
    conn<UserProfileView>(this.sql`${this.select(filter)} LIMIT 1`).then(this.firstRow);

  findMaybeOne = (filter: FilterUserProfileView, conn = this.query) =>
    conn<UserProfileView>(this.sql`${this.select(filter)} LIMIT 1`).then(this.maybeFirstRow);

  list = ({
    limit = 100,
    offset = 1,
    orderDirection = 'DESC',
    orderBy = 'userCreatedAt',
    ...filter
  }: ListUserProfileView) =>
    this.query<UserProfileView>(
      this.sql`${this.select(filter)}
            LIMIT ${limit} OFFSET ${offset}
            ORDER BY ${this.columns.map[orderBy]} ${this.orderDirection(orderDirection)}`,
    ).then(this.allRows);

  private select = (filter: FilterUserProfileView) =>
    this.sql`SELECT ${this.columns.sql}
            FROM ${this.repositories.user.table} u
            LEFT JOIN ${this.repositories.person.table} p
            ON u.id = p.user_id
            ${this.where(filter)}`;

  private where({ userId, personId, firstName, lastName, email }: FilterUserProfileView) {
    const where = this.sql.where();
    if (userId) where.and`u.id = ${userId}`;
    if (personId) where.and`p.id = ${personId}`;
    if (firstName) where.and`first_name = ${firstName}`;
    if (lastName) where.and`last_name = ${lastName}`;
    if (email) where.and`email = ${email}`;
    return where;
  }
}
