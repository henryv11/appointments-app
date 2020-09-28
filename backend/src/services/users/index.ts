import { RouteOptions, User } from '../../@types';
import { genericUserSchema } from './schemas';
import { userLogin, userRegistration } from './service';

const registrationRoute: RouteOptions<{ Body: Pick<User, 'username' | 'password'> }> = {
    url: '/register',
    method: 'POST',
    schema: {
        body: genericUserSchema,
    },
    handler: ({ body }) => userRegistration(body),
};

const loginRoute: RouteOptions<{ Body: Pick<User, 'username' | 'password'> }> = {
    url: '/login',
    method: 'POST',
    schema: {
        body: genericUserSchema,
    },
    handler: ({ body }) => userLogin(body),
};

export const routes = [registrationRoute, loginRoute];
