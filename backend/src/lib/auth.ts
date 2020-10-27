import { FastifyPluginCallback, preValidationHookHandler } from 'fastify';
import fp from 'fastify-plugin';
import { Algorithm, sign, verify } from 'jsonwebtoken';

const tokenSchema = {
  type: 'string',
  description: 'Json Web Token',
  example:
    'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0IiwiaWF0IjoxNjAxODE0Mzc4fQ.Cqo8aBPhJN-hVN9wpAYNnIbLZ8M8ORMAMj_6ZIQTGV_g1hx3dti5Qjelgup2eh2dEnbP3aNmLqHKA7vYrJZjBQ',
};

const jwtAuthPlugin: FastifyPluginCallback<{
  secret: string;
  algorithm: Algorithm;
}> = function (app, { secret, algorithm }, done) {
  const signToken: AuthInstance['signToken'] = ({ id }) => sign({ id }, secret, { algorithm });
  const decodeToken: AuthInstance['decodeToken'] = function (token: string) {
    const decoded = verify(token, secret, { algorithms: [algorithm] });
    if (!decoded || typeof decoded !== 'object') return;
    return decoded as Exclude<AuthRequest['user'], null>;
  };
  app.decorate('signToken', signToken);
  app.decorate('decodeToken', decodeToken);
  app.decorateRequest('user', null);
  app.decorateRequest('tokenError', '');
  app.addHook('onRequest', (req, _, done) => {
    const [, token] = req.headers['authorization']?.split(' ') || [];
    if (!token) return (req.tokenError = 'missing token'), done();
    try {
      const decodedToken = decodeToken(token);
      if (decodedToken) req.user = decodedToken;
      else req.tokenError = 'invalid token';
      done();
    } catch (error) {
      req.tokenError = error.message;
      done();
    }
  });
  app.addHook('onRoute', routeOptions => {
    if (routeOptions.authorize) {
      routeOptions.schema = {
        ...routeOptions.schema,
        headers: {
          type: 'object',
          required: [...((routeOptions.schema?.headers as { required?: string[] })?.required || []), 'authorization'],
          properties: {
            ...(routeOptions.schema?.headers as {
              properties?: Record<string, unknown>;
            })?.properties,
            authorization: tokenSchema,
          },
        },
      };
      routeOptions.preValidation = new Array<preValidationHookHandler>().concat(
        (req, _, done) => done(req.user ? undefined : app.errors.unauthorized(req.tokenError)),
        routeOptions.preValidation || [],
      );
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
  tokenError: string | '';
}

interface AuthRouteOptions {
  authorize?: boolean;
}

interface AuthInstance {
  signToken: (payload: TokenPayload) => string;
  decodeToken: (payload: string) => Exclude<AuthRequest['user'], null> | undefined;
}
