import { User } from '../@types/user';
import { join } from '../lib/path';

const basePath = 'http://localhost:8080/';
const getUrl = (...path: string[]) => join(basePath, ...path);

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
