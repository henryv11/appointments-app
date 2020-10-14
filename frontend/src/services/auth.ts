import { UserLogin, UserRegistration } from '../@types/user';
import { join } from '../lib/path';

const basePath = 'http://localhost/backend';
const getUrl = (...path: string[]) => join(basePath, ...path);

export const loginUser = ({ username, password }: UserLogin) =>
  fetch(getUrl('/auth'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then(resp => {
    if (resp.status !== 201) throw new Error('login failed');
    return resp.text();
  });

export const registerUser = ({
  username,
  password,
  dateOfBirth,
  email,
  firstName,
  lastName,
  hasAcceptedTermsAndConditions,
}: UserRegistration) =>
  fetch(getUrl('/auth'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      dateOfBirth,
      email,
      hasAcceptedTermsAndConditions,
      firstName,
      lastName,
    }),
  }).then(resp => {
    if (resp.status !== 201) throw new Error('registration failed');
    return resp.text();
  });
