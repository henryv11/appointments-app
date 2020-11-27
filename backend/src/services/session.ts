import { suid } from 'rand-token';
import { Session, User } from '../schemas';
import { AbstractService } from './abstract';

export class SessionService extends AbstractService {
  //#region [Public]

  async getContinuedOrNewSession(userOrSession: User['id'] | Session, query = this.database.query) {
    let session =
      typeof userOrSession === 'object'
        ? userOrSession
        : await this.repositories.session.findMaybeOne({ userId: userOrSession, endedAt: null }, query);

    if (session) {
      if (new Date().getTime() - new Date(session.startedAt).getTime() >= 8.64e7 * 14) {
        await this.repositories.session.update({ endedAt: new Date() }, { id: session.id }, query);
        session = await this.repositories.session.create({ userId: session.userId, token: suid(64) }, query);
      }
    } else {
      session = await this.repositories.session.create(
        {
          userId: typeof userOrSession === 'object' ? userOrSession.userId : userOrSession,
          token: suid(64),
        },
        query,
      );
    }

    return {
      user: await this.repositories.user.findOne({ id: session.userId }, query),
      token: this.jwt.sign({ userId: Number(session.userId), sessionId: session.id }),
      refreshToken: session.token,
    };
  }

  async refreshSession(refreshToken: string) {
    const connection = await this.database.connection();
    return this.getContinuedOrNewSession(
      await this.repositories.session.findOne({ token: refreshToken }, connection.query),
      connection.query,
    ).finally(connection.close);
  }

  //#endregion
}
