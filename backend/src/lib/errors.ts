import Boom from '@hapi/boom';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const errorsPluginCallback: FastifyPluginCallback = function (app, _, done) {
    app.decorate('errors', Boom);
    app.setErrorHandler((err, req, res) =>
        res
            .status(err.statusCode || 500)
            .send(err.message || 'Internal Server Error')
            .log.error({
                reqId: req.id,
                ip: req.ip,
                host: req.hostname,
                protocol: req.protocol,
                query: req.query,
                body: req.body,
                headers: req.headers,
                code: err.code,
                message: err.message,
                method: req.method,
                url: req.url,
                user: req.user,
                stack: err.stack,
                data: ((err as unknown) as Boom.Boom).data,
            }),
    );
    done();
};

export const errors = fp(errorsPluginCallback);

interface ErrorsInstance {
    errors: typeof Boom;
}

declare module 'fastify' {
    interface FastifyInstance extends ErrorsInstance {}
}
