import { compare, hash } from 'bcrypt';
import { AgreementType, User, UserLoginBody, UserRegistrationBody } from '../schemas';
import { AbstractService } from './abstract';

export class AuthService extends AbstractService {
  /* #region  Public */
  async logoutUser({ userId }: { userId: User['id'] }) {
    await this.repositories.session.update({ endedAt: new Date() }, { userId, endedAt: null });
  }

  async registerUser({ username, password, hasAcceptedTermsAndConditions, ...personDetails }: UserRegistrationBody) {
    const [hashedPassword, transaction] = await Promise.all([hash(password, 10), this.database.transaction()]);
    try {
      await transaction.begin();
      const user = await this.repositories.user.create(
        {
          password: hashedPassword,
          username,
        },
        transaction.query,
      );
      const person = await this.repositories.person.create({ ...personDetails, userId: user.id }, transaction.query);
      await this.repositories.personAgreements.create(
        {
          agreementType: AgreementType.TERMS_AND_CONDITIONS,
          hasAccepted: hasAcceptedTermsAndConditions,
          personId: person.id,
        },
        transaction.query,
      );
      await transaction.commit();
      return this.loginUser({ username, password });
    } catch (error) {
      this.log.error(error, 'failed to create user');
      await transaction.rollback();
      throw this.errors.badRequest();
    }
  }

  async loginUser({ email, password, username }: UserLoginBody) {
    const user = await this.repositories.user.findOneWithPassword({ email, username });
    if (!(await compare(password, user.password))) throw this.errors.badRequest();
    return this.services.session.getContinuedOrNewSession(user.id);
  }
  /* #endregion */
}
