import { CreatedPersonAgreement, CreatePersonAgreement } from '@types';
import { FastifyInstance } from 'fastify';

export const personAgreementsRepository = ({ database: { query, firstRow } }: FastifyInstance) => ({
  create: ({ personId, agreementType, hasAccepted }: CreatePersonAgreement, queryMethod = query) =>
    queryMethod<CreatedPersonAgreement>(
      `
INSERT INTO person_agreements (
  person_id,
  agreement_type,
  has_accepted
)
VALUES (
  $1,
  $2,
  $3
)
RETURNING
  person_id AS "personId",
  agreement_type AS "agreementType",
  has_accepted AS "hasAccepted"
`,
      [personId, agreementType, hasAccepted],
    ).then(firstRow),
});
