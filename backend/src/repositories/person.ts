import { CreatePerson, FilterPerson, ListPerson, person, Person, UpdatePerson } from '../schemas';
import { AbstractRepository } from './abstract';

export class PersonRepository extends AbstractRepository<typeof person> {
  constructor() {
    super(person);
  }

  findOne = (filter: FilterPerson, conn = this.query) =>
    conn<Person>(this.sql`${this.select(filter)} LIMIT 1`).then(this.firstRow);

  findMaybeOne = (filter: FilterPerson, conn = this.query) =>
    conn<Person>(this.sql`${this.select(filter)} LIMIT 1`).then(this.maybeFirstRow);

  list = ({ orderBy = 'createdAt', orderDirection = 'ASC', offset, limit, ...filter }: ListPerson) =>
    this.query<Person>(
      this.sql`${this.select(filter)}
              ORDER BY ${this.columns.map[orderBy]} ${this.orderDirection(orderDirection)}
              LIMIT ${limit} OFFSET ${offset}`,
    ).then(this.allRows);

  create = ({ firstName, lastName, email, dateOfBirth, userId }: CreatePerson, conn = this.query) =>
    conn<Person>(
      this.sql`INSERT INTO ${this.table} (first_name, last_name, email, date_of_birth, user_id) 
                        ${this.sql.values([firstName, lastName, email, dateOfBirth, userId])}
              RETURNING ${this.columns.sql}`,
    ).then(this.firstRow);

  update = ({ firstName, lastName, email, dateOfBirth }: UpdatePerson, filter: FilterPerson, conn = this.query) =>
    conn<Person>(
      this.sql`UPDATE ${this.table}
              ${this.sql.set([
                ['first_name', firstName],
                ['last_name', lastName],
                ['email', email],
                ['date_of_birth', dateOfBirth],
              ])}
              ${this.where(filter, true)}
              RETURNING ${this.columns.sql}`,
    ).then(this.allRows);

  private select = (filter: FilterPerson) =>
    this.sql`SELECT ${this.columns.sql} FROM ${this.table} ${this.where(filter)}`;

  private where(
    {
      id,
      email,
      dateOfBirth,
      firstName,
      lastName,
      userId,
      createdAt,
      updatedAt,
      createdAtBeforeThan,
      createdAtLaterThan,
    }: FilterPerson,
    throwOnEmpty = false,
  ) {
    const where = this.sql.where();
    if (id) where.and`id = ${id}`;
    if (email) where.and`email = ${email}`;
    if (dateOfBirth) where.and`date_of_birth = ${dateOfBirth}`;
    if (firstName) where.and`first_name = ${firstName}`;
    if (lastName) where.and`last_name = ${lastName}`;
    if (userId) where.and`user_id = ${userId}`;
    if (createdAt) where.and`created_at = ${createdAt}`;
    if (updatedAt) where.and`updated_at = ${updatedAt}`;
    if (createdAtBeforeThan) where.and`created_at < ${createdAtBeforeThan}`;
    if (createdAtLaterThan) where.and`created_at > ${createdAtLaterThan}`;
    if (throwOnEmpty && where.isEmpty) throw this.errors.forbidden();
    return where;
  }
}
