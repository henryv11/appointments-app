import { createReducerContext } from '@/lib/react/create-reducer-context';

const [UserContextProvider, UserContextConsumer, useUserContext] = createReducerContext(
  {
    profilePicture: 'https://i.stack.imgur.com/l60Hf.png',
    userId: -1,
    personId: -1,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  },
  state => state,
);

export { UserContextProvider, UserContextConsumer, useUserContext };
