import { FastifyInstance } from 'fastify/types/instance';
import { suid } from 'rand-token';
import { Session, User } from '../types';

export const sessionService = ({ errors, repositories, jwt }: FastifyInstance) => ({
  formatSession: async (session: Session) => ({
    user: await repositories.user.findById(session.userId),
    token: jwt.sign({ userId: session.userId, sessionId: session.id }),
    refreshToken: session.token,
  }),

  async getContinuedOrNewSession(userId: User['id']) {
    const session =
      (await repositories.session.findActiveForUser(userId)) ||
      (await repositories.session.create({ userId, token: suid(64) }));
    return this.formatSession(session);
  },

  async refreshSession(refreshToken: string) {
    const session = await repositories.session.findSessionByToken(refreshToken);
    if (!session) throw errors.badRequest();
    // TODO: session validation
    if (session.endedAt) return this.getContinuedOrNewSession(session.userId);
    if (new Date().getTime() - new Date(session.startedAt).getTime() >= 8.64e7 * 14) {
      await repositories.session.update({ id: session.id, endedAt: new Date() });
      return this.getContinuedOrNewSession(session.userId);
    }
    return this.formatSession(session);
  },
});
