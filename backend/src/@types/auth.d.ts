import { User } from './users';

export interface AuthService {
    registerUser: (user: Pick<User, 'username' | 'password'>) => Promise<string>;
    loginUser: (user: Pick<User, 'username' | 'password'>) => Promise<string>;
}
