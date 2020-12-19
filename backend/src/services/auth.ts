import { compare, hash } from 'bcrypt';
import { AgreementType, LoginUser, RegisterUser, User } from '../schemas';
import { AbstractService } from './abstract';

export class AuthService extends AbstractService {
  async logoutUser({ userId }: { userId: User['id'] }) {
    await this.repositories.session.update({ endedAt: new Date().toISOString() }, { userId, endedAt: null });
  }

  async registerUser({ username, password, hasAcceptedTermsAndConditions, ...personDetails }: RegisterUser) {
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
      return this.services.session.getContinuedOrNewSession(user);
    } catch (error) {
      this.log.error(error, 'failed to create user');
      await transaction.rollback();
      throw this.errors.badRequest();
    }
  }

  async loginUser({ email, password, username }: LoginUser) {
    const connection = await this.database.connection();
    try {
      const { password: userPassword, ...user } = await this.repositories.user.auth.findOne(
        { email, username },
        connection.query,
      );
      if (!(await compare(password, userPassword))) throw this.errors.badRequest();
      return await this.services.session.getContinuedOrNewSession(user, connection.query);
    } finally {
      connection.close();
    }
  }
}
