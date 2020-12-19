import { Static as S, Type as T } from '@sinclair/typebox';
import { agreementType, bigInt, timestampTz } from './data-types';

const hasAccepted = T.Boolean();
const personId = bigInt;
const createdAt = timestampTz;
const updatedAt = timestampTz;

export const personAgreement = T.Object({
  agreementType,
  hasAccepted,
  personId,
  createdAt,
  updatedAt,
});

export type PersonAgreement = S<typeof personAgreement>;

export const createPersonAgreement = T.Object({ agreementType, personId, hasAccepted });

export type CreatePersonAgreement = S<typeof createPersonAgreement>;
