import { QueryResult } from 'pg';

export interface User {
    id: number;
    username: string;
    password: string;
}

export interface UsersRepository {
    createUser: ({
        username,
        password,
    }: Pick<User, 'username' | 'password'>) => Promise<QueryResult<Pick<User, 'id' | 'username'>>>;
    findUserByUsername: (username: string) => Promise<QueryResult<Pick<User, 'username' | 'password' | 'id'>>>;
}
