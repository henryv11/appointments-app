import { User, UserAuth, UserLogin, UserRegistration } from '@types';
import { compare, hash } from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { suid } from 'rand-token';

export const authService = ({ errors, repositories, signToken, database, log }: FastifyInstance) => ({
  async getSession({ tokenPayload }: { tokenPayload: Parameters<FastifyInstance['signToken']>[0] }) {
    const token = signToken(tokenPayload);
    const activeSession = await repositories.session.findActiveForUser(tokenPayload.id);
    if (activeSession) return { session: activeSession, token };
    const refreshToken = suid(64);
    const session = await repositories.session.create({ userId: tokenPayload.id, token: refreshToken });
    return { session, token };
  },

  async refreshSession(refreshToken: string) {
    const session = await repositories.session.findSessionByToken(refreshToken);
    if (!session) throw errors.badRequest();
    // TODO: session validation
    if (session.endedAt) return this.getSession({ tokenPayload: { id: session.userId } });
    if (new Date().getTime() - new Date(session.startedAt).getTime() >= 8.64e7 * 14) {
      await repositories.session.update({ id: session.id, endedAt: new Date() });
      return this.getSession({ tokenPayload: { id: session.userId } });
    }
    return { session, token: signToken({ id: session.userId }) };
  },

  async logoutUser({ userId }: { userId: User['id'] }) {
    await repositories.session.endAllBelongingToUser(userId);
  },

  async registerUser({ username, password, hasAcceptedTermsAndConditions, ...personDetails }: UserRegistration) {
    const [hashedPassword, transaction] = await Promise.all([hash(password, 10), database.transaction()]);
    try {
      await transaction.begin();
      const { id: personId } = await repositories.person.create(personDetails, transaction.query);
      const [user] = await Promise.all([
        repositories.user.create(
          {
            password: hashedPassword,
            personId,
            username,
          },
          transaction.query,
        ),
        repositories.personAgreements.create(
          {
            agreementType: 'TERMS_AND_CONDITIONS',
            hasAccepted: hasAcceptedTermsAndConditions,
            personId,
          },
          transaction.query,
        ),
      ]);
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
