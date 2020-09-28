import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { User } from '../../@types';
import { createUser, findUserByUsername } from './repository';

const PRIVATE_KEY = 'hello';
const ALGORITHM = 'RS256';
const SALT_ROUNDS = 10;

const signToken = ({ id }: Pick<User, 'id'>) => sign({ id }, PRIVATE_KEY, { algorithm: ALGORITHM });

export async function userRegistration({ username, password }: Pick<User, 'username' | 'password'>) {
    const hashedPassword = await hash(password, SALT_ROUNDS);
    const {
        rows: [user],
    } = await createUser({ username, password: hashedPassword });
    return signToken(user);
}

export async function userLogin({ username, password }: Pick<User, 'username' | 'password'>) {
    const {
        rows: [user],
    } = await findUserByUsername(username);
    if (!user) return;
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) return;
    return signToken(user);
}
