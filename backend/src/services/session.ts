import { suid } from 'rand-token';
import { AbstractService } from '../lib';
import { Session, User } from '../types';

export class SessionService extends AbstractService {
  getSessionResponse = async (session: Session) => ({
    user: await this.repositories.user.findById(session.userId),
    token: this.jwt.sign({ userId: session.userId, sessionId: session.id }),
    refreshToken: session.token,
  });

  async getContinuedOrNewSession(userId: User['id']) {
    const session =
      (await this.repositories.session.findActiveForUser(userId)) ||
      (await this.repositories.session.create({ userId, token: suid(64) }));
    return this.getSessionResponse(session);
  }

  async refreshSession(refreshToken: string) {
    const session = await this.repositories.session.findSessionByToken(refreshToken);
    if (!session) throw this.errors.badRequest();
    // TODO: session validation
    if (session.endedAt) return this.getContinuedOrNewSession(session.userId);
    if (new Date().getTime() - new Date(session.startedAt).getTime() >= 8.64e7 * 14) {
      await this.repositories.session.update({ id: session.id, endedAt: new Date() });
      return this.getContinuedOrNewSession(session.userId);
    }
    return this.getSessionResponse(session);
  }
}
