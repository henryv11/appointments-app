import { CreatePersonAgreement, PersonAgreement } from '../schemas';
import { AbstractRepository } from './abstract';

export class PersonAgreementsRepository extends AbstractRepository {
  create = ({ personId, agreementType, hasAccepted }: CreatePersonAgreement, conn = this.query) =>
    conn<PersonAgreement>(
      this.sql`INSERT INTO ${this.table} (person_id, agreement_type, has_accepted)
                        ${this.sql.values([personId, agreementType, hasAccepted])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);

  private get table() {
    return this.sql`person_agreements`;
  }

  private get columns() {
    return this.sql.columns(
      ['person_id', 'personId'],
      ['agreement_type', 'agreementType'],
      ['has_accepted', 'hasAccepted'],
      ['created_at', 'createdAt'],
      ['updated_at', 'updatedAt'],
    );
  }
}
