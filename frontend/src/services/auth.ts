import { User, UserLogin, UserRegistration } from '../@types/user';
import { makeFetch } from '../lib/fetch';

const fetch = makeFetch('http://localhost/backend/auth');

export const loginUser = (body: UserLogin) =>
  fetch<AuthResponseBody>({
    method: 'POST',
    body,
  }).then(resp => {
    if (resp.status !== 200) throw new Error('login failed');
    return resp.json();
  });

export const registerUser = (body: UserRegistration) =>
  fetch<AuthResponseBody>({
    method: 'PUT',
    body,
  }).then(resp => {
    if (resp.status !== 201) throw new Error('registration failed');
    return resp.json();
  });

export const refreshToken = (token: string) =>
  fetch<AuthResponseBody>({ query: { token } }).then(resp => {
    if (resp.status !== 200) throw new Error('refreshing token failed');
    return resp.json();
  });

type AuthResponseBody = { token: string; user: Pick<User, 'username' | 'id'> };
