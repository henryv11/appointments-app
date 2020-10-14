import { CreatePerson, Person, User, UserAuth, UserLogin } from '@types';
import { compare, hash } from 'bcrypt';
import { FastifyInstance } from 'fastify';

export const authService = ({ errors, repositories, signToken, database, log }: FastifyInstance) => ({
  async startSession({ user }: { user: UserAuth }) {
    const token = signToken(user);
    await repositories.session.create({ userId: user.id, token });
    return token;
  },
  async registerUser({
    username,
    password,
    hasAcceptedTermsAndConditions,
    ...personCreation
  }: UserLogin & CreatePerson & { hasAcceptedTermsAndConditions: boolean }) {
    const hashedPassword = await hash(password, 10);
    const transaction = await database.transaction();
    try {
      await transaction.begin();
      const person = await repositories.person.create(personCreation, transaction.query);
      await repositories.personAgreements.create(
        {
          personId: person.id,
          agreementType: 'TERMS_AND_CONDITIONS',
          hasAccepted: hasAcceptedTermsAndConditions,
        },
        transaction.query,
      );
      const user = await repositories.user.create(
        {
          username,
          password: hashedPassword,
          personId: person.id,
        },
        transaction.query,
      );
      await transaction.commit();
      return this.startSession({ user: { ...user, password: hashedPassword } });
    } catch (error) {
      log.error(error, 'failed to create user');
      await transaction.rollback();
      throw errors.badRequest();
    }
  },
  async loginUser({
    username,
    email,
    password,
  }: {
    username?: Person['email'];
    email?: User['username'];
    password: User['password'];
  }) {
    let user: UserAuth | undefined | '' = username && (await repositories.user.findByUsername(username));
    if (!user && email) user = await repositories.user.findByEmail(email);
    if (!user || !(await compare(password, user.password))) throw errors.badRequest();
    const activeSession = await repositories.session.findActiveForUser(user.id);
    if (activeSession) return activeSession.token;
    return this.startSession({ user });
  },
});
