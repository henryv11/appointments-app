import { User } from '../@types/user';

const host = 'localhost';
const port = 8080;
const getUrl = (path: string = '') => `http://${host}:${port}${path}`;

export const loginUser = ({ username, password }: Pick<User, 'username' | 'password'>) =>
  fetch(getUrl('/auth'), {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
  }).then(resp => resp.text());

export const registerUser = ({ username, password }: Pick<User, 'username' | 'password'>) =>
  fetch(getUrl('/auth'), {
    method: 'PUT',
    body: JSON.stringify({
      username,
      password,
    }),
  }).then(resp => resp.text());
