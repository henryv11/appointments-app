import { User } from '@types';
import { FastifyInstance } from 'fastify';

export const usersRepository = ({ database: { query } }: FastifyInstance) => ({
    create: ({ username, password }: Pick<User, 'username' | 'password'>) =>
        query<Pick<User, 'id' | 'username'>>(
            'INSERT INTO app_user (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, password],
        ),

    findByUsername: (username: string) =>
        query<Pick<User, 'id' | 'username' | 'password'>>(
            'SELECT id, username, password FROM app_user WHERE username = $1',
            [username],
        ),
});
