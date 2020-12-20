import { Static, Type } from '@sinclair/typebox';
import { agreementType } from './data-types';
import TypeUtil from './type-util';

const hasAccepted = Type.Boolean({ column: 'has_accepted' });
const personId = TypeUtil.BigInt({ column: 'person_id' });
const createdAt = TypeUtil.TimestampTz({ column: 'created_at' });
const updatedAt = TypeUtil.TimestampTz({ column: 'updated_at' });

export const personAgreement = TypeUtil.Table('person_agreements', {
  agreementType,
  hasAccepted,
  personId,
  createdAt,
  updatedAt,
});

export type PersonAgreement = Static<typeof personAgreement>;

export const createPersonAgreement = Type.Object({ agreementType, personId, hasAccepted });

export type CreatePersonAgreement = Static<typeof createPersonAgreement>;
