import { CreatePersonAgreement, PersonAgreement } from '../schemas';
import { AbstractRepository } from './abstract';

const table = 'person_agreements';

const columns = {
  personId: 'person_id',
  agreementType: 'agreement_type',
  hasAccepted: 'has_accepted',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export class PersonAgreementsRepository extends AbstractRepository<typeof columns> {
  constructor() {
    super({ table, columns });
  }

  create = ({ personId, agreementType, hasAccepted }: CreatePersonAgreement, conn = this.query) =>
    conn<PersonAgreement>(
      this.sql`INSERT INTO ${this.table} (person_id, agreement_type, has_accepted)
                        ${this.sql.values([personId, agreementType, hasAccepted])}
              RETURNING ${this.columns.sql}`,
    ).then(this.firstRow);
}
