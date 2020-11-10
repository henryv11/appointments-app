import { compare, hash } from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { User, UserAuth, UserLogin, UserRegistration } from '../types';

export const authService = ({ errors, repositories, database, log, services: { session } }: FastifyInstance) => ({
  async logoutUser({ userId }: { userId: User['id'] }) {
    await repositories.session.endAllBelongingToUser(userId);
  },

  async registerUser({ username, password, hasAcceptedTermsAndConditions, ...personDetails }: UserRegistration) {
    const [hashedPassword, transaction] = await Promise.all([hash(password, 10), database.transaction()]);
    try {
      await transaction.begin();
      const user = await repositories.user.create(
        {
          password: hashedPassword,
          username,
        },
        transaction.query,
      );
      const { id: personId } = await repositories.person.create(
        { ...personDetails, userId: user.id },
        transaction.query,
      );
      repositories.personAgreements.create(
        {
          agreementType: 'TERMS_AND_CONDITIONS',
          hasAccepted: hasAcceptedTermsAndConditions,
          personId,
        },
        transaction.query,
      );
      await transaction.commit();
      return this.loginUser({ username, password });
    } catch (error) {
      log.error(error, 'failed to create user');
      await transaction.rollback();
      throw errors.badRequest();
    }
  },

  async loginUser({ email, password, username }: UserLogin) {
    let user: UserAuth | undefined | '' = username && (await repositories.user.findByUsername(username));
    if (!user && email) user = await repositories.user.findByEmail(email);
    if (!user || !(await compare(password, user.password))) throw errors.badRequest();
    return session.getContinuedOrNewSession(user.id);
  },
});
