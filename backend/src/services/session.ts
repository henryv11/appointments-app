import { suid } from 'rand-token';
import { PublicUser, SessionResponse } from '../schemas';
import { AbstractService } from './abstract';

export class SessionService extends AbstractService {
  async get(user: PublicUser, query = this.database.query): Promise<SessionResponse> {
    // TODO: validate user to previous sessions

    let session = await this.repositories.session.findMaybeOne({ userId: user.id, endedAt: null }, query);

    if (session) {
      if (new Date().getTime() - new Date(session.startedAt).getTime() >= 8.64e7 * 14) {
        await this.repositories.session.update({ endedAt: new Date().toISOString() }, { id: session.id }, query);
        session = await this.repositories.session.create({ userId: session.userId, token: suid(64) }, query);
      }
    } else {
      session = await this.repositories.session.create(
        {
          userId: user.id,
          token: suid(64),
        },
        query,
      );
    }

    return {
      userId: user.id,
      token: this.jwt.sign({ userId: session.userId, sessionId: session.id }),
      refreshToken: session.token,
    };
  }

  async refresh(refreshToken: string) {
    const connection = await this.database.connection();
    try {
      const user = await this.repositories.user.findOne({ sessionToken: refreshToken }, connection.query);
      return await this.get(user, connection.query);
    } finally {
      connection.close();
    }
  }
}
