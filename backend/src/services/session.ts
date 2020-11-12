import { suid } from 'rand-token';
import { AuthResponse, Session, User } from '../schemas';
import { AbstractService } from './abstract';

export class SessionService extends AbstractService {
  getSessionResponse = async (session: Session): Promise<AuthResponse> => ({
    user: await this.repositories.user.findOne({ id: session.userId }),
    token: this.jwt.sign({ userId: session.userId, sessionId: session.id }),
    refreshToken: session.token,
  });

  async getContinuedOrNewSession(userId: User['id']) {
    const session =
      (await this.repositories.session.findOne({ userId, endedAt: null })) ||
      (await this.repositories.session.create({ userId, token: suid(64) }));
    return this.getSessionResponse(session);
  }

  async refreshSession(refreshToken: string) {
    const session = await this.repositories.session.findOne({ token: refreshToken });
    if (!session) throw this.errors.badRequest();
    // TODO: session validation
    if (session.endedAt) return this.getContinuedOrNewSession(session.userId);
    if (new Date().getTime() - new Date(session.startedAt).getTime() >= 8.64e7 * 14) {
      await this.repositories.session.update({ endedAt: new Date() }, { id: session.id });
      return this.getContinuedOrNewSession(session.userId);
    }
    return this.getSessionResponse(session);
  }
}
