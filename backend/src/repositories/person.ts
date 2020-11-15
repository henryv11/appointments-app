import { CreatePerson, FilterPerson, Person, UpdatePerson } from '../schemas';
import { AbstractRepository } from './abstract';

export class PersonRepository extends AbstractRepository {
  create = ({ firstName, lastName, email, dateOfBirth, userId }: CreatePerson, conn = this.query) =>
    conn<Person>(
      this.sql`insert into ${this.table} 
                      (first_name, last_name, email, date_of_birth, user_id) 
              values  (${firstName}, ${lastName}, ${email}, ${dateOfBirth}, ${userId})
              returning ${this.columns}`,
    ).then(this.firstRow);

  update = ({ firstName, lastName, email, dateOfBirth }: UpdatePerson, filter: FilterPerson, conn = this.query) =>
    conn<Person>(
      this.sql`update ${this.table}
              ${this.sql.set([
                !!firstName && ['first_name', firstName],
                !!lastName && ['last_name', lastName],
                !!email && ['email', email],
                !!dateOfBirth && ['date_of_birth', dateOfBirth],
              ])}
              ${this.getWhereClause(filter)}
              returning ${this.columns}`,
    ).then(this.firstRow);

  private getWhereClause({ id }: FilterPerson) {
    const where = this.sql.where``;
    if (id) where.and`id = ${id}`;
    return where;
  }

  private get table() {
    return this.sql`person`;
  }

  private get columns() {
    return this.sql`
      id,
      first_name as "firstName",
      last_name as "lastName",
      email as "email",
      date_of_birth as "dateOfBirth",
      user_id as "userId",
      created_at as "createdAt",
      updated_at as "updatedAt"
      `;
  }
}
