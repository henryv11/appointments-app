import { CreatedPersonAgreement, CreatePersonAgreement } from '../schemas';
import { AbstractRepository } from './abstract';

export class PersonAgreementsRepository extends AbstractRepository {
  create = ({ personId, agreementType, hasAccepted }: CreatePersonAgreement, conn = this.query) =>
    conn<CreatedPersonAgreement>(
      `insert into person_agreements ( person_id, agreement_type, has_accepted )
        values ( $1, $2, $3 )
        returning person_id as "personId", agreement_type as "agreementType", has_accepted as "hasAccepted"`,
      [personId, agreementType, hasAccepted],
    ).then(this.firstRow);
}
