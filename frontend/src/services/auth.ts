import { User, UserLogin, UserRegistration } from '../@types/user';
import { join } from '../lib/path';

const basePath = 'http://localhost/backend/auth';
const getUrl = (...path: string[]) => join(basePath, ...path);

export const loginUser = (body: UserLogin): Promise<{ token: string; user: Pick<User, 'username' | 'id'> }> =>
  fetch(getUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(resp => {
    if (resp.status !== 200) throw new Error('login failed');
    return resp.json();
  });

export const registerUser = (body: UserRegistration): Promise<{ token: string; user: Pick<User, 'username' | 'id'> }> =>
  fetch(getUrl(), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(resp => {
    if (resp.status !== 201) throw new Error('registration failed');
    return resp.json();
  });

export const refreshToken = (token: string): Promise<{ token: string; user: Pick<User, 'username' | 'id'> }> =>
  fetch(getUrl(`?token=${token}`)).then(resp => {
    if (resp.status !== 200) throw new Error('refreshing token failed');
    return resp.json();
  });
