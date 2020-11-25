import { suid } from 'rand-token';
import { Session, User } from '../schemas';
import { AbstractService } from './abstract';

export class SessionService extends AbstractService {
  //#region [Public]

  async getContinuedOrNewSession(userOrSession: User['id'] | Session) {
    let session =
      typeof userOrSession === 'object'
        ? userOrSession
        : await this.repositories.session.findMaybeOne({ userId: userOrSession, endedAt: null });

    if (session) {
      if (new Date().getTime() - new Date(session.startedAt).getTime() >= 8.64e7 * 14) {
        await this.repositories.session.update({ endedAt: new Date() }, { id: session.id });
        session = await this.repositories.session.create({ userId: session.userId, token: suid(64) });
      }
    } else {
      session = await this.repositories.session.create({
        userId: typeof userOrSession === 'object' ? userOrSession.userId : userOrSession,
        token: suid(64),
      });
    }

    return {
      user: await this.repositories.user.findOne({ id: session.userId }),
      token: this.jwt.sign({ userId: session.userId, sessionId: session.id }),
      refreshToken: session.token,
    };
  }

  async refreshSession(refreshToken: string) {
    return this.getContinuedOrNewSession(await this.repositories.session.findOne({ token: refreshToken }));
  }

  //#endregion
}
