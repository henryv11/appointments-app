import { compare, hash } from 'bcrypt';
import { AbstractService } from '../lib';
import { User, UserAuth, UserLoginBody, UserRegistrationBody } from '../schemas';

export class AuthService extends AbstractService {
  async logoutUser({ userId }: { userId: User['id'] }) {
    await this.repositories.session.endAllBelongingToUser(userId);
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
          agreementType: 'TERMS_AND_CONDITIONS',
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
    let user: UserAuth | undefined | '' = username && (await this.repositories.user.findByUsername(username));
    if (!user && email) user = await this.repositories.user.findByEmail(email);
    if (!user || !(await compare(password, user.password))) throw this.errors.badRequest();
    return this.services.session.getContinuedOrNewSession(user.id);
  }
}
