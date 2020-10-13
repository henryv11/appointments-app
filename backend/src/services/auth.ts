import { CreatePerson, UserLogin } from '@types';
import { compare, hash } from 'bcrypt';
import { FastifyInstance } from 'fastify';

export const authService = ({
  errors,
  repositories,
  signToken,
  database,
  log,
}: FastifyInstance) => ({
  async registerUser({
    username,
    password,
    hasAcceptedTermsAndConditions,
    ...personCreation
  }: UserLogin & CreatePerson & { hasAcceptedTermsAndConditions: boolean }) {
    const [hashedPassword, connection] = await Promise.all([
      hash(password, 10),
      database.connect(),
    ]);
    try {
      await connection.query('BEGIN');
      const person = await repositories.person.create(
        personCreation,
        connection.query,
      );
      await repositories.personAgreements.create(
        {
          personId: person.id,
          agreementType: 'TERMS_AND_CONDITIONS',
          hasAccepted: hasAcceptedTermsAndConditions,
        },
        connection.query,
      );
      const user = await repositories.user.create(
        {
          username,
          password: hashedPassword,
          personId: person.id,
        },
        connection.query,
      );
      await connection.query('COMMIT');
      return { user, token: signToken(user) };
    } catch (error) {
      await connection.query('ROLLBACK');
      log.error('failed to register user', error);
      throw errors.badRequest();
    }
  },
  async loginUser({ username, password }: UserLogin) {
    const user = await repositories.user.findByUsername(username);
    if (!user) throw errors.badRequest();
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) throw errors.badRequest();
    return {
      user: { id: user.id, username: user.username },
      token: signToken(user),
    };
  },
});
