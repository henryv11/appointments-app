import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { Algorithm, sign, verify } from 'jsonwebtoken';
import { User } from '../@types';

const jwtAuthPlugin: FastifyPluginCallback<{ secret: string; algorithm: Algorithm }> = function (
    fastify,
    { secret, algorithm },
    done,
) {
    const signToken: AuthFastifyInstance['signToken'] = ({ id }) => sign({ id }, secret, { algorithm });

    fastify
        .decorate('signToken', signToken)
        .decorateRequest('user', undefined)
        .decorateRequest('tokenError', undefined)
        .addHook('onRequest', function (req, _, done) {
            const headerToken = req.headers['authorization'];
            if (!headerToken) return done();
            const [, token] = headerToken.split(' ');
            try {
                const decodedToken = verify(token, secret, { algorithms: [algorithm] });
                if (typeof decodedToken === 'object') req.user = decodedToken as AuthRequest['user'];
                done();
            } catch (error) {
                req.tokenError = error.message;
                done();
            }
        })
        .addHook('onRoute', function (routeOptions) {
            if (routeOptions.authorize)
                routeOptions.preValidation = [
                    function (req, _, done) {
                        if (!req.user) return done(fastify.errors.unauthorized(req.tokenError));
                        done();
                    },
                    ...(routeOptions.preValidation
                        ? Array.isArray(routeOptions.preValidation)
                            ? routeOptions.preValidation
                            : [routeOptions.preValidation]
                        : []),
                ];
        });

    done();
};

export const jwtAuth = fp(jwtAuthPlugin);

interface AuthRequest {
    user?: Pick<User, 'id'>;
    tokenError?: string;
}

interface AuthRouteOptions {
    authorize?: boolean;
}

interface AuthFastifyInstance {
    signToken: ({ id }: Pick<User, 'id'>) => string;
}

declare module 'fastify' {
    interface FastifyRequest extends AuthRequest {}
    interface RouteOptions extends AuthRouteOptions {}
    interface FastifyInstance extends AuthFastifyInstance {}
}
