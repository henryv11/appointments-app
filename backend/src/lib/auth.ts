import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { Algorithm, sign, verify } from 'jsonwebtoken';

const jwtAuthPlugin: FastifyPluginCallback<{ secret: string; algorithm: Algorithm }> = function (
    app,
    { secret, algorithm },
    done,
) {
    const signToken: AuthInstance['signToken'] = ({ id }) => sign({ id }, secret, { algorithm });
    app.decorate('signToken', signToken)
        .decorateRequest('user', null)
        .decorateRequest('tokenError', '')
        .addHook('onRequest', (req, _, done) => {
            const headerToken = req.headers['authorization'];
            if (!headerToken) return done();
            const [, token] = headerToken.split(' ');
            try {
                const decodedToken = verify(token, secret, { algorithms: [algorithm] });
                if (typeof decodedToken === 'object') req.user = decodedToken as NonNullable<AuthRequest['user']>;
                else req.tokenError = 'invalid token';
                done();
            } catch (error) {
                req.tokenError = error.message;
                done();
            }
        })
        .addHook('onRoute', routeOptions => {
            if (routeOptions.authorize) {
                routeOptions.schema = {
                    ...routeOptions.schema,
                    headers: {
                        type: 'object',
                        properties: {
                            ...(routeOptions.schema?.headers as Record<string, Record<string, unknown>>)?.properties,
                            Authorization: {
                                type: 'string',
                                description: 'Json Web Token',
                            },
                        },
                    },
                };
                routeOptions.preValidation = [
                    (req, _, done) => {
                        if (!req.user) return done(app.errors.unauthorized(req.tokenError));
                        done();
                    },
                    ...(routeOptions.preValidation
                        ? Array.isArray(routeOptions.preValidation)
                            ? routeOptions.preValidation
                            : [routeOptions.preValidation]
                        : []),
                ];
            }
        });
    done();
};

export const jwtAuth = fp(jwtAuthPlugin);

declare module 'fastify' {
    interface FastifyRequest extends AuthRequest {}
    interface RouteOptions extends AuthRouteOptions {}
    interface RouteShorthandOptions extends AuthRouteOptions {}
    interface FastifyInstance extends AuthInstance {}
}

interface TokenPayload {
    id: number;
}

interface AuthRequest {
    user: (TokenPayload & { iat: number }) | null;
    tokenError: string;
}

interface AuthRouteOptions {
    authorize?: boolean;
}

interface AuthInstance {
    signToken: (payload: TokenPayload) => string;
}
