import { User } from '@types';
import { compare, hash } from 'bcrypt';
import { FastifyInstance } from 'fastify';

export const authService = ({
    errors: { badRequest },
    repositories: {
        users: { create, findByUsername },
    },
    signToken,
}: FastifyInstance) => ({
    async registerUser({ username, password }: Pick<User, 'username' | 'password'>) {
        const hashedPassword = await hash(password, 10).catch(() => {
            throw badRequest();
        });
        const {
            rows: [user],
        } = await create({ username, password: hashedPassword }).catch(() => {
            throw badRequest();
        });
        return signToken(user);
    },
    async loginUser({ username, password }: Pick<User, 'username' | 'password'>) {
        const {
            rows: [user],
        } = await findByUsername(username);
        if (!user) throw badRequest();
        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) throw badRequest();
        return signToken(user);
    },
});
