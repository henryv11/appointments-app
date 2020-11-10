import { FastifyInstance } from 'fastify';
import { CreatedPersonAgreement, CreatePersonAgreement } from '../types';

export const personAgreementsRepository = ({ database: { query, firstRow } }: FastifyInstance) => ({
  create: ({ personId, agreementType, hasAccepted }: CreatePersonAgreement, _query = query) =>
    _query<CreatedPersonAgreement>(
      `insert into person_agreements ( person_id, agreement_type, has_accepted )
        values ( $1, $2, $3 )
        returning person_id as "personId", agreement_type as "agreementType", has_accepted as "hasAccepted"`,
      [personId, agreementType, hasAccepted],
    ).then(firstRow),
});
