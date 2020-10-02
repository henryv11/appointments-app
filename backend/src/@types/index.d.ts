import { AuthService } from './auth';
import { UsersRepository } from './users';

export * from './auth';
export * from './users';

declare module 'fastify' {
    interface FastifyInstance {
        usersRepository: UsersRepository;
        authService: AuthService;
    }
}
