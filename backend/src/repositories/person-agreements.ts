import { CreatePersonAgreement, personAgreement, PersonAgreement } from '../schemas';
import { AbstractRepository } from './abstract';

export class PersonAgreementsRepository extends AbstractRepository<typeof personAgreement> {
  constructor() {
    super(personAgreement);
  }

  create = ({ personId, agreementType, hasAccepted }: CreatePersonAgreement, conn = this.query) =>
    conn<PersonAgreement>(
      this.sql`INSERT INTO ${this.table} (person_id, agreement_type, has_accepted)
                        ${this.sql.values([personId, agreementType, hasAccepted])}
              RETURNING ${this.columns.sql}`,
    ).then(this.firstRow);
}
