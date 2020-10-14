import { UserLogin, UserRegistration } from '../@types/user';
import { join } from '../lib/path';

const basePath = 'http://localhost/backend/auth';
const getUrl = (...path: string[]) => join(basePath, ...path);

export const loginUser = ({ username, password }: UserLogin) =>
  fetch(getUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password,
      username,
    }),
  }).then(resp => {
    if (resp.status !== 201) throw new Error('login failed');
    return resp.text();
  });

export const registerUser = ({
  dateOfBirth,
  email,
  firstName,
  hasAcceptedTermsAndConditions,
  lastName,
  password,
  username,
}: UserRegistration) =>
  fetch(getUrl(), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateOfBirth,
      email,
      firstName,
      hasAcceptedTermsAndConditions,
      lastName,
      password,
      username,
    }),
  }).then(resp => {
    if (resp.status !== 201) throw new Error('registration failed');
    return resp.text();
  });
