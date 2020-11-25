import { FastifyPluginCallback, preValidationHookHandler } from 'fastify';
import fp from 'fastify-plugin';
import { Algorithm, sign, verify } from 'jsonwebtoken';

//#region [Constants]

const tokenSchema = {
  type: 'string',
  description: 'Json Web Token',
  example:
    'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0IiwiaWF0IjoxNjAxODE0Mzc4fQ.Cqo8aBPhJN-hVN9wpAYNnIbLZ8M8ORMAMj_6ZIQTGV_g1hx3dti5Qjelgup2eh2dEnbP3aNmLqHKA7vYrJZjBQ',
};

//#endregion

//#region [Plugin]

const jwtAuthPlugin: FastifyPluginCallback<{
  secret: string;
  algorithm: Algorithm;
}> = function (app, { secret, algorithm }, done) {
  const jwt: FastifyJWT = Object.freeze({
    sign: ({ userId, sessionId }) => sign({ userId, sessionId }, secret, { algorithm }),
    decode(token) {
      if (!token) throw new Error('missing token');
      const decoded = verify(token, secret, { algorithms: [algorithm] });
      if (!decoded || typeof decoded !== 'object' || ['userId', 'sessionId'].some(key => !(key in decoded)))
        throw new Error('invalid token payload');
      return decoded as DecodedToken;
    },
  });
  app.decorate('jwt', jwt);
  app.decorateRequest('user', null);
  app.decorateRequest('tokenError', '');
  app.addHook('onRequest', (req, _, done) => {
    const [, token] = req.headers['authorization']?.split(' ') || [];
    try {
      req.user = jwt.decode(token);
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

//#endregion

//#region [Declaration merging]

declare module 'fastify' {
  interface FastifyRequest {
    user: DecodedToken | null;
    tokenError: string | '';
  }
  interface RouteOptions {
    authorize?: boolean;
  }
  interface RouteShorthandOptions {
    authorize?: boolean;
  }
  interface FastifyInstance {
    jwt: Readonly<FastifyJWT>;
  }
}

//#endregion

//#region [Types]

interface DecodedToken extends TokenPayload {
  iat: number;
}

interface TokenPayload {
  userId: number;
  sessionId: number;
}

interface FastifyJWT {
  sign: (payload: TokenPayload) => string;
  decode: (payload: string | undefined | null) => DecodedToken;
}

//#endregion
