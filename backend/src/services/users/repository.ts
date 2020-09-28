import { User } from '../../@types';
import { query } from '../../database';

export const createUser = ({ username, password }: Pick<User, 'username' | 'password'>) =>
    query<Pick<User, 'id' | 'username'>>(
        'INSERT INTO app_user (username, password) VALUES ($1, $2) RETURNING id, username',
        username,
        password,
    );

export const findUserByUsername = (username: User['username']) =>
    query<Pick<User, 'id' | 'username' | 'password'>>(
        'SELECT id, username, password FROM app_user WHERE username = $1',
        username,
    );
