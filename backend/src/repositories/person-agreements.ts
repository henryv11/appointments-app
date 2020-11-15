import { CreatePersonAgreement, PersonAgreement } from '../schemas';
import { AbstractRepository } from './abstract';

export class PersonAgreementsRepository extends AbstractRepository {
  create = ({ personId, agreementType, hasAccepted }: CreatePersonAgreement, conn = this.query) =>
    conn<PersonAgreement>(
      this.sql`insert into ${this.table}
                      (person_id, agreement_type, has_accepted)
              values  (${personId}, ${agreementType}, ${hasAccepted})
              returning ${this.columns}`,
    ).then(this.firstRow);

  private get table() {
    return this.sql`person_agreements`;
  }

  private get columns() {
    return this.sql`
    person_id as "personId",
    agreement_type as "agreementType",
    has_accepted as "hasAccepted",
    created_at as "createdAt",
    updated_at as "updatedAt"
    `;
  }
}
