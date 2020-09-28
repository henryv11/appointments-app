import { routes as appointmentRoutes } from './appointments';
import { routes as usersRoutes } from './users';

export const routes = [...appointmentRoutes, ...usersRoutes];
