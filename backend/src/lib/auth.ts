import { FastifyInstance, FastifyPluginCallback, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { Algorithm, sign, verify } from 'jsonwebtoken';
import { User } from '../@types';

const jwtAuthPlugin: FastifyPluginCallback<{ secret: string; algorithm: Algorithm }> = function (
    fastify,
    { secret, algorithm },
    done,
) {
    const signToken: FastifyInstance['signToken'] = ({ id }) => sign({ id }, secret, { algorithm });

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
                if (typeof decodedToken === 'object') req.user = decodedToken as FastifyRequest['user'];
                done();
            } catch (error) {
                req.tokenError = error.message;
                done();
            }
        });

    done();
};

export const jwtAuth = fp(jwtAuthPlugin);

declare module 'fastify' {
    interface FastifyRequest {
        user?: Pick<User, 'id'>;
        tokenError?: string;
    }

    interface FastifyInstance {
        signToken: ({ id }: Pick<User, 'id'>) => string;
    }
}
