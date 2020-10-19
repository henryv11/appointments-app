import { User, UserLogin, UserRegistration } from '../@types/user';
import { makeFetch } from '../lib/fetch';

const fetch = makeFetch('http://localhost/backend/auth');

export async function loginUser(body: UserLogin) {
  const res = await fetch<AuthResponseBody>({ method: 'POST', body });
  if (res.status !== 200) throw new Error('login failed');
  return res.json();
}

export async function registerUser(body: UserRegistration) {
  const res = await fetch<AuthResponseBody>({ method: 'PUT', body });
  if (res.status !== 201) throw new Error('registration failed');
  return res.json();
}

export async function refreshSession(refreshToken: string) {
  const res = await fetch<AuthResponseBody>({
    path: ['session', refreshToken, 'refresh'],
  });
  if (res.status !== 200) throw new Error('refreshing token failed');
  return res.json();
}

export async function logoutUser(token: string) {
  const res = await fetch({
    method: 'DELETE',
    token,
  });
  if (res.status !== 200) throw new Error('logout failed');
}

interface AuthResponseBody {
  token: string;
  refreshToken: string;
  user: Pick<User, 'username' | 'id'>;
}
