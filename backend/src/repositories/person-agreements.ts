import { AbstractRepository } from '../lib';
import { CreatedPersonAgreement, CreatePersonAgreement } from '../types';

export class PersonAgreementsRepository extends AbstractRepository {
  create = ({ personId, agreementType, hasAccepted }: CreatePersonAgreement, _query = this.query) =>
    _query<CreatedPersonAgreement>(
      `insert into person_agreements ( person_id, agreement_type, has_accepted )
        values ( $1, $2, $3 )
        returning person_id as "personId", agreement_type as "agreementType", has_accepted as "hasAccepted"`,
      [personId, agreementType, hasAccepted],
    ).then(this.firstRow);
}
