import { compare, hash } from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { suid } from 'rand-token';
import { User, UserAuth, UserLogin, UserRegistration } from '../types';

export const authService = ({ errors, repositories, database, log }: FastifyInstance) => ({
  async getNewOrContinuedSession(userId: User['id']) {
    const activeSession = await repositories.session.findActiveForUser(userId);
    if (activeSession) return activeSession;
    const refreshToken = suid(64);
    return repositories.session.create({ userId, token: refreshToken });
  },

  async refreshSession(refreshToken: string) {
    const session = await repositories.session.findSessionByToken(refreshToken);
    if (!session) throw errors.badRequest();
    // TODO: session validation
    if (session.endedAt) return this.getNewOrContinuedSession(session.userId);
    if (new Date().getTime() - new Date(session.startedAt).getTime() >= 8.64e7 * 14) {
      await repositories.session.update({ id: session.id, endedAt: new Date() });
      return this.getNewOrContinuedSession(session.userId);
    }
    return session;
  },

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
      return user;
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
    return { id: user.id, username: user.username };
  },
});
