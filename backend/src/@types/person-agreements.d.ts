import { Person } from './person';

export type AgreementType = 'TERMS_AND_CONDITIONS';

export interface PersonAgreement {
  agreementType: AgreementType;
  personId: Person['id'];
  hasAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreatePersonAgreement = Pick<PersonAgreement, 'agreementType' | 'personId' | 'hasAccepted'>;

export type CreatedPersonAgreement = CreatePersonAgreement;
