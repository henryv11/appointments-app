import { CreatePerson, Person, User, UserAuth, UserLogin } from '@types';
import { compare, hash } from 'bcrypt';
import { FastifyInstance } from 'fastify';

export const authService = ({ errors, repositories, signToken, database, log }: FastifyInstance) => ({
  async startSession({ tokenPayload }: { tokenPayload: Parameters<FastifyInstance['signToken']>[0] }) {
    const token = signToken(tokenPayload);
    await repositories.session.create({ userId: tokenPayload.id, token });
    return token;
  },
  async registerUser({
    username,
    password,
    hasAcceptedTermsAndConditions,
    ...createPerson
  }: UserLogin & CreatePerson & { hasAcceptedTermsAndConditions: boolean }) {
    const [hashedPassword, transaction] = await Promise.all([hash(password, 10), database.transaction()]);
    try {
      await transaction.begin();
      const { id: personId } = await repositories.person.create(createPerson, transaction.query);
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
      return this.startSession({ tokenPayload: user });
    } catch (error) {
      log.error(error, 'failed to create user');
      await transaction.rollback();
      throw errors.badRequest();
    }
  },
  async loginUser({
    email,
    password,
    username,
  }: {
    email?: User['username'];
    password: User['password'];
    username?: Person['email'];
  }) {
    let user: UserAuth | undefined | '' = username && (await repositories.user.findByUsername(username));
    if (!user && email) user = await repositories.user.findByEmail(email);
    if (!user || !(await compare(password, user.password))) throw errors.badRequest();
    const activeSession = await repositories.session.findActiveForUser(user.id);
    if (activeSession) return activeSession.token;
    return this.startSession({ tokenPayload: user });
  },
});
