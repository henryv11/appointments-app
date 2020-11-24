import { CreatePersonAgreement, PersonAgreement } from '../schemas';
import { AbstractRepository } from './abstract';

export class PersonAgreementsRepository extends AbstractRepository {
  /* #region  Public */
  constructor() {
    super({
      table: 'person_agreements',
      columns: ['person_id', 'agreement_type', 'has_accepted', 'created_at', 'updated_at'],
    });
  }

  create = ({ personId, agreementType, hasAccepted }: CreatePersonAgreement, conn = this.query) =>
    conn<PersonAgreement>(
      this.sql`INSERT INTO ${this.table} (person_id, agreement_type, has_accepted)
                        ${this.sql.values([personId, agreementType, hasAccepted])}
              RETURNING ${this.columns}`,
    ).then(this.firstRow);
  /* #endregion */
}
