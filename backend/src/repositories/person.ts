import { CreatePerson, FilterPerson, Person, UpdatePerson } from '../schemas';
import { AbstractRepository } from './abstract';

export class PersonRepository extends AbstractRepository {
  create = ({ firstName, lastName, email, dateOfBirth, userId }: CreatePerson, conn = this.query) =>
    conn<Person>(
      this.sql`INSERT INTO ${this.table} (first_name, last_name, email, date_of_birth, user_id) 
                        ${this.sql.values([firstName, lastName, email, dateOfBirth, userId])}
              RETURNING ${this.columns}`,
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
              ${this.getWhereClause(filter)}
              RETURNING ${this.columns}`,
    ).then(this.allRows);

  private getWhereClause({ id }: FilterPerson) {
    const where = this.sql.where``;
    if (id) where.and`id = ${id}`;
    return where;
  }

  private get table() {
    return this.sql`person`;
  }

  private get columns() {
    return this.sql.columns(
      'id',
      'email',
      ['first_name', 'firstName'],
      ['last_name', 'lastName'],
      ['date_of_birth', 'dateOfBirth'],
      ['user_id', 'userId'],
      ['created_at', 'createdAt'],
      ['updated_at', 'updatedAt'],
    );
  }
}
